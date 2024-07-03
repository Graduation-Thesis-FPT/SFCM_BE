import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import PackageUnitService from '../services/package-unit.service';

class PackageUnitController {
  createPackageUnit = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const PackageUnitList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_PACKAGE_UNIT_SUCCESS,
      metadata: await PackageUnitService.createAndUpdatePackageUnit(PackageUnitList, createBy),
    }).send(res);
  };

  deletePackageUnit = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_PACKAGE_UNIT_SUCCESS,
      metadata: await PackageUnitService.deletePackageUnit(req.body.PackageUnitCodeList),
    }).send(res);
  };

  getPackageUnit = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_PACKAGE_UNIT_SUCCESS,
      metadata: await PackageUnitService.getAllPackageUnit(),
    }).send(res);
  };
}

export default new PackageUnitController();
