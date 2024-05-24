import { Request, Response } from 'express';
import { OK } from '../core/success.response';
import MenuService from '../services/menu.service';
import { SUCCESS_MESSAGE } from '../constants';

class MenuController {
  getMenuByRoleCode = async (req: Request, res: Response) => {
    const role = req.query.roleCode as string;
    new OK({
      message: SUCCESS_MESSAGE.GET_MENU_SUCCESS,
      metadata: await MenuService.getMenuByRoleCode(role),
    }).send(res);
  };
}

export default new MenuController();
