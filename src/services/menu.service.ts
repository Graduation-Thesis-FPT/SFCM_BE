import { getMenuByRoleCode } from '../repositories/menu.repo';
import { parentMenu } from './permission.service';

class MenuService {
  static getMenuByRoleCode = async (roleCode: string) => {
    const menu = await getMenuByRoleCode(roleCode);

    const newMenu = [];
    for (const item of menu) {
      const obj: parentMenu = {
        MENU_NAME: '',
        MENU_CODE: '',
        child: [],
      };
      if (item.PARENT_CODE === null) {
        obj['MENU_NAME'] = item.MENU_NAME;
        obj['MENU_CODE'] = item.MENU_CODE;
        obj['child'] = [];
        newMenu.push(obj);
        continue;
      }

      if (newMenu.length > 0) {
        for (const newPer of newMenu) {
          if (newPer['MENU_CODE'] === item.PARENT_CODE) {
            newPer.child.push(item);
          }
        }
      }
    }

    const finalMenu = newMenu.filter(newPer => newPer.child.length > 0);

    return finalMenu;
  };
}
export default MenuService;
