import { createNewAccessToken, createRefreshToken } from '../auth/authUtils';
import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  checkPasswordIsNullById,
  findUserById,
  findUserByUserName,
  getUserWithPasswordById,
  updatePasswordById,
} from '../repositories/user.repo';
import bcrypt from 'bcrypt';
import { getInfoData } from '../utils';
// const jwt = require('jsonwebtoken');

class AccessService {
  static login = async (userInfo: Partial<User>) => {
    const foundUser = await findUserByUserName(userInfo.USER_NAME);

    if (!foundUser) {
      throw new BadRequestError('Error: User name not exist!');
    }

    if (!foundUser.IS_ACTIVE) {
      throw new BadRequestError('Error: User is not active!');
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
    return {
      userInfo: getInfoData(resDataUser, [
        'ROWGUID',
        'USER_NAME',
        'FULLNAME',
        'EMAIL',
        'ADDRESS',
        'BIRTHDAY',
        'ROLE_CODE',
        'ROLE_NAME',
      ]),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

  static changeDefaultPassword = async (userId: string, userInfo: Partial<User>) => {
    const foundUser = await findUserById(userId);
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

    const updateResult = await updatePasswordById(userId, hashed);
    if (!updateResult) {
      throw new BadRequestError('Error: Update password failed!');
    }

    const accessToken = createNewAccessToken(foundUser);
    const refreshToken = createRefreshToken(foundUser);
    return {
      userInfo: getInfoData(foundUser, [
        'ROWGUID',
        'USER_NAME',
        'FULLNAME',
        'EMAIL',
        'ADDRESS',
        'BIRTHDAY',
        'ROLE_CODE',
        'ROLE_NAME',
      ]),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

  static handlerRefreshToken = async (user: User) => {
    const newAccessToken = createNewAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    return {
      userInfo: getInfoData(user, [
        'ROWGUID',
        'USER_NAME',
        'FULLNAME',
        'EMAIL',
        'ADDRESS',
        'BIRTHDAY',
        'ROLE_CODE',
        'ROLE_NAME',
      ]),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };
}
export default AccessService;
