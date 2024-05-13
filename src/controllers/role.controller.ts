import { NextFunction, Request, Response } from 'express';
import { OK } from '../core/success.response';
import RoleService from '../services/role.service';

class RoleController {
  getAllRole = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'success',
      metadata: await RoleService.getAllRole(),
    }).send(res);
  };
}

export default new RoleController();
