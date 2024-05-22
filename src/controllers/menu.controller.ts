import { Request, Response } from 'express';
import { OK } from '../core/success.response';
import MenuService from '../services/menu.service';

class MenuController {
  getMenuByRoleCode = async (req: Request, res: Response) => {
    const role = req.query.roleCode as string;
    new OK({
      message: 'get menu by role success',
      metadata: await MenuService.getMenuByRoleCode(role),
    }).send(res);
  };
}

export default new MenuController();
