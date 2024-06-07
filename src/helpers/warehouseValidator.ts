import Joi from 'joi';
import { WareHouse } from '../models/warehouse.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';

const validateWarehouse = (data: WareHouse) => {
    const blockSchema = Joi.object({
        WAREHOUSE_CODE: Joi.string().trim().required().messages({
            'any.required': 'WAREHOUSE_CODE không được để trống',
        }),
        WAREHOUSE_NAME: Joi.string().trim().required().messages({
            'any.required': 'WAREHOUSE_NAME không được để trống',
        }),
        ACREAGE: Joi.number().positive().messages({
            'number.positive': 'Diện tích kho phải là số dương',
        })
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
