import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import {
  createEquipType,
  deleteEquipTypeMany,
  findEquipType,
  findEquipTypeByCode,
  getAllEquipType,
  isDuplicateEquipType,
  updateEquipType,
} from '../repositories/equipment-type.repo';
import { EquipmentType, EquipmentTypeListInfo } from '../models/equipment-type.model';
import { manager } from '../repositories/index.repo';

class EquipTypeService {
  static createAndUpdateEquipType = async (equipInfo: EquipmentTypeListInfo, createBy: User) => {
    const insertData = equipInfo.insert;
    const updateData = equipInfo.update;

    let newCreatedEquipType: EquipmentType[] = [];
    let newUpdatedEquipType;
    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const equipInfo of insertData) {
          const gate = await findEquipTypeByCode(equipInfo.EQU_TYPE, transactionalEntityManager);
          if (gate) {
            throw new BadRequestError(ERROR_MESSAGE.EQUIPTYPE_IS_EXISTED);
          }

          const isDuplicate = await isDuplicateEquipType(
            equipInfo.EQU_TYPE_NAME,
            transactionalEntityManager,
          );

          if (isDuplicate) {
            throw new BadRequestError(`Trang thiết bị ${equipInfo.EQU_TYPE_NAME} (Đã tồn tại)`);
          }

          equipInfo.CREATE_BY = createBy.ROWGUID;
          equipInfo.UPDATE_BY = createBy.ROWGUID;
          equipInfo.UPDATE_DATE = new Date();
        }

        newCreatedEquipType = await createEquipType(insertData, transactionalEntityManager);
      }

      if (updateData) {
        for (const equipInfo of updateData) {
          const gate = await findEquipTypeByCode(equipInfo.EQU_TYPE, transactionalEntityManager);
          if (!gate) {
            throw new BadRequestError(ERROR_MESSAGE.EQUIPTYPE_NOT_EXIST);
          }

          equipInfo.CREATE_BY = createBy.ROWGUID;
          equipInfo.UPDATE_BY = createBy.ROWGUID;
          equipInfo.UPDATE_DATE = new Date();
        }

        newUpdatedEquipType = await updateEquipType(updateData, transactionalEntityManager);
      }
    });

    return {
      newCreatedEquipType,
      newUpdatedEquipType,
    };
  };

  static deleteEquipType = async (equipTypeCodeList: string[]) => {
    for (const equipType of equipTypeCodeList) {
      const equip = await findEquipType(equipType.trim());
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
