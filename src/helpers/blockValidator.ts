import Joi from 'joi';
import { Block } from '../models/block.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';

const validateBlock = (data: Block) => {
  const blockSchema = Joi.object({
    WAREHOUSE_CODE: Joi.string().trim().required(),
    BLOCK_NAME: Joi.string().trim().required(),
    TIER_COUNT: Joi.optional(),
    SLOT_COUNT: Joi.optional(),
    BLOCK_WIDTH: Joi.optional(),
    BLOCK_HEIGHT: Joi.optional(),
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
