import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { Method } from '../models/method.model';

const validateInsertVessel = (data: Method) => {
  const methodSchema = Joi.object({
    VESSEL_NAME: Joi.string().trim().required().messages({
      'any.required': 'Tên tàu không được để trống #thêm',
    }),
    INBOUND_VOYAGE: Joi.string().trim().required().messages({
      'any.required': 'Chuyến nhập không được để trống #thêm',
    }),
    OUTBOUND_VOYAGE: Joi.string().trim().required().messages({
      'any.required': 'Chuyến xuất không được để trống #thêm',
    }),
    ETA: Joi.date().required().messages({
      'any.required': 'Ngày tàu đến không được để trống #thêm',
    }),
    ETD: Joi.date().required().messages({
      'any.required': 'Ngày tàu đi không được để trống #thêm',
    }),
    CallSign: Joi.string().trim().required().messages({
      'any.required': 'CallSign không được để trống #thêm',
    }),
    IMO: Joi.string().trim().required().messages({
      'any.required': 'IMO không được để trống #thêm',
    }),
  });

  return methodSchema.validate(data);
};

const validateUpdateVessel = (data: Method) => {
  const methodSchema = Joi.object({
    VOYAGEKEY: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Mã tàu không được để trống #thêm',
    }),
    VESSEL_NAME: Joi.string().trim().optional(),
    INBOUND_VOYAGE: Joi.string().trim().optional(),
    OUTBOUND_VOYAGE: Joi.string().trim().optional(),
    ETA: Joi.date().optional(),
    ETD: Joi.date().optional(),
    CallSign: Joi.string().trim().optional(),
    IMO: Joi.string().trim().optional(),
  });

  return methodSchema.validate(data);
};

const validateVesselRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert?.length === 0 && update?.length === 0) {
    throw new BadRequestError();
  }

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const vesselInfo of insert) {
      const { error, value } = validateInsertVessel(vesselInfo);

      if (error) {
        // console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const vesselInfo of update) {
      const { error, value } = validateUpdateVessel(vesselInfo);

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

export { validateVesselRequest };
