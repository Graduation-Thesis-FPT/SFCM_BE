import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { EquipmentType } from '../models/equipment-type.model';

const validateInsertEquipType = (data: EquipmentType) => {
  const equipmentSchema = Joi.object({
    EQU_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã trang thiết bị không được để trống #thêm',
    }),
    EQU_TYPE: Joi.string().trim().required().messages({
      'any.required': 'Loại trang thiết bị không được để trống #thêm',
    }),
    EQU_CODE_NAME: Joi.string().trim().required().messages({
      'any.required': 'Tên trang thiết bị không được để trống #thêm',
    }),
    REF_ROWGUID: Joi.string().trim().required().messages({
      'any.required': 'Tên trang thiết bị không được để trống #thêm',
    }),
    BLOCK: Joi.string().trim().required().messages({
      'any.required': 'Tên trang thiết bị không được để trống #thêm',
    }),
  });

  return equipmentSchema.validate(data);
};

const validateUpdateEquipType = (data: EquipmentType) => {
  const gateSchema = Joi.object({
    EQU_TYPE: Joi.string().required().messages({
      'any.required': 'Loại trang thiết bị không được để trống #cập nhật',
    }),
    EQU_TYPE_NAME: Joi.optional(),
  });

  return gateSchema.validate(data);
};

const validateEquipTypeRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const equipInfo of insert) {
      const { error, value } = validateInsertEquipType(equipInfo);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const equipInfo of update) {
      const { error, value } = validateUpdateEquipType(equipInfo);

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

export { validateEquipTypeRequest };
