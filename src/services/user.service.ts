import { ERROR_MESSAGE } from '../constants';
import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  activeUser,
  deactiveUser,
  deleteUser,
  findUserById,
  findUserByUserName,
  getAllUser,
  resetPasswordById,
  updateUser,
  userRepository,
} from '../repositories/user.repo';
import { isValidInfor, removeUndefinedProperty } from '../utils';

class UserService {
  /**
   * Create User
   * @param userInfo
   * @returns
   */
  static createUserAccount = async (userInfo: User, createBy: User): Promise<User> => {
    const foundUser = await findUserByUserName(userInfo.USER_NAME);

    if (foundUser) {
      throw new BadRequestError(ERROR_MESSAGE.USER_ALREADY_EXIST);
    }

    if (userInfo.BIRTHDAY) userInfo.BIRTHDAY = new Date(userInfo.BIRTHDAY);
    userInfo.CREATE_BY = createBy.ROWGUID;
    userInfo.UPDATE_BY = createBy.ROWGUID;
    const user = userRepository.create(userInfo);

    await isValidInfor(user);

    const newUser = await userRepository.save(user);

    return newUser;
  };

  static findUserById = async (userId: string): Promise<User> => {
    return await findUserById(userId);
  };

  /**
   * Permanently delete a user
   * @param userId
   * @returns
   */
  static deleteUser = async (userId: string) => {
    // const user = await findUserById(userId);

    // if (!user) {
    //   throw new BadRequestError('Error: User not exist!');
    // }

    return await deleteUser(userId);
  };

  /**
   * Deactive User
   * @param userId
   * @returns
   */
  static deactiveUser = async (userId: string) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError(ERROR_MESSAGE.USER_NOT_EXIST);
    }

    return await deactiveUser(userId);
  };

  /**
   * Active User
   * @param userId
   * @returns
   */
  static activeUser = async (userId: string) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError(ERROR_MESSAGE.USER_NOT_EXIST);
    }

    return await activeUser(userId);
  };

  static getAllUser = async (): Promise<User[]> => {
    return await getAllUser();
  };

  /**
   * Update User
   * @param userId
   * @param userInfo
   * @returns
   */
  static updateUser = async (userId: string, userInfo: Partial<User>, updateBy: User) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError(ERROR_MESSAGE.USER_NOT_EXIST);
    }

    if (userInfo.USER_NAME) {
      const isDuplicatedUserName = await findUserByUserName(userInfo.USER_NAME);

      if (isDuplicatedUserName) {
        throw new BadRequestError(ERROR_MESSAGE.USER_NAME_IS_DUPLICATED);
      }
    }

    const objectParams = removeUndefinedProperty(userInfo);

    if (!objectParams.BIRTHDAY) objectParams.BIRTHDAY = null;
    objectParams.UPDATE_BY = updateBy.ROWGUID;
    // const userInstance = userRepository.create(objectParams);

    // await isValidInfor(userInstance);

    return updateUser(userId, objectParams);
  };

  static resetPasswordById = async (userId: string, defaultPassword: string) => {
    if (defaultPassword !== process.env.DEFAULT_PASSWORD) {
      throw new BadRequestError(ERROR_MESSAGE.PASSWORD_IS_DEFAULT);
    }
    return await resetPasswordById(userId);
  };
}

export default UserService;
