import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateScheduleRequestSchema = (request: Request, _response: Response, next: NextFunction): void => {
  const scheduleRequestSchema = Joi.object({
    id: Joi.string(),
    userId: Joi.string().required(),
    day: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
  });

  const { error } = scheduleRequestSchema.validate(request.body);

  if (!error) {
    next();
  } else {
    _response.status(400).json({ message: error.message, success: false });
  }
};

export const validateScheduleRequestParameter = (request: Request, _response: Response, next: NextFunction): void => {
    const scheduleRequestParameter = Joi.object({
      userId: Joi.string().required(),
      scheduleId: Joi.string().required()
    });
  
    const { error } = scheduleRequestParameter.validate(request.params);
  
    if (!error) {
      next();
    } else {
        _response.status(400).json({ message: error.message, success: false });
    }
  };

  export const validateScheduleStatusRequestParameter = (request: Request, _response: Response, next: NextFunction): void => {
    const scheduleRequestParameter = Joi.object({
      timestamp: Joi.string().required(),
      scheduleId: Joi.string().required()
    });
  
    const { error } = scheduleRequestParameter.validate(request.params);
  
    if (!error) {
      next();
    } else {
        _response.status(400).json({ message: error.message, success: false });
    }
  };
