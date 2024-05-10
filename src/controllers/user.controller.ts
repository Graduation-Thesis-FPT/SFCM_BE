import { NextFunction, Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import UserService from '../services/user.service';
import { User } from '../entity/user.entity';

class UserController {
  createUserAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userAccountInfo: User = req.body;
    new CREATED({
      message: 'create user success',
      metadata: await UserService.createUserAccount(userAccountInfo),
    }).send(res);
  };

  findUserById = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'success',
      metadata: await UserService.findUserById(req.params.id)
    }).send(res);
  }

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'delete user success',
      metadata: await UserService.deleteUser(req.params.id)
    }).send(res)
  }

  updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'delete success',
      metadata: await UserService.updateUserStatus(req.params.id)
    }).send(res)
  }

  getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'success',
      metadata: await UserService.getAllUser()
    }).send(res)
  }
}

export default new UserController();
