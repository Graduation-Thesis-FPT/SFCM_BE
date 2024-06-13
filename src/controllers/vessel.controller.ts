import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import VesselService from '../services/vessel.service';

class VesselController {
  createAndUpdateVessel = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const vesselList = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_VESSEL_SUCCESS,
      metadata: await VesselService.createAndUpdateVessel(vesselList, createBy),
    }).send(res);
  };

  deleteVessel = async (req: Request, res: Response) => {
    const { VESSEL_CODE_LIST } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_VESSEL_SUCCESS,
      metadata: await VesselService.deleteVessel(VESSEL_CODE_LIST),
    }).send(res);
  };

  getVessel = async (req: Request, res: Response) => {
    let rule = null;
    if (req.query.from && req.query.to) {
      const fromDate = new Date(req.query?.from as string);
      const toDate = new Date(req.query?.to as string);
      rule = { fromDate, toDate };
    }
    new OK({
      message: SUCCESS_MESSAGE.GET_VESSEL_SUCCESS,
      metadata: await VesselService.getAllVessel(rule),
    }).send(res);
  };
}

export default new VesselController();
