import { Request, Response } from 'express';
import { OK, SuccessResponse } from '../core/success.response';
import PermissionService from '../services/permission.service';

class PermissionController {
  grantPermission = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'grant permission success',
      metadata: await PermissionService.grantPermission(req.body),
    }).send(res);
  };

  getAllPermission = async (req: Request, res: Response) => {
    const role = req.query.roleCode as string;
    new OK({
      message: 'get permissions success',
      metadata: await PermissionService.getAllPermission(role),
    }).send(res);
  };
}

export default new PermissionController();
