import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import {
  createEquipType,
  deleteEquipTypeMany,
  findEquipTypeByCode,
  getAllEquipType,
  isDuplicateEquipType,
  updateEquipType,
} from '../repositories/equip-type.repo';
import { EquipType, EquipTypeListInfo } from '../models/equip-type.model';

class EquipTypeService {
  static createAndUpdateEquipType = async (equipInfo: EquipTypeListInfo, createBy: User) => {
    const insertData = equipInfo.insert;
    const updateData = equipInfo.update;

    let newCreatedEquipType: EquipType[] = [];
    let newUpdatedEquipType;
    if (insertData) {
      for (const equipInfo of insertData) {
        const isDuplicate = await isDuplicateEquipType(equipInfo.EQU_TYPE_NAME);
        if (isDuplicate) {
          throw new BadRequestError(`Trang thiết bị ${equipInfo.EQU_TYPE_NAME} (Đã tồn tại)`);
        }

        equipInfo.CREATE_BY = createBy.ROWGUID;
        equipInfo.UPDATE_BY = createBy.ROWGUID;
        equipInfo.UPDATE_DATE = new Date();
      }

      newCreatedEquipType = await createEquipType(insertData);
    }

    if (updateData) {
      for (const equipInfo of updateData) {
        const gate = await findEquipTypeByCode(equipInfo.EQU_TYPE);
        if (!gate) {
          throw new BadRequestError(ERROR_MESSAGE.EQUIPTYPE_NOT_EXIST);
        }

        equipInfo.CREATE_BY = createBy.ROWGUID;
        equipInfo.UPDATE_BY = createBy.ROWGUID;
        equipInfo.UPDATE_DATE = new Date();
      }

      newUpdatedEquipType = await updateEquipType(updateData);
    }

    return {
      newCreatedEquipType,
      newUpdatedEquipType,
    };
  };

  static deleteEquipType = async (equipTypeCodeList: string[]) => {
    for (const equipType of equipTypeCodeList) {
      const equip = await findEquipTypeByCode(equipType.trim());
      if (!equip) {
        throw new BadRequestError(`EquipType with ID ${equipType} not exist!`);
      }
    }

    return await deleteEquipTypeMany(equipTypeCodeList);
  };

  static getAllEquipType = async () => {
    return await getAllEquipType();
  };
}
export default EquipTypeService;
