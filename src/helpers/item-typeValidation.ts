import Joi from 'joi';
import { ItemType } from '../models/item-type.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { checkDuplicatedID } from '../utils';

const validateItemType = (data: ItemType) => {
  const blockSchema = Joi.object({
    ITEM_TYPE_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': `Mã loại hàng không được để trống`,
    }),
    ItemType_NAME: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Tên Loại hàng không được để trống',
    }),
  });

  return blockSchema.validate(data);
};

const validateItemTypeRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert) {
    for (const data of insert) {
      const { error, value } = validateItemType(data);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }
    }
  }

  if (update) {
    for (const data of update) {
      const { error, value } = validateItemType(data);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }
    }
  }
  if (insert) checkDuplicatedID(insert, ['ITEM_TYPE_CODE', 'ITEM_TYPE_NAME'], 'Thêm mới');
  res.locals.requestData = req.body;
  next();
};

export { validateItemTypeRequest };
