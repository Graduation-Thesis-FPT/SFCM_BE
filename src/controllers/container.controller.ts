import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import ContainerService from '../services/container.service';

class ContainerController {
  createAndUpdateContainer = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const containerList = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_CONTAINER_SUCCESS,
      metadata: await ContainerService.createAndUpdateContainer(containerList, createBy),
    }).send(res);
  };

  deleteContainer = async (req: Request, res: Response) => {
    const { CONTAINER_ROWGUID } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_CONTAINER_SUCCESS,
      metadata: await ContainerService.deleteContainer(CONTAINER_ROWGUID),
    }).send(res);
  };

  getAllContainer = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_CONTAINER_SUCCESS,
      metadata: await ContainerService.getAllContainer(req.query),
    }).send(res);
  };
}

export default new ContainerController();
