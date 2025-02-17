import { Op } from "sequelize";
import { ScheduleDto } from "../dtos/schedule.dto";
import { Schedule } from '../models';
import { ScheduleTime } from "../dtos/schedule-time.dto";
import { sendSQSMessage } from "../jobs/producers/schedule.producer.job";

export const createSchedule = async (scheduleDto: ScheduleDto): Promise<{ data: ScheduleDto | null, message: string, success: boolean } | undefined> => {
    try {
        const { day, endTime, startTime, userId } = scheduleDto;
        const { hours: startHour, minutes: startMinutes } = resolveAMPMTime(startTime);
        const { hours: endHour, minutes: endMinutes } = resolveAMPMTime(endTime);
        
        if (startHour > endHour || (startHour === endHour && startMinutes >= endMinutes)) {
            return { 
                data: null,
                message: 'Error: start time must be less than end time',
                success: false
            };
        };
        // Check for overlapping hours
        const isOverlapping = await checkOverlappingSchedule(
            userId, 
            day, 
            { 
                endHour,
                endMinutes,
                startHour,
                startMinutes,
            });
        
        if(isOverlapping) {
            return { data: null, message: 'Error: schedule time overlaps', success: false }; 
        }
        // Save schedule to database
        const schedule = await Schedule.create({ 
            userId, 
            day, 
            endHour, 
            endMinutes, 
            startHour,
            startMinutes,
        });

        const dto = ScheduleDto.toDto(schedule);
        await sendSQSMessage({ key: dto.id, scheduleBody: JSON.stringify(dto) });

        return { data: dto, message: 'schedule retrieved', success: true };    
    } catch (error: any) {
        return { data: null, message: error.message, success: false };
    };
};

export const findSchedule = async (userId: string, scheduleId: string): Promise<{ data: ScheduleDto | null, message: string, success: boolean } | undefined> => {
    try {
        const schedule = await Schedule.findOne({ 
            where: { userId, id: scheduleId }
        });
        if(!schedule) {
            return { data: null, message: 'schedule does not exist', success: false };
        }
        return { data: ScheduleDto.toDto(schedule), message: 'schedule retrieved', success: true };    
    } catch (error: any) {
        return { data: null, message: error.message, success: false };
    };
}

export const deleteSchedule = async (userId: string, scheduleId: string) => {
    try {
        const schedule = await Schedule.findOne({ 
            where: { userId, id: scheduleId }
        });
        if(!schedule) {
            return { data: null, message: 'schedule does not exist', success: false };
        }
        const result = await Schedule.destroy({ 
            where: { userId, id: scheduleId }
        });
        result
        return { deleted: result > 0, success: true };    
    } catch (error: any) {
        return { data: null, message: error.message, success: false };
    };
}

export const updateSchedule = async (scheduleDto: ScheduleDto): Promise<{ data: ScheduleDto | null, message: string, success: boolean } | undefined> => {
    try {
        const { day, endTime, startTime, userId, id } = scheduleDto;
        const result = await findSchedule(userId, id);
        if(!result?.data) {
            return { data: null, message: 'schedule does not exist', success: false };
        }

        const { hours: startHour, minutes: startMinutes } = resolveAMPMTime(startTime);
        const { hours: endHour, minutes: endMinutes } = resolveAMPMTime(endTime);
        
        if (startHour > endHour || (startHour === endHour && startMinutes >= endMinutes)) {
            return { 
                data: null,
                message: 'Error: start time must be less than end time',
                success: false
            };
        };
        // Check for overlapping hours
        const isOverlapping = await checkOverlappingSchedule(
            userId, 
            day, 
            { 
                endHour,
                endMinutes,
                startHour,
                startMinutes,
            });
        
        if(isOverlapping) {
            return { data: null, message: 'Error: schedule time overlaps', success: false }; 
        }
        // Save schedule to database
        const schedule = await Schedule.update({ 
            userId, 
            day, 
            endHour, 
            endMinutes, 
            startHour,
            startMinutes,
        },
        {
            where: { userId, id },
        }
        );
        return await findSchedule(userId, id); 
    } catch (error: any) {
        return { data: null, message: error.message, success: false };
    };
};

export const checkIfOnline = async (userId: string, timestamp: string) => {
    try {
        const date = new Date(timestamp);
        const dayOfWeek = date.getUTCDay();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const schedule = await Schedule.findOne({
            where: {
              userId,
              day: weekDay[`${dayOfWeek}`],
              [Op.and]: [
                {
                  [Op.or]: [
                    { startHour: { [Op.lt]: hour } },
                    { startHour: hour, startMinutes: { [Op.lte]: minute } }
                  ]
                },
                {
                  [Op.or]: [
                    { endHour: { [Op.gt]: hour } },
                    { endHour: hour, endMinutes: { [Op.gte]: minute } }
                  ]
                }
              ]
            }
          });

        return { online: !!schedule };     
    } catch (error: any) {
        return { data: null, message: error.message, success: false };
    }
  };

const checkOverlappingSchedule = async (
    userId: string, 
    day: string, 
    {startHour, startMinutes, endHour, endMinutes }: ScheduleTime
    ): Promise<boolean>  => {
    const schedule = await Schedule.findOne({
        where: {
            userId,
            day,
            [Op.or]: [
                {
                    startHour: { [Op.lt]: endHour },
                    endHour: { [Op.gt]: startHour },
                },
                {
                    startHour,
                    startMinutes: { [Op.lt]: endMinutes },
                    endMinutes: { [Op.gt]: startMinutes }
                },
                {
                    endHour,
                    endMinutes: { [Op.gt]: startMinutes }
                },
                {
                    startHour: { [Op.gte]: startHour },
                    endHour: { [Op.lte]: endHour }
                },
                {
                    
                    startHour: { [Op.eq]: endHour },
                    startMinutes: { [Op.lt]: endMinutes }
                },
                {
                    startHour: { [Op.gte]: startHour },
                    endHour: { [Op.lte]: endHour },
                    startMinutes: { [Op.gte]: startMinutes },
                    endMinutes: { [Op.lte]: endMinutes }
                },
            ]
        }
    });

    return schedule !== null;
};

const resolveAMPMTime = (time: string): { hours: number, minutes: number } => {
    const regexAMPM = /(AM|PM)/gi;
    const match = time.match(regexAMPM);
    const sanitizedTime = time.replace(regexAMPM, '').trim();

    let [hours, minutes] = sanitizedTime.split(':');
    
    let hoursInteger = Number(hours);
    let minutesInteger = Number(minutes);

    if(match !== null && (match[0] === 'pm' || match[0] === 'PM') && Number(hours) !== 12) {
        hoursInteger += 12;
    }
    return { hours: Number(hoursInteger), minutes: Number(minutesInteger) }
};

const weekDay = {
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
    '7': 'Sunday'
} as { [key: string]: string };