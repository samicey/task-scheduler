import express from 'express';
import { createSchedule } from '../services/schedule.service';

export const scheduleRoutes = (app: express.Application ): void => {
    app.post('/schedule/create', async (request: express.Request, response: express.Response) => {
        const schedule = await createSchedule(request.body);
        response.status(200).json(schedule)
    });
}