import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import EquipmentService from '../services/equipment.service';

class EquipmentController {
  createAndUpdateEquipment = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const equipTypeList = res.locals.requestData;

    const data = req.body;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_EQUIPMENT_SUCCESS,
      metadata: await EquipmentService.createAndUpdateEquipment(data, createBy),
    }).send(res);
  };

  deleteEquipment = async (req: Request, res: Response) => {
    const { EQUIPMENT_CODE } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_EQUIPMENT_SUCCESS,
      metadata: await EquipmentService.deleteEquipment(EQUIPMENT_CODE),
    }).send(res);
  };

  getAllEquipment = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_EQUIPMENT_SUCCESS,
      metadata: await EquipmentService.getAllEquipment(),
    }).send(res);
  };
}

export default new EquipmentController();
