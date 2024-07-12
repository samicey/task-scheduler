import * as express from 'express';
import { scheduleRoutes } from '../apis';

export const connectRoutes = (app: express.Application): void => {
  app.get('/schedule/api', (_, response) => {
    response.status(200).json({
      message: 'Welcome to the Task Scheduler 2.0',
    });
  });
  scheduleRoutes(app);
};
