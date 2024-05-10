import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../core/success.response';
import UserService from '../services/user.service';
import { User } from '../entity/user.entity';

class UserController {
  createUserAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userAccountInfo: User = req.body;
    new SuccessResponse({
      message: 'create user success',
      metadata: await UserService.createUserAccount(userAccountInfo),
    }).send(res);
  };
}

export default new UserController();
