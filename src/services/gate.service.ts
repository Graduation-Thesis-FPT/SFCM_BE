import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { Gate, GateListInfo } from '../models/gate.model';
import {
  createGate,
  deleteGateMany,
  findGateByGateCode,
  getAllGate,
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

  static deleteGate = async (gateCodeList: string[]) => {
    for (const gateCode of gateCodeList) {
      const gate = await findGateByGateCode(gateCode.trim());
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
