import { Request, Response } from 'express';
import { OK } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import ConfigAttachSrvService from '../services/config-attach-srv.service';

class ConfigAttachSrvController {
  getConfigAttachSrvByMethodCode = async (req: Request, res: Response) => {
    const { METHOD_CODE } = req.params;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await ConfigAttachSrvService.getConfigAttachSrvByMethodCode(METHOD_CODE),
    }).send(res);
  };

  createAndUpdateConfigAttachSrvByMethodCode = async (req: Request, res: Response) => {
    const { METHOD_CODE } = req.params;
    const createBy = res.locals.user;
    new OK({
      message: SUCCESS_MESSAGE.UPDATE_CONFIG_ATTACH_SRV_SUCCESS,
      metadata: await ConfigAttachSrvService.createAndUpdateConfigAttachSrvByMethodCode(
        METHOD_CODE,
        req.body,
        createBy,
      ),
    }).send(res);
  };
}

export default new ConfigAttachSrvController();
