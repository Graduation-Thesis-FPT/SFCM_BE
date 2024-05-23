import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { checkPermissionAccessMenu } from '../repositories/permission.repo';

const grantPermission = async (req: Request, res: Response, next: NextFunction) => {
  const { ROLE_CODE } = res.locals.user;
  const menuCode = req.body.menuCode;

  const permission = await checkPermissionAccessMenu(ROLE_CODE, menuCode);

  if (!permission) {
    throw new BadRequestError('You do not have permission to access this page!');
  }

  switch (req.method) {
    case 'GET':
      if (!permission.IS_VIEW) {
        throw new BadRequestError('You do not have this permission');
      }
      break;
    case 'POST':
      if (!permission.IS_ADD_NEW) {
        throw new BadRequestError('You do not have this permission');
      }
      break;
    case 'DELETE':
      if (!permission.IS_DELETE) {
        throw new BadRequestError('You do not have this permission');
      }
      break;
    case 'PATCH':
      if (!permission.IS_MODIFY) {
        throw new BadRequestError('You do not have this permission');
      }
      break;
  }
  next();
};

export { grantPermission };
