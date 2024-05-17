import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnAuthorizedError } from '../core/error.response';
import { User } from '../entity/user.entity';
const jwt = require('jsonwebtoken');

class MiddlewareController {
  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.token as string;
    if (!token) {
      throw new UnAuthorizedError('Error: authorization required!');
    }

    if (token.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SIGN_SECRET, (err: any, user: Partial<User>) => {
      if (err) {
        throw new ForbiddenError('Error: authorization required!');
      }
      res.locals.user = user;
      next();
    });
  };
}

export default new MiddlewareController();
