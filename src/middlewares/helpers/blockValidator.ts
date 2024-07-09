import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { checkDuplicatedID } from '../../utils';
import { BadRequestError } from '../../core/error.response';
import { Block } from '../../models/block.model';

const validateInsertBlock = (data: Block) => {
  const blockSchema = Joi.object({
    WAREHOUSE_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Mã kho không được để trống',
      'string.empty': 'Mã kho không được để trống',
      'string.base': 'Mã kho không được để trống',
    }),
    BLOCK_NAME: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Tên dãy không được để trống',
      'string.empty': 'Tên dãy không được để trống',
      'string.base': 'Tên dãy không được để trống',
    }),
    BLOCK_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Mã dãy không được để trống',
      'string.empty': 'Mã dãy không được để trống',
      'string.base': 'Mã dãy không được để trống',
    }),
    TIER_COUNT: Joi.number().required().positive().messages({
      'number.positive': 'Số tầng phải là số dương',
      'number.base': 'Số tầng không được để trống',
      'number.empty': 'Số tầng không được để trống',
    }),
    SLOT_COUNT: Joi.number().required().positive().messages({
      'number.positive': 'Số cột phải là số dương',
      'number.base': 'Số cột không được để trống',
      'number.empty': 'Số cột không được để trống',
    }),
    BLOCK_WIDTH: Joi.number().required().positive().messages({
      'number.positive': 'Chiều rộng của dãy phải là số dương',
      'number.empty': 'Chiều rộng của dãy không được để trống',
      'any.required': 'Chiều rộng của dãy không được để trống',
    }),
    BLOCK_HEIGHT: Joi.number().required().positive().messages({
      'number.positive': 'Chiều cao dãy phải là số dương',
      'number.empty': 'Chiều cao dãy không được để trống',
      'any.required': 'Chiều cao dãy không được để trống',
    }),
    BLOCK_LENGTH: Joi.number().required().positive().messages({
      'number.positive': 'Chiều dài dãy phải là số dương',
      'number.empty': 'Chiều dài dãy không được để trống',
      'any.required': 'Chiều dài dãy không được để trống',
    }),
  });

  return blockSchema.validate(data);
};

const validateUpdateBlock = (data: Block) => {
  const blockSchema = Joi.object({
    BLOCK_CODE: Joi.string().trim().required(),
    WAREHOUSE_CODE: Joi.string().trim().optional(),
    BLOCK_NAME: Joi.optional(),
    TIER_COUNT: Joi.number()
      .positive()
      .messages({
        'number.positive': 'TIER_COUNT phải là số dương',
      })
      .optional(),
    SLOT_COUNT: Joi.number()
      .positive()
      .messages({
        'number.positive': 'SLOT_COUNT phải là số dương',
      })
      .optional(),
    BLOCK_WIDTH: Joi.number()
      .positive()
      .messages({
        'number.positive': 'BLOCK_WIDTH phải là số dương',
      })
      .optional(),
    BLOCK_HEIGHT: Joi.number()
      .positive()
      .messages({
        'number.positive': 'BLOCK_HEIGHT phải là số dương',
      })
      .optional(),
    BLOCK_LENGTH: Joi.number()
      .positive()
      .messages({
        'number.positive': 'BLOCK_LENGTH phải là số dương',
      })
      .optional(),
  });

  return blockSchema.validate(data);
};

const validateBlockRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;
  if (insert.length === 0 && update.length === 0) {
    throw new BadRequestError();
  }
  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const blockInfo of insert) {
      const { error, value } = validateInsertBlock(blockInfo);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const blockInfo of update) {
      const { error, value } = validateUpdateBlock(blockInfo);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      updateData.push(value);
    }
  }
  if (insert) checkDuplicatedID(insert, ['BLOCK_CODE', 'BLOCK_NAME'], 'Thêm mới');

  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validateBlockRequest };
