import Joi from 'joi';
import { Block } from '../models/block.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';

const validateInsertBlock = (data: Block) => {
  const blockSchema = Joi.object({
    WAREHOUSE_CODE: Joi.string().trim().required().messages({
      'any.required': 'WAREHOUSE_CODE không được để trống',
    }),
    BLOCK_NAME: Joi.string().trim().required().messages({
      'any.required': 'BLOCK_NAME không được để trống',
    }),
    TIER_COUNT: Joi.number().positive().messages({
      'number.positive': 'TIER_COUNT phải là số dương',
    }),
    SLOT_COUNT: Joi.number().positive().messages({
      'number.positive': 'SLOT_COUNT phải là số dương',
    }),
    BLOCK_WIDTH: Joi.number().positive().messages({
      'number.positive': 'BLOCK_WIDTH phải là số dương',
    }),
    BLOCK_HEIGHT: Joi.number().positive().messages({
      'number.positive': 'BLOCK_HEIGHT phải là số dương',
    }),
  });

  return blockSchema.validate(data);
};

const validateUpdateBlock = (data: Block) => {
  const blockSchema = Joi.object({
    ROWGUID: Joi.string().trim().required(),
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
  });

  return blockSchema.validate(data);
};

const validateBlockRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

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
  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validateBlockRequest };
