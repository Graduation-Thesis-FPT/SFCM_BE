import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import _ from 'lodash';
import { BadRequestError } from '../core/error.response';

const isValidInfor = async (requestData: object) => {
  const errors = await validate(requestData);
  if (errors.length > 0) {
    const errorMessages = errors.map(error => Object.values(error.constraints)).join(', ');
    throw new BadRequestError(`${errorMessages}`);
  }
};

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

const removeUndefinedProperty = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }

    if (typeof obj[key] === 'object') {
      removeUndefinedProperty(obj[key]);
    }
  });

  return obj;
};

const getInfoData = (object: object, fields: string[]) => {
  return _.pick(object, fields);
};

export { removeUndefinedProperty, asyncHandler, isValidInfor, getInfoData };
