import { BadRequestError } from '../core/error.response';
import mssqlConnection from '../db/mssql.connect';
import { Role } from '../entity/role.entity';
import { User as UserEntity } from '../entity/user.entity';

export const userRepository = mssqlConnection.getRepository(UserEntity);
const findUserByUserName = async (userName: string): Promise<UserEntity> => {
  return await userRepository
    .createQueryBuilder('SA_USER')
    .where('SA_USER.USER_NAME = :USER_NAME', { USER_NAME: userName })
    .getOne();
};

const findUserById = async (userId: string): Promise<UserEntity> => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(userId)) {
    throw new BadRequestError('Error: Invalid User Id');
  }

  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect(Role, 'role', 'user.ROLE_CODE = role.ROLE_CODE')
    .select([
      'user.ROWGUID as ROWGUID',
      'user.USER_NAME as USER_NAME',
      'user.FULLNAME as FULLNAME',
      'user.EMAIL as EMAIL',
      'user.TELEPHONE as TELEPHONE',
      'user.ADDRESS as ADDRESS',
      'user.BIRTHDAY as BIRTHDAY',
      'user.IS_ACTIVE as IS_ACTIVE',
      'user.CREATE_DATE as CREATE_DATE',
      'user.CREATE_BY as CREATE_BY',
      'user.UPDATE_DATE as UPDATE_DATE',
      'user.UPDATE_BY as UPDATE_BY',
      'user.ROLE_CODE as ROLE_CODE',
      'role.ROLE_NAME as ROLE_NAME',
    ])
    .where('user.ROWGUID = :ROWGUID', { ROWGUID: userId })
    .getRawOne();

  return user;
};

const getAllUser = async (): Promise<UserEntity[]> => {
  return await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect(Role, 'role', 'user.ROLE_CODE = role.ROLE_CODE')
    .select([
      'user.ROWGUID as ROWGUID',
      'user.USER_NAME as USER_NAME',
      'user.FULLNAME as FULLNAME',
      'user.EMAIL as EMAIL',
      'user.TELEPHONE as TELEPHONE',
      'user.ADDRESS as ADDRESS',
      'user.BIRTHDAY as BIRTHDAY',
      'user.IS_ACTIVE as IS_ACTIVE',
      'user.CREATE_DATE as CREATE_DATE',
      'user.CREATE_BY as CREATE_BY',
      'user.UPDATE_DATE as UPDATE_DATE',
      'user.UPDATE_BY as UPDATE_BY',
      'user.ROLE_CODE as ROLE_CODE',
      'role.ROLE_NAME as ROLE_NAME',
    ])
    .orderBy('user.UPDATE_DATE', 'DESC')
    .getRawMany();
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

// deactive
const deactiveUser = async (userId: string) => {
  return await userRepository
    .createQueryBuilder()
    .update(UserEntity)
    .set({ IS_ACTIVE: false })
    .where('ROWGUID = :ROWGUID', { ROWGUID: userId })
    .execute();
};

// active
const activeUser = async (userId: string) => {
  return await userRepository
    .createQueryBuilder()
    .update(UserEntity)
    .set({ IS_ACTIVE: true })
    .where('ROWGUID = :ROWGUID', { ROWGUID: userId })
    .execute();
};

const updateUser = async (userId: string, userInfor: Partial<UserEntity>) => {
  return await userRepository.update(userId, userInfor);
};

export {
  findUserByUserName,
  findUserById,
  getAllUser,
  deleteUser,
  deactiveUser,
  activeUser,
  updateUser,
};
