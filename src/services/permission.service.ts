import { User } from '../entity/user.entity';
import { Permission } from '../models/permission.model';
import { getAllPermission, updatePermission } from '../repositories/permission.repo';

export interface parentMenu {
  MENU_NAME: string;
  MENU_CODE: string;
  child: object[];
}

class PermissionService {
  static updatePermission = async (permissions: Partial<Permission>[], updateBy: User) => {
    return await updatePermission(permissions, updateBy);
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
