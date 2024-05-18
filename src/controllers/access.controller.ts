import { Request, Response } from 'express';
import AccessService from '../services/access.service';
import { SuccessResponse } from '../core/success.response';

class AccessController {
  login = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'login success',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  changeDefaultPassword = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'change default password success',
      metadata: await AccessService.changeDefaultPassword(req.params.userId, req.body),
    }).send(res);
  };

  handlerRefreshToken = async (req: Request, res: Response) => {
    const { user } = res.locals;
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerRefreshToken(user),
    }).send(res);
  };
}

export default new AccessController();
