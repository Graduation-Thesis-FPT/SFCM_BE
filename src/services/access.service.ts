import { BadRequestError, UnAuthorizedError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  checkPasswordIsNullById,
  findUserById,
  findUserByUserName,
  getUserWithPasswordById,
  updatePasswordById,
} from '../repositories/user.repo';
import bcrypt from 'bcrypt';
import { createNewAccessToken, createRefreshToken } from '../utils/createToken';
const jwt = require('jsonwebtoken');

class AccessService {
  static login = async (userInfo: Partial<User>) => {
    const foundUser = await findUserByUserName(userInfo.USER_NAME);

    if (!foundUser) {
      throw new BadRequestError('Error: User name not exist!');
    }

    const passwordIsNull = await checkPasswordIsNullById(foundUser.ROWGUID);

    if (passwordIsNull) {
      if (userInfo.PASSWORD === process.env.DEFAULT_PASSWORD) {
        return { changeDefaultPassword: true, ROWGUID: foundUser.ROWGUID };
      } else {
        throw new BadRequestError('Error: Password is incorrect!');
      }
    }

    const user = await getUserWithPasswordById(foundUser.ROWGUID);

    const isMatch = await bcrypt.compare(userInfo.PASSWORD, user.PASSWORD);

    if (!isMatch) {
      throw new BadRequestError('Error: Password is incorrect!');
    }

    const resDataUser = await findUserById(foundUser.ROWGUID);

    const accessToken = createNewAccessToken(resDataUser);
    const refreshToken = createRefreshToken(resDataUser);
    return { userInfo: resDataUser, accessToken: accessToken, refreshToken: refreshToken };
  };

  static changeDefaultPassword = async (userId: string, userInfo: Partial<User>) => {
    const foundUser = await findUserByUserName(userInfo.USER_NAME);
    if (!foundUser) {
      throw new BadRequestError('Error: User name not exist!');
    }

    const passwordIsNull = await checkPasswordIsNullById(userId);
    if (!passwordIsNull) {
      throw new BadRequestError('Error: Password is already!');
    }

    if (userInfo.PASSWORD === process.env.DEFAULT_PASSWORD) {
      throw new BadRequestError('Error: Password is default!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userInfo.PASSWORD, salt);
    return updatePasswordById(userId, hashed);
  };

  static refreshToken = async (refreshToken: string) => {
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SIGN_SECRET,
      async (err: any, user: Partial<User>) => {
        if (err) {
          throw new UnAuthorizedError('Error: authorization required!');
        }
        const resDataUser = await findUserById(user.ROWGUID);

        const newAccessToken = createNewAccessToken(resDataUser);
        const newRefreshToken = createRefreshToken(resDataUser);
        return {
          userInfo: resDataUser,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      },
    );
  };
}
export default AccessService;
