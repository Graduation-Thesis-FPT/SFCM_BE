import mssqlConnection from '../db/mssql.connect';
import { Role as RoleEntity } from '../entity/role.entity';

export const roleRepository = mssqlConnection.getRepository(RoleEntity);

const getAllRole = async (): Promise<RoleEntity[]> => {
  return await roleRepository.find({
    select: {
      ROLE_CODE: true,
      ROLE_NAME: true,
    },
  });
};

export { getAllRole };
