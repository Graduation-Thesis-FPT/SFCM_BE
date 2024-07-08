import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import JobQuantityCheckService from '../services/job-quantity-check.service';

class JobQuantityCheckController {
  getAllImportTallyContainer = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await JobQuantityCheckService.getAllImportTallyContainer(),
    }).send(res);
  };

  getImportTallyContainerInfo = async (req: Request, res: Response) => {
    const { CONTAINER_ID } = req.params;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata:
        await JobQuantityCheckService.getImportTallyContainerInfoByCONTAINER_ID(CONTAINER_ID),
    }).send(res);
  };

  getAllJobQuantityCheckByPACKAGE_ID = async (req: Request, res: Response) => {
    const { PACKAGE_ID } = req.params;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await JobQuantityCheckService.getAllJobQuantityCheckByPACKAGE_ID(PACKAGE_ID),
    }).send(res);
  };

  insertAndUpdateJobQuantityCheck = async (req: Request, res: Response) => {
    const { PACKAGE_ID } = req.params;
    const listData = req.body;
    const createBy = res.locals.user;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.SAVE_JOB_QUANTITY_CHECK_SUCCESS,
      metadata: await JobQuantityCheckService.insertAndUpdateJobQuantityCheck(
        listData,
        createBy,
        PACKAGE_ID,
      ),
    }).send(res);
  };

  completeJobQuantityCheckByPackageId = async (req: Request, res: Response) => {
    const { PACKAGE_ID } = req.params;
    const createBy = res.locals.user;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.COMPLETE_JOB_QUANTITY_CHECK_SUCCESS,
      metadata: await JobQuantityCheckService.completeJobQuantityCheckByPackageId(
        PACKAGE_ID,
        createBy,
      ),
    }).send(res);
  };
}

export default new JobQuantityCheckController();
