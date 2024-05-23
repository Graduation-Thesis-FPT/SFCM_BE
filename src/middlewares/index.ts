/* eslint-disable prettier/prettier */
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../core/error.response';
import { checkPermissionAccessMenu } from '../repositories/permission.repo';

const HEADER = {
  MENU_CODE: 'menu-code',
};

const grantPermission = async (req: Request, res: Response, next: NextFunction) => {
  const methodPermissionMap = {
    GET: 'IS_VIEW',
    POST: 'IS_ADD_NEW',
    DELETE: 'IS_DELETE',
    PATCH: 'IS_MODIFY',
  };

  const { ROLE_CODE } = res.locals.user;
  const menuCode = req.headers[HEADER.MENU_CODE] as string;

  if(!menuCode) {
    throw new BadRequestError('Missing menuCode!')
  }

  const method = req.method as 'GET' | 'POST' | 'DELETE' | 'PATCH';

  const permission = await checkPermissionAccessMenu(ROLE_CODE, menuCode);

  if (!permission) {
    throw new BadRequestError('You do not have permission to access this page!');
  }

  const permissionProperty = methodPermissionMap[method] as 'IS_VIEW' | 'IS_ADD_NEW' | 'IS_DELETE' | 'IS_MODIFY';

  if (!permission[permissionProperty]) {
    throw new BadRequestError('You do not have this permission');
  }

  next();
};

export { grantPermission };
