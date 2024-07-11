/* eslint-disable no-console */
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

import { connectRoutes } from './routes';
import { loadServerlessHandler } from './tools/serverless.handler.tool';

config();

const app = express().disable('x-powered-by');
const corsOptions = cors({
  optionsSuccessStatus: 200,
  origin: '*',
});
app.use(corsOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectRoutes(app);
module.exports.app = app;
module.exports.handler = loadServerlessHandler(app);
