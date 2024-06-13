import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { checkDuplicatedID } from '../utils';
import { Customer } from '../models/customer.model';

const validateInsertCustomer = (data: Customer) => {
  const customerSchema = Joi.object({
    CUSTOMER_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Mã khách hàng không được để trống #thêm',
    }),
    CUSTOMER_NAME: Joi.string().trim().required().messages({
      'any.required': 'Tên khách hàng không được để trống #thêm',
    }),
    CUSTOMER_TYPE_CODE: Joi.string().trim().required().messages({
      'any.required': 'Tên loại khách hàng không được để trống #thêm',
    }),
    ADDRESS: Joi.string().trim(),
    TAX_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã số thuế không được để trống #thêm',
    }),
    EMAIL: Joi.string().trim().email().messages({
      'string.email': 'Email phải hợp lệ',
    }),
    IS_ACTIVE: Joi.boolean().required().messages({
      'any.required': 'Trạng thái không được để trống #thêm',
    }),
  });

  return customerSchema.validate(data);
};

const validateUpdateCustomer = (data: Customer) => {
  const customerSchema = Joi.object({
    CUSTOMER_CODE: Joi.string().uppercase().trim().required().messages({
      'any.required': 'Mã khách hàng không được để trống #cập nhật',
    }),
    CUSTOMER_NAME: Joi.string().trim().optional(),
    CUSTOMER_TYPE_CODE: Joi.string().trim().optional(),
    ADDRESS: Joi.string().trim().optional(),
    TAX_CODE: Joi.string().trim().optional(),
    IS_ACTIVE: Joi.boolean().optional(),
    EMAIL: Joi.string()
      .trim()
      .email()
      .messages({
        'string.email': 'Email phải hợp lệ',
      })
      .optional(),
  });

  return customerSchema.validate(data);
};

const validateCustomerRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert?.length === 0 && update?.length === 0) {
    throw new BadRequestError();
  }

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const customerType of insert) {
      const { error, value } = validateInsertCustomer(customerType);

      if (error) {
        console.log(error.details);
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const customerType of update) {
      const { error, value } = validateUpdateCustomer(customerType);

      if (error) {
        // console.log(error.details);
        throw new BadRequestError(error.message);
      }

      updateData.push(value);
    }
  }

  if (insert) checkDuplicatedID(insert, ['CUSTOMER_CODE'], 'thêm mới');
  if (update) checkDuplicatedID(update, ['CUSTOMER_CODE'], 'cập nhật');

  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validateCustomerRequest };
