import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { WareHouse } from '../../models/warehouse.model';
import { BadRequestError } from '../../core/error.response';

const validateWarehouse = (data: WareHouse) => {
  const blockSchema = Joi.object({
    WAREHOUSE_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Mã kho không được để trống',
      'string.empty': 'Mã kho không được để trống',
    }),
    WAREHOUSE_NAME: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Tên mã kho không được để trống',
    }),
    ACREAGE: Joi.number().required().positive().messages({
      'number.positive': 'Diện tích kho phải lớn hơn 0',
      'number.base': 'Diện tích kho không được để trống',
      'number.empty': 'Diện tích kho không được để trống',
    }),
  });

  return blockSchema.validate(data);
};

const validateWarehouseRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert) {
    for (const data of insert) {
      const { error, value } = validateWarehouse(data);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }
    }
  }

  if (update) {
    for (const data of update) {
      const { error, value } = validateWarehouse(data);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }
    }
  }
  res.locals.requestData = req.body;
  next();
};

export { validateWarehouseRequest };
