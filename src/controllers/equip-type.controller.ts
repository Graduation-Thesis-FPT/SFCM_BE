import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import EquipTypeService from '../services/equipType.service';

class EquipTypeController {
  createAndUpdateEquipType = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const equipTypeList = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.CREATE_EQUIPTYPE_SUCCESS,
      metadata: await EquipTypeService.createAndUpdateEquipType(equipTypeList, createBy),
    }).send(res);
  };

  deleteEquipType = async (req: Request, res: Response) => {
    const { EQU_TYPE_LIST } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_EQUIPTYPE_SUCCESS,
      metadata: await EquipTypeService.deleteEquipType(EQU_TYPE_LIST),
    }).send(res);
  };

  getAllEquipType = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_EQUIPTYPE_SUCCESS,
      metadata: await EquipTypeService.getAllEquipType(),
    }).send(res);
  };
}

export default new EquipTypeController();
