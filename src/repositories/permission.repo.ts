import mssqlConnection from '../db/mssql.connect';
import { Permission as PermissionEntity } from '../entity/permission.entity';

export const permissionRepo = mssqlConnection.getRepository(PermissionEntity);

const manager = mssqlConnection.manager;

interface Permission {
  PARENT_CODE: string;
  MENU_NAME: string;
  MENU_CODE: string;
  IS_VIEW: boolean;
  IS_ADD_NEW: boolean;
  IS_MODIFY: boolean;
  IS_DELETE: boolean;
}

const getAllPermission = async (): Promise<Permission[]> => {
  const rawData = await manager.query(
    `select sm.PARENT_CODE, sm.MENU_NAME, sm.MENU_CODE, sp.IS_VIEW, sp.IS_ADD_NEW, sp.IS_MODIFY, sp.IS_DELETE from SA_MENU sm left join SA_PERMISSION sp on sm.MENU_CODE = sp.MENU_CODE`,
  );

  return rawData;
};

export { getAllPermission };
