export class ScheduleDto {
    id: string;
    userId: string;
    day: string;
    startTime: string;
    endTime: string;
    static toDto(schedule: any): ScheduleDto {
        return {
            id: schedule.id,
            userId: schedule.userId,
            day: schedule.day,
            startTime: `${schedule.startHour}:${schedule.startMinutes}`,
            endTime: `${schedule.endHour}:${schedule.endMinutes}`
        } as ScheduleDto;
    }
}