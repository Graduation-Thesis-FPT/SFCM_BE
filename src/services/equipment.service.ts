import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { findEquipTypeByCode } from '../repositories/equipment-type.repo';
import { Equipment, EquipmentListInfo } from '../models/equipment.models';
import {
  createEquipment,
  deleteEquipmentMany,
  findEquipmentByCode,
  findOneEquipment,
  getAllEquipment,
  updateEquipment,
} from '../repositories/equipment.repo';
// import { findCellById } from '../repositories/cell.repo';
import { isValidID } from '../utils';

class EquipmentService {
  static createAndUpdateEquipment = async (equipmentInfo: EquipmentListInfo, createBy: User) => {
    const insertData = equipmentInfo.insert;
    const updateData = equipmentInfo.update;

    let newCreatedEquipment: Equipment[] = [];
    let newUpdatedEquipment;
    if (insertData) {
      for (const equipmentInfo of insertData) {
        const isEquipmentCodeExist = await findOneEquipment(equipmentInfo.EQU_CODE);
        if (isEquipmentCodeExist) {
          throw new BadRequestError(`Mã thiết bị ${equipmentInfo.EQU_CODE} đã tồn`);
        }

        // const isValidEquipmentType = await findEquipTypeByCode(equipmentInfo.EQU_TYPE);

        // if (!isValidEquipmentType) {
        //   throw new BadRequestError(`Mã loại trang thiết bị không hợp lệ`);
        // }

        const isValidRowId = isValidID(equipmentInfo.REF_ROWGUID);

        if (!isValidRowId) {
          throw new BadRequestError(`Mã dãy không hợp lệ`);
        }

        // const isValidBlock = await findCellById(equipmentInfo.REF_ROWGUID);

        // if (!isValidBlock) {
        //   throw new BadRequestError(`Cell ID không tồn tại`);
        // }

        equipmentInfo.CREATE_BY = createBy.ROWGUID;
        equipmentInfo.UPDATE_BY = createBy.ROWGUID;
        equipmentInfo.UPDATE_DATE = new Date();
      }

      newCreatedEquipment = await createEquipment(insertData);
    }

    if (updateData) {
      for (const equipmentInfo of updateData) {
        const equipment = await findEquipmentByCode(equipmentInfo.EQU_CODE);
        if (!equipment) {
          throw new BadRequestError(ERROR_MESSAGE.EQUIPTYPE_NOT_EXIST);
        }

        equipmentInfo.CREATE_BY = createBy.ROWGUID;
        equipmentInfo.UPDATE_BY = createBy.ROWGUID;
        equipmentInfo.UPDATE_DATE = new Date();
      }

      newUpdatedEquipment = await updateEquipment(updateData);
    }

    return {
      newCreatedEquipment,
      newUpdatedEquipment,
    };
  };

  static deleteEquipment = async (equipmentCodeList: string[]) => {
    for (const equipment of equipmentCodeList) {
      const equip = await findEquipmentByCode(equipment.trim());
      if (!equip) {
        throw new BadRequestError(`Equipment with ID ${equipment} not exist!`);
      }
    }

    return await deleteEquipmentMany(equipmentCodeList);
  };

  static getAllEquipment = async () => {
    return await getAllEquipment();
  };
}
export default EquipmentService;
