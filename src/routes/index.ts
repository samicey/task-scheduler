import * as express from 'express';

export const connectRoutes = (app: express.Application): void => {
  app.get('/api', (_, response) => {
    response.status(200).json({
      message: 'Welcome to the Task Scheduler 2.0',
    });
  });
};
