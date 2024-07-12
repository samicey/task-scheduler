import express from 'express';
import { createSchedule, findSchedule, updateSchedule, checkIfOnline, deleteSchedule} from '../services';
import { validateScheduleRequestParameter, validateScheduleRequestSchema, validateScheduleStatusRequestParameter } from '../middlewares/validations.middleware';

export const scheduleRoutes = (app: express.Application ): void => {
    app.post('/schedule', validateScheduleRequestSchema, async (request: express.Request, response: express.Response) => {
        const schedule = await createSchedule(request.body);
        response.status(200).json(schedule)
    });
    app.get('/schedule/user/:userId/:scheduleId', validateScheduleRequestParameter, async (request: express.Request, response: express.Response) => {
        const { userId, scheduleId } = request.params;
        const schedule = await findSchedule(userId, scheduleId);
        response.status(200).json(schedule)
    });
    app.patch('/schedule/:userId/:scheduleId', validateScheduleRequestSchema, validateScheduleRequestParameter, async (request: express.Request, response: express.Response) => {
        const schedule = await updateSchedule(request.body);
        response.status(200).json(schedule)
    });
    app.get('/schedule/check-status/:userId/:timestamp', validateScheduleStatusRequestParameter, async (request: express.Request, response: express.Response) => {
        const { userId, timestamp } = request.params;
        const schedule = await checkIfOnline(userId, timestamp);
        response.status(200).json(schedule)
    });
    app.delete('/schedule/user/:userId/:scheduleId', validateScheduleRequestParameter, async (request: express.Request, response: express.Response) => {
        const { userId, scheduleId } = request.params;
        const schedule = await deleteSchedule(userId, scheduleId);
        response.status(200).json(schedule)
    });
    
}