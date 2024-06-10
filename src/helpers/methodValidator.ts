import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { EquipmentType } from '../models/equipment-type.model';
import { checkDuplicatedID } from '../utils';

const validateInsertMethod = (data: EquipmentType) => {
  const methodSchema = Joi.object({
    METHOD_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã trang thiết bị không được để trống #thêm',
    }),
    METHOD_NAME: Joi.string().trim().required().messages({
      'any.required': 'Loại trang thiết bị không được để trống #thêm',
    }),
    IS_IN_OUT: Joi.string().trim(),
    IS_SERVICE: Joi.number().optional(),
  });

  return methodSchema.validate(data);
};

const validateUpdateMethod = (data: EquipmentType) => {
  const methodSchema = Joi.object({
    METHOD_CODE: Joi.string().required().messages({
      'any.required': 'Loại trang thiết bị không được để trống #cập nhật',
    }),
    METHOD_NAME: Joi.optional(),
    IS_IN_OUT: Joi.optional(),
    IS_SERVICE: Joi.optional(),
  });

  return methodSchema.validate(data);
};

const validateMethodRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  checkDuplicatedID(insert, 'METHOD_CODE', 'add');
  checkDuplicatedID(update, 'METHOD_CODE', 'update');

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const methodInfo of insert) {
      const { error, value } = validateInsertMethod(methodInfo);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const methodInfo of update) {
      const { error, value } = validateUpdateMethod(methodInfo);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      updateData.push(value);
    }
  }
  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validateMethodRequest };
