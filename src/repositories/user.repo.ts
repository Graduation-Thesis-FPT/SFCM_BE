import mssqlConnection from '../db/mssql.connect';
import { User as UserEntity } from '../entity/user.entity';

export const userRepository = mssqlConnection.getRepository(UserEntity);

const findUserByUserName = async (userName: string): Promise<UserEntity> => {
  return await userRepository
    .createQueryBuilder('SA_USER')
    .where('SA_USER.USER_NAME = :USER_NAME', { USER_NAME: userName })
    .getOne();
};

const findUserById = async (userId: string): Promise<UserEntity> => {
  return await userRepository.findOneBy({ ROWGUID: userId });
};

const getAllUser = async (): Promise<UserEntity[]> => {
  return await userRepository.find();
};

// delete forever
const deleteUser = async (userId: string) => {
  return await userRepository
    .createQueryBuilder()
    .delete()
    .from(UserEntity)
    .where('ROWGUID = :ROWGUID', { ROWGUID: userId })
    .execute();
};

// soft delete
const updateUserStatus = async (userId: string) => {
  return await userRepository
    .createQueryBuilder()
    .update(UserEntity)
    .set({ IS_ACTIVE: 0 })
    .where('ROWGUID = :ROWGUID', { ROWGUID: userId })
    .execute();
};

export { findUserByUserName, findUserById, getAllUser, deleteUser, updateUserStatus };
