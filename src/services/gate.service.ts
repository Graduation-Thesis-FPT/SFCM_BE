import { BadRequestError } from '../core/error.response';
import { isValidID } from '../utils';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { deleteBlockMany, findBlockById, getAllBlock } from '../repositories/block.repo';
import { Gate, GateListInfo } from '../models/gate.model';
import {
  createGate,
  findGateByGateCode,
  isDuplicateGate,
  updateGate,
} from '../repositories/gate.repo';

class GateService {
  static createAndUpdateGate = async (gateInfo: GateListInfo, createBy: User) => {
    const insertData = gateInfo.insert;
    const updateData = gateInfo.update;

    let newCreatedGate: Gate[] = [];
    let updatedGate;
    if (insertData) {
      for (const gateInfo of insertData) {
        const isDuplicate = await isDuplicateGate(gateInfo.GATE_NAME);
        if (isDuplicate) {
          throw new BadRequestError(`Tên cổng ${gateInfo.GATE_NAME} (Đã tồn tại)`);
        }

        gateInfo.CREATE_BY = createBy.ROWGUID;
        gateInfo.UPDATE_BY = createBy.ROWGUID;
        gateInfo.UPDATE_DATE = new Date();
      }

      newCreatedGate = await createGate(insertData);
    }

    if (updateData) {
      for (const gateInfo of updateData) {
        const gate = await findGateByGateCode(gateInfo.GATE_CODE);
        if (!gate) {
          throw new BadRequestError(ERROR_MESSAGE.GATE_NOT_EXIST);
        }

        gateInfo.CREATE_BY = createBy.ROWGUID;
        gateInfo.UPDATE_BY = createBy.ROWGUID;
        gateInfo.UPDATE_DATE = new Date();
      }

      updatedGate = await updateGate(updateData);
    }

    return {
      newCreatedGate,
      updatedGate,
    };
  };

  static deleteBlock = async (blockListID: string[]) => {
    for (const blockID of blockListID) {
      const isValidId = isValidID(blockID);
      if (!isValidId) {
        throw new BadRequestError(`ID ${blockID} is invalid!`);
      }

      const block = await findBlockById(blockID);
      if (!block) {
        throw new BadRequestError(`Block with ID ${block.ROWGUID} not exist!`);
      }

      if (block.STATUS) {
        throw new BadRequestError(
          `Không thể xóa dãy ${block.BLOCK_NAME} ở kho ${block.WAREHOUSE_CODE}`,
        );
      }
    }

    return await deleteBlockMany(blockListID);
  };

  static getAllBlock = async () => {
    return await getAllBlock();
  };
}
export default GateService;
