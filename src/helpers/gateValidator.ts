import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { Gate } from '../models/gate.model';

const validateInsertGate = (data: Gate) => {
  const gateSchema = Joi.object({
    GATE_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã cổng không được để trống #thêm',
    }),
    GATE_NAME: Joi.string().trim().required().messages({
      'any.required': 'Tên cổng không được để trống #thêm',
    }),
    IS_IN_OUT: Joi.string().trim().required().messages({
      'any.required': 'Trạng thái cổng không được để trống #thêm',
    }),
  });

  return gateSchema.validate(data);
};

const validateUpdateGate = (data: Gate) => {
  const gateSchema = Joi.object({
    GATE_CODE: Joi.string().required().messages({
      'any.required': 'Mã cổng không được để trống #cập nhật',
    }),
    GATE_NAME: Joi.optional(),
    IS_IN_OUT: Joi.optional(),
  });

  return gateSchema.validate(data);
};

const validateGateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const gateInfo of insert) {
      const { error, value } = validateInsertGate(gateInfo);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const gateInfo of update) {
      const { error, value } = validateUpdateGate(gateInfo);

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

export { validateGateRequest };
