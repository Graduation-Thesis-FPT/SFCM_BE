import mssqlConnection from '../db/mssql.connect';
// import { Menu } from '../entity/menu.entity';
import { Permission as PermissionEntity } from '../entity/permission.entity';
import { Permission } from '../models/permission.model';

export const permissionRepository = mssqlConnection.getRepository(PermissionEntity);

const manager = mssqlConnection.manager;

// const getAllPermission = async (role: string): Promise<Permission[]> => {
//   const rawData = await manager.query(
//     `select sm.PARENT_CODE, sm.MENU_NAME, sm.MENU_CODE, sp.IS_VIEW, sp.IS_ADD_NEW, sp.IS_MODIFY, sp.IS_DELETE, sp.ROLE_CODE
//         from SA_MENU sm
//         left join SA_PERMISSION sp
//         on sm.MENU_CODE = sp.MENU_CODE
//         where ROLE_CODE = 'admin' or PARENT_CODE is null
//     `,
//   );

//   return rawData;
// };

const getAllPermission = async (role: string): Promise<Permission[]> => {
  const rawData = await manager
    .createQueryBuilder()
    .select([
      'sm.PARENT_CODE',
      'sm.MENU_NAME',
      'sm.MENU_CODE',
      'sp.IS_VIEW',
      'sp.IS_ADD_NEW',
      'sp.IS_MODIFY',
      'sp.IS_DELETE',
      'sp.ROLE_CODE',
      'sp.ROWGUID'
    ])
    .from('SA_MENU', 'sm')
    .leftJoin('SA_PERMISSION', 'sp', 'sm.MENU_CODE = sp.MENU_CODE')
    .where('sp.ROLE_CODE = :role OR sm.PARENT_CODE IS NULL', { role })
    .getRawMany();

  return rawData;
};

export { getAllPermission };
