import { Permission } from '../models/permission.model';
import { getAllPermission, grantPermission } from '../repositories/permission.repo';

interface parentMenu {
  MENU_NAME: string;
  MENU_CODE: string;
  child: object[];
}

class PermissionService {
  static grantPermission = async (permissions: Partial<Permission>[]) => {
    return await grantPermission(permissions);
  };

  static getAllPermission = async (role: string) => {
    const permissions = await getAllPermission(role);

    const newPermission = [];
    for (const permission of permissions) {
      const obj: parentMenu = {
        MENU_NAME: '',
        MENU_CODE: '',
        child: [],
      };
      if (permission.PARENT_CODE === null) {
        obj['MENU_NAME'] = permission.MENU_NAME;
        obj['MENU_CODE'] = permission.MENU_CODE;
        obj['child'] = [];
        newPermission.push(obj);
        continue;
      }

      if (newPermission.length > 0) {
        for (const newPer of newPermission) {
          if (newPer['MENU_CODE'] === permission.PARENT_CODE) {
            newPer.child.push(permission);
          }
        }
      }
    }

    const finalPermission = newPermission.filter(newPer => newPer.child.length > 0);

    return finalPermission;
  };
}
export default PermissionService;
