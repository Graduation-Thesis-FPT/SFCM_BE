import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { Gate, GateListInfo } from '../models/gate.model';
import {
  createGate,
  deleteGateMany,
  findGate,
  findGateByGateCode,
  getAllGate,
  isDuplicateGate,
  updateGate,
} from '../repositories/gate.repo';
import { manager } from '../repositories/index.repo';

class GateService {
  static createAndUpdateGate = async (gateInfo: GateListInfo, createBy: User) => {
    const insertData = gateInfo.insert;
    const updateData = gateInfo.update;

    let newCreatedGate: Gate[] = [];
    let updatedGate;
    await manager.transaction(async transactionEntityManager => {
      if (insertData) {
        for (const gateInfo of insertData) {
          const gate = await findGateByGateCode(gateInfo.GATE_CODE, transactionEntityManager);

          if (gate) {
            throw new BadRequestError(`Mã cổng ${gateInfo.GATE_CODE} đã tồn tại`);
          }

          const isDuplicate = await isDuplicateGate(gateInfo.GATE_NAME);
          if (isDuplicate) {
            throw new BadRequestError(`Tên cổng ${gateInfo.GATE_NAME} (Đã tồn tại)`);
          }

          gateInfo.CREATE_BY = createBy.ROWGUID;
          gateInfo.UPDATE_BY = createBy.ROWGUID;
          gateInfo.UPDATE_DATE = new Date();
        }

        newCreatedGate = await createGate(insertData, transactionEntityManager);
      }

      if (updateData) {
        for (const gateInfo of updateData) {
          const gate = await findGateByGateCode(gateInfo.GATE_CODE, transactionEntityManager);
          if (!gate) {
            throw new BadRequestError(`Mã cổng ${gateInfo.GATE_CODE} không tồn tại`);
          }

          gateInfo.CREATE_BY = createBy.ROWGUID;
          gateInfo.UPDATE_BY = createBy.ROWGUID;
          gateInfo.UPDATE_DATE = new Date();
        }

        updatedGate = await updateGate(updateData, transactionEntityManager);
      }
    });

    return {
      newCreatedGate,
      updatedGate,
    };
  };

  static deleteGate = async (gateCodeList: string[]) => {
    for (const gateCode of gateCodeList) {
      const gate = await findGate(gateCode.trim());
      if (!gate) {
        throw new BadRequestError(`Gate with ID ${gateCode} not exist!`);
      }
    }

    return await deleteGateMany(gateCodeList);
  };

  static getAllGate = async () => {
    return await getAllGate();
  };
}
export default GateService;
