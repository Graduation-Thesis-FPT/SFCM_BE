import { Request, Response } from 'express';
import { SuccessResponse } from '../core/success.response';
import PermissionService from '../services/permission.service';

class PermissionController {
  grantPermission = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'grant permission success',
      metadata: await PermissionService.grantPermission()
    }).send(res);
  };

  getAllPermission = async (req: Request, res: Response) => {
    const role = res.locals.user.ROLE_CODE
    new SuccessResponse({
      message: 'get permissions success',
      metadata: await PermissionService.getAllPermission(role)
    }).send(res);
  }
}

export default new PermissionController();
