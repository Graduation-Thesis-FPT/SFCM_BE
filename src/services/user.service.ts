import mssqlConnection from '../db/mssql.connect';
import { User } from '../entity/user.entity';
import isValidInfor from '../utils/validateRequestInfo';

const userRepository = mssqlConnection.getRepository(User);

class UserService {
  static createUserAccount = async (userInfo: User) => {
    userInfo.BIRTHDAY = new Date(userInfo.BIRTHDAY)
    userInfo.UPDATE_DATE = new Date()
    userInfo.CREATE_BY = 'sample user'  

    const user = userRepository.create(userInfo);

    await isValidInfor(user);

    return await userRepository.save(user); 
  };
}

export default UserService;
