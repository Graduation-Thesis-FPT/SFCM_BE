import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { Package } from '../../models/packageMnfLd.model';
import { BadRequestError } from '../../core/error.response';

const validateData = (data: Package) => {
  const methodSchema = Joi.object({
    HOUSE_BILL: Joi.string().trim().uppercase().required().messages({
      'string.empty': 'Số House Bill không được để trống',
    }),
    LOT_NO: Joi.string().trim().allow('').optional(),
    ROWGUID: Joi.string().trim().allow('').optional(),
    DECLARE_NO: Joi.string().trim().allow('').optional(),
    REF_CONTAINER: Joi.string().trim().required().messages({
      'string.empty': 'REF_CONTAINER không được để trống',
    }),
    NOTE: Joi.string().trim().allow('').optional(),
    ITEM_TYPE_CODE: Joi.string().trim().required().messages({
      'string.empty': 'Loại hàng hóa không được để trống',
    }),
    UNIT_CODE: Joi.string().trim().required().messages({
      'string.empty': 'Đơn vị tính hàng hóa không được để trống',
    }),
    CARGO_PIECE: Joi.number().positive().required().messages({
      'string.empty': 'Số lượng hàng hóa không được để trống',
      'number.positive': 'Số lượng hàng hóa phải là số dương',
    }),
    CBM: Joi.number().required().messages({
      'string.base' : 'Số khối phải là số chứ không phải String Phú ơi, nhìn database kìa!!!!!!',
      'number.positive': 'Số khối phải là số dương',

    }),
  });

  return methodSchema.validate(data);
};

const validatePackageRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert?.length === 0 && update?.length === 0) {
    throw new BadRequestError();
  }

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const data of insert) {
      const { error, value } = validateData(data);

      if (error) {
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const data of update) {
      const { error, value } = validateData(data);

      if (error) {
        throw new BadRequestError(error.message);
      }

      updateData.push(value);
    }
  }

  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validatePackageRequest };
