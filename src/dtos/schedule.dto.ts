export class ScheduleDto {
    userId: string;
    day: string;
    startTime: string;
    endTime: string;
    static toDto(schedule: any): ScheduleDto {
        return {
            userId: schedule.userId,
            day: schedule.day,
            startTime: `${schedule.startHour}:${schedule.startMinutes}`,
            endTime: `${schedule.endHour}:${schedule.endMinutes}`
        } as ScheduleDto;
    }
}