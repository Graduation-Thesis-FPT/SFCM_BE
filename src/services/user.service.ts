import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  deleteUser,
  findUserById,
  findUserByUserName,
  getAllUser,
  updateUserStatus,
  userRepository,
} from '../repositories/user.repo';
import isValidInfor from '../utils/validateRequestInfo';

class UserService {
  static createUserAccount = async (userInfo: User): Promise<User> => {
    const foundUser = await findUserByUserName(userInfo.USER_NAME);

    if (foundUser) {
      throw new BadRequestError('Error: User already exists!');
    }

    if (userInfo.BIRTHDAY) userInfo.BIRTHDAY = new Date(userInfo.BIRTHDAY);
    userInfo.UPDATE_DATE = new Date();
    userInfo.CREATE_BY = 'sample user';

    const user = userRepository.create(userInfo);

    await isValidInfor(user);

    return await userRepository.save(user);
  };

  static findUserById = async (userId: string): Promise<User> => {
    return await findUserById(userId);
  };

  static deleteUser = async (userId: string) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new BadRequestError('Error: User not exist!');
    }

    return await deleteUser(userId);
  };

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
}

export default UserService;
