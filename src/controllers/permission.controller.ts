import { Request, Response } from 'express';
import { OK, SuccessResponse } from '../core/success.response';
import PermissionService from '../services/permission.service';

class PermissionController {
  updatePermission = async (req: Request, res: Response) => {
    const updateBy = res.locals.user;
    new SuccessResponse({
      message: 'grant permission success',
      metadata: await PermissionService.updatePermission(req.body, updateBy),
    }).send(res);
  };

  getAllPermission = async (req: Request, res: Response) => {
    const role = req.query.roleCode as string;
    new OK({
      message: 'get permissions success',
      metadata: await PermissionService.getAllPermission(role),
    }).send(res);
  };

  getGrantPermission = async (req: Request, res: Response) => {
    const userInfo = res.locals.user;
    const menuCode = req.query.menuCode as string;
    new OK({
      message: 'get grant permission success',
      metadata: await PermissionService.getGrantPermission(userInfo.ROLE_CODE, menuCode),
    }).send(res);
  };
}

export default new PermissionController();
