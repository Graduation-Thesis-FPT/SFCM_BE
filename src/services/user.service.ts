import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  deleteUser,
  findUserById,
  findUserByUserName,
  getAllUser,
  updateUser,
  updateUserStatus,
  userRepository,
} from '../repositories/user.repo';
import { isValidInfor, removeUndefinedProperty } from '../utils';

class UserService {
  /**
   * Create User
   * @param userInfo 
   * @returns 
   */
  static createUserAccount = async (userInfo: User): Promise<User> => {
    const foundUser = await findUserByUserName(userInfo.USER_NAME);

    if (foundUser) {
      throw new BadRequestError('Error: User already exists!');
    }

    if (userInfo.BIRTHDAY) userInfo.BIRTHDAY = new Date(userInfo.BIRTHDAY);
    userInfo.UPDATE_DATE = new Date();
    userInfo.CREATE_DATE = new Date();
    userInfo.CREATE_BY = 'sample user';

    const user = userRepository.create(userInfo);

    await isValidInfor(user);

    return await userRepository.save(user);
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
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError('Error: User not exist!');
    }

    return await deleteUser(userId);
  };

  /**
   * Deactive User
   * @param userId 
   * @returns 
   */
  static updateUserStatus = async (userId: string) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError('Error: User not exist!');
    }

    return await updateUserStatus(userId);
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
  static updateUser = async (userId: string, userInfo:  Partial<User>) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError('Error: User not exist!');
    }
    
    const isDuplicatedUserName = await findUserByUserName(userInfo.USER_NAME);

    if(isDuplicatedUserName) {
      throw new BadRequestError('Error: User name is duplicated!')
    }

    const objectParams = removeUndefinedProperty(userInfo);

    const userInstance = userRepository.create(objectParams);

    await isValidInfor(userInstance);

    return updateUser(userId, objectParams)
  };
}

export default UserService;
