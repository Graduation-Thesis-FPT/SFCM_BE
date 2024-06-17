import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { checkDuplicatedID } from '../../utils';
import { BadRequestError } from '../../core/error.response';
import { Unit } from '../../models/unit.model';

const validateUnit = (data: Unit) => {
  const blockSchema = Joi.object({
    UNIT_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': `Mã đơn vị tính không được để trống`,
    }),
    UNIT_NAME: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Tên đơn vị tính không được để trống',
    }),
  });

  return blockSchema.validate(data);
};

const validateUnitRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert) {
    for (const data of insert) {
      const { error, value } = validateUnit(data);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }
    }
  }

  if (update) {
    for (const data of update) {
      const { error, value } = validateUnit(data);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }
    }
  }
  if (insert) checkDuplicatedID(insert, ['UNIT_CODE', 'UNIT_NAME'], 'Thêm mới');

  res.locals.requestData = req.body;
  next();
};

export { validateUnitRequest };
