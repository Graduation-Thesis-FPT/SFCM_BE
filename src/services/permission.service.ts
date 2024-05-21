import { getAllPermission } from '../repositories/permission.repo';

import _ from 'lodash';

class PermissionService {
  static grantPermission = async () => {
    return { data: 'granted' };
  };

  static getAllPermission = async (role: string) => {
    const permissions = await getAllPermission(role);

    let newPermission = [];
    for (let permission of permissions) {
      const obj: any = {};
      if (permission.PARENT_CODE === null) {
        obj['MENU_NAME'] = permission.MENU_NAME;
        obj['MENU_CODE'] = permission.MENU_CODE;
        obj['child'] = [];
        newPermission.push(obj);
        continue;
      }

      if (newPermission.length > 0) {
        for (let newPer of newPermission) {
          if (newPer['MENU_CODE'] === permission.PARENT_CODE) {
            newPer.child.push(permission);
          }
        }
      }
    }

    const finalPermission = newPermission.filter((newPer) => newPer.child.length > 0);

    return finalPermission;
  };
}
export default PermissionService;
