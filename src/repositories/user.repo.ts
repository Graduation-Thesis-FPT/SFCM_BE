import { BadRequestError } from '../core/error.response';
import mssqlConnection from '../db/mssql.connect';
// import { Role } from '../entity/role.entity';
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

  const user = await userRepository.findOne({
    relations: { role: true },
    where: { ROWGUID: userId },
  });

  return user;
};

const getAllUser = async (): Promise<UserEntity[]> => {
  return await userRepository.find({
    relations: { role: true },
    order: { UPDATE_DATE: 'DESC' },
  });
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
