import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { Container } from '../../models/container.model';
import { BadRequestError } from '../../core/error.response';

const validateInsertContainer = (data: Container) => {
  const methodSchema = Joi.object({
    VOYAGEKEY: Joi.string().trim().required().messages({
      'any.required': 'Mã tàu không được để trống #thêm',
    }),
    BILLOFLADING: Joi.string().trim().required().messages({
      'any.required': 'Số bill không được để trống #thêm',
    }),
    SEALNO: Joi.string().trim().required().messages({
      'any.required': 'Số seal không được để trống #thêm',
    }),
    CNTRNO: Joi.string().required().messages({
      'any.required': 'Số container không được để trống #thêm',
    }),
    CNTRSZTP: Joi.string().trim().required().messages({
      'any.required': 'Kích cỡ container không được để trống #thêm',
    }),
    STATUSOFGOOD: Joi.boolean(),
    ITEM_TYPE_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã loại hàng hóa không được để trống #thêm',
    }),
    COMMODITYDESCRIPTION: Joi.string().trim(),
    CONSIGNEE: Joi.string().trim().required().messages({
      'any.required': 'Mã đại lý không được để trống #thêm',
    }),
  });

  return methodSchema.validate(data);
};

const validateUpdateContainer = (data: Container) => {
  const methodSchema = Joi.object({
    ROWGUID: Joi.string().trim().required().guid({ version: 'uuidv4' }).messages({
      'any.required': 'Mã container không được để trống #cập nhật',
      'string.guid': 'Mã container phải là UUID hợp lệ #cập nhật',
    }),
    VOYAGEKEY: Joi.string().trim().required().messages({
      'any.required': 'Mã tàu không được để trống #cập nhật',
    }),
    BILLOFLADING: Joi.string().trim().optional(),
    SEALNO: Joi.string().trim().optional(),
    CNTRNO: Joi.string().optional(),
    CNTRSZTP: Joi.string().optional(),
    STATUSOFGOOD: Joi.boolean().optional(),
    ITEM_TYPE_CODE: Joi.string().trim().optional(),
    COMMODITYDESCRIPTION: Joi.string().trim().optional(),
    CONSIGNEE: Joi.string().trim().optional(),
  });

  return methodSchema.validate(data);
};

const validateContainerRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert?.length === 0 && update?.length === 0) {
    throw new BadRequestError();
  }

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const containerInfo of insert) {
      const { error, value } = validateInsertContainer(containerInfo);

      if (error) {
        // console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const containerInfo of update) {
      const { error, value } = validateUpdateContainer(containerInfo);

      if (error) {
        // console.log(error.details);
        throw new BadRequestError(error.message);
      }

      updateData.push(value);
    }
  }

  // if (insert) checkDuplicatedID(insert, ['VOYAGEKEY'], 'thêm mới');
  // if (update) checkDuplicatedID(update, ['VOYAGEKEY'], 'cập nhật');
  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validateContainerRequest };
