import { getMenuByRoleCode } from '../repositories/menu.repo';

class MenuService {
  static getMenuByRoleCode = async (roleCode: string) => {
    return await getMenuByRoleCode(roleCode);
  };
}
export default MenuService;
