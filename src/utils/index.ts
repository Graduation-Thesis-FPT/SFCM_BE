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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const isValidID = (id: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(id)) return false;
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkDuplicatedID = (data: any, key: string, tag: string) => {
  const uniqueData = _.uniqBy(data, key);
  if (uniqueData.length !== data.length) {
    throw new BadRequestError(`Duplicate ${key} in ${tag} operation`);
  }
};

export {
  removeUndefinedProperty,
  asyncHandler,
  isValidInfor,
  getInfoData,
  isValidID,
  checkDuplicatedID,
};
