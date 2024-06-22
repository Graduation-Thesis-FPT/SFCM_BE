import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../core/error.response';
import { Tariff } from '../../models/tariff.model';

const validateInsertTariff = (data: Tariff) => {
  const tariffSchema = Joi.object({
    TRF_CODE: Joi.string().trim().uppercase().required().messages({
      'any.required': 'Mã biểu cước không được để trống #thêm',
      'string.empty': 'Mã biểu cước không được để trống #thêm',
    }),
    TRF_DESC: Joi.string().trim().allow('').messages({
      'string.empty': 'Mô tả mã biểu cước không được để trống #thêm',
    }),
    METHOD_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã phương án không được để trống #thêm',
      'string.empty': 'Mã phương án không được để trống #thêm',
    }),
    ITEM_TYPE_CODE: Joi.string().trim().required().messages({
      'any.required': 'Mã loại hàng hóa không được để trống #thêm',
      'string.empty': 'Mã loại hàng hóa không được để trống #thêm',
    }),
    AMT_CBM: Joi.number().positive().required().messages({
      'any.required': 'Tổng tiền không được để trống #thêm',
      'number.positive': 'Tổng tiền phải là số dương #thêm',
    }),
    VAT: Joi.number().positive().allow('').messages({
      'number.positive': 'Thuế VAT phải là số dương #thêm',
    }),
    INCLUDE_VAT: Joi.boolean(),
    FROM_DATE: Joi.date().required().messages({
      'any.required': 'Ngày hiệu lực biểu cước không được để trống #thêm',
      'date.base': 'Ngày hiệu lực biểu cước phải là một ngày hợp lệ #thêm',
    }),
    TO_DATE: Joi.date().required().messages({
      'any.required': 'Ngày hết hạn biểu cước không được để trống #thêm',
      'date.base': 'Ngày hết hạn biểu cước phải là một ngày hợp lệ #thêm',
    }),
    TRF_NAME: Joi.string().trim().required().messages({
      'any.required': 'Tên biểu cước không được để trống #thêm',
      'string.empty': 'Tên biểu cước không được để trống #thêm',
    }),
  });

  return tariffSchema.validate(data);
};

const validateUpdateTariff = (data: Tariff) => {
  const tariffSchema = Joi.object({
    ROWGUID: Joi.string().trim().required().messages({
      'any.required': 'ROWGUID không được để trống #cập nhật',
    }),
    TRF_CODE: Joi.string().trim().uppercase().messages({
      'string.empty': 'Mã biểu cước không được để trống #cập nhật',
    }),
    TRF_DESC: Joi.string().trim().allow('').messages({
      'string.empty': 'Mô tả mã biểu cước không được để trống #cập nhật',
    }),
    METHOD_CODE: Joi.string().trim().messages({
      'string.empty': 'Mã phương án không được để trống #cập nhật',
    }),
    ITEM_TYPE_CODE: Joi.string().trim().messages({
      'string.empty': 'Mã loại hàng hóa không được để trống #cập nhật',
    }),
    AMT_CBM: Joi.number().positive().messages({
      'number.empty': 'Tổng tiền không được để trống #cập nhật',
      'number.positive': 'Tổng tiền phải là số dương #cập nhật',
      'number.base': 'Tổng tiền phải là một số #cập nhật',
    }),
    VAT: Joi.number().positive().allow('').messages({
      'number.positive': 'Thuế VAT phải là số dương #cập nhật',
      'number.base': 'Thuế VAT phải là một số #cập nhật',
    }),
    INCLUDE_VAT: Joi.boolean(),
    FROM_DATE: Joi.date().messages({
      'string.empty': 'Ngày hiệu lực biểu cước không được để trống #cập nhật',
      'date.base': 'Ngày hiệu lực biểu cước phải là một ngày hợp lệ #cập nhật',
    }),
    TO_DATE: Joi.date().messages({
      'string.empty': 'Ngày hết hạn biểu cước không được để trống #cập nhật',
      'date.base': 'Ngày hết hạn biểu cước phải là một ngày hợp lệ #cập nhật',
    }),
    TRF_NAME: Joi.string().trim().messages({
      'string.empty': 'Tên biểu cước không được để trống #cập nhật',
    })
  });

  return tariffSchema.validate(data);
};

const validateTariffRequest = (req: Request, res: Response, next: NextFunction) => {
  const { insert, update } = req.body;

  if (insert?.length === 0 && update?.length === 0) {
    throw new BadRequestError();
  }

  const insertData = [];
  const updateData = [];
  if (insert) {
    for (const tariff of insert) {
      const { error, value } = validateInsertTariff(tariff);

      if (error) {
        throw new BadRequestError(error.message);
      }

      insertData.push(value);
    }
  }

  if (update) {
    for (const tariff of update) {
      const { error, value } = validateUpdateTariff(tariff);

      if (error) {
        throw new BadRequestError(error.message);
      }

      updateData.push(value);
    }
  }

  res.locals.requestData = { insert: insertData, update: updateData };
  next();
};

export { validateTariffRequest };
