import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import UserService from '../services/user.service';
import { User } from '../entity/user.entity';

class UserController {
  createUserAccount = async (req: Request, res: Response) => {
    const userAccountInfo: User = req.body;
    new CREATED({
      message: 'create user success',
      metadata: await UserService.createUserAccount(userAccountInfo),
    }).send(res);
  };

  findUserById = async (req: Request, res: Response) => {
    new OK({
      message: 'success',
      metadata: await UserService.findUserById(req.params.id),
    }).send(res);
  };

  deleteUserById = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'delete user success',
      metadata: await UserService.deleteUser(req.params.id),
    }).send(res);
  };

  deactivateUser = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'deactive user success',
      metadata: await UserService.deactiveUser(req.params.id),
    }).send(res);
  };

  activateUser = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'active user success',
      metadata: await UserService.activeUser(req.params.id),
    }).send(res);
  };

  getAllUser = async (req: Request, res: Response) => {
    new OK({
      message: 'success',
      metadata: await UserService.getAllUser(),
    }).send(res);
  };

  updateUser = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'update success',
      metadata: await UserService.updateUser(req.params.userId, req.body),
    }).send(res);
  };

  resetPasswordById = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: 'reset password success',
      metadata: await UserService.resetPasswordById(req.params.userId, req.body.DEFAULT_PASSWORD),
    }).send(res);
  };
}

export default new UserController();
