import { Request, Response } from 'express';
import AccessService from '../services/access.service';
import { SuccessResponse } from '../core/success.response';
import { UnAuthorizedError } from '../core/error.response';

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

  refreshToken = async (req: Request, res: Response) => {
    const currentRefreshToken = req.body.refreshToken;

    if (!currentRefreshToken) {
      throw new UnAuthorizedError('Error: authorization required!');
    }

    const result = await AccessService.refreshToken(currentRefreshToken);

    new SuccessResponse({
      message: 'refresh token success',
      metadata: result,
    }).send(res);
  };
}

export default new AccessController();
