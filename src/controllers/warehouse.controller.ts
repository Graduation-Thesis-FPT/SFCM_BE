import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import WarehouseService from '../services/warehouse.service';

class WarehouseController {
  createWarehouse = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const warehouseList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.CREATE_BLOCK_SUCCESS,
      metadata: await WarehouseService.createAndUpdateWarehouse([], createBy),
    }).send(res);
  };

  deleteWarehouse = async (req: Request, res: Response) => {
    const { warehouseCodeList } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_WAREHOUSE_SUCCESS,
      metadata: await WarehouseService.deleteWarehouse(warehouseCodeList),
    }).send(res);
  };

  getWarehouse = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_WAREHOUSE_SUCCESS,
      metadata: await WarehouseService.getAllWarehouse(),
    }).send(res);
  };
}

export default new WarehouseController();
