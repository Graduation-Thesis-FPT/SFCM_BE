import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { findEquipTypeByCode } from '../repositories/equipment-type.repo';
import { Equipment, EquipmentListInfo } from '../models/equipment.models';
import {
  createEquipment,
  deleteEquipmentMany,
  findEquipment,
  findEquipmentByCode,
  findOneEquipment,
  getAllEquipment,
  updateEquipment,
} from '../repositories/equipment.repo';
import { manager } from '../repositories/index.repo';
import { findBlockByCode } from '../repositories/block.repo';

class EquipmentService {
  static createAndUpdateEquipment = async (equipmentInfo: EquipmentListInfo, createBy: User) => {
    const insertData = equipmentInfo.insert;
    const updateData = equipmentInfo.update;

    let newCreatedEquipment: Equipment[] = [];
    let newUpdatedEquipment;
    await manager.transaction(async transactionEntityManager => {
      if (insertData) {
        for (const equipmentInfo of insertData) {
          const isEquipmentCodeExist = await findOneEquipment(
            equipmentInfo.EQU_CODE,
            transactionEntityManager,
          );
          if (isEquipmentCodeExist) {
            throw new BadRequestError(`Mã thiết bị ${equipmentInfo.EQU_CODE} đã tồn tại`);
          }

          const isValidEquipmentType = await findEquipTypeByCode(
            equipmentInfo.EQU_TYPE,
            transactionEntityManager,
          );

          if (!isValidEquipmentType) {
            throw new BadRequestError(
              `Mã loại trang thiết bị ${equipmentInfo.EQU_TYPE} không hợp lệ`,
            );
          }

          if (equipmentInfo.BLOCK_CODE) {
            const blockList = equipmentInfo.BLOCK_CODE.split(',');
            for (const block of blockList) {
              const result = await findBlockByCode(block.trim(), transactionEntityManager);
              if (!result) {
                throw new BadRequestError(`Dãy ${block} không tồn tại`);
              }
            }
          }

          equipmentInfo.CREATE_BY = createBy.ROWGUID;
          equipmentInfo.UPDATE_BY = createBy.ROWGUID;
          equipmentInfo.UPDATE_DATE = new Date();
        }

        newCreatedEquipment = await createEquipment(insertData, transactionEntityManager);
      }

      if (updateData) {
        for (const equipmentInfo of updateData) {
          const equipment = await findEquipmentByCode(
            equipmentInfo.EQU_CODE,
            transactionEntityManager,
          );
          if (!equipment) {
            throw new BadRequestError(ERROR_MESSAGE.EQUIPTYPE_NOT_EXIST_UPDATE);
          }

          const isValidEquipmentType = await findEquipTypeByCode(
            equipmentInfo.EQU_TYPE,
            transactionEntityManager,
          );

          if (!isValidEquipmentType) {
            throw new BadRequestError(
              `Mã loại trang thiết bị ${equipmentInfo.EQU_TYPE} không hợp lệ`,
            );
          }

          if (equipmentInfo.BLOCK_CODE) {
            const blockList = equipmentInfo.BLOCK_CODE.split(',');
            for (const block of blockList) {
              const result = await findBlockByCode(block.trim(), transactionEntityManager);
              if (!result) {
                throw new BadRequestError(`Dãy ${block} không hợp lệ`);
              }
            }
          }

          equipmentInfo.CREATE_BY = createBy.ROWGUID;
          equipmentInfo.UPDATE_BY = createBy.ROWGUID;
          equipmentInfo.UPDATE_DATE = new Date();
        }

        newUpdatedEquipment = await updateEquipment(updateData, transactionEntityManager);
      }
    });

    return {
      newCreatedEquipment,
      newUpdatedEquipment,
    };
  };

  static deleteEquipment = async (equipmentCodeList: string[]) => {
    for (const equipment of equipmentCodeList) {
      const equip = await findEquipment(equipment.trim());
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
