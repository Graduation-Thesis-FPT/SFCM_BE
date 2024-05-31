import Joi from 'joi';
import { Block } from '../models/block.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';

const validateBlock = (data: Block) => {
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

const validateBlockRequest = (req: Request, res: Response, next: NextFunction) => {
  const blockListInfo = req.body;
  const requestData = [];
  for (const blockInfo of blockListInfo) {
    const { error, value } = validateBlock(blockInfo);

    if (error) {
      console.log(error.details);
      throw new BadRequestError(error.message);
    }

    requestData.push(value);
  }
  res.locals.requestData = requestData;
  next();
};

export { validateBlockRequest };
