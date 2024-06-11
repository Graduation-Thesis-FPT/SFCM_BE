import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import {
  getUnit,
  deleteUnit,
  findUnitByCode,
  createUnit,
  updateUnit,
} from '../repositories/unit.repo';
import { UnitInfo } from '../models/unit.model';

class UnitService {
  static createAndUpdateUnit = async (UnitListInfo: UnitInfo, createBy: User) => {
    let insertData = UnitListInfo.insert;
    let updateData = UnitListInfo.update;

    let createdUnit;
    let updatedUnit;
    if (insertData.length) {
      for (const data of insertData) {
        const checkExist = await findUnitByCode(data.UNIT_CODE);

        if (checkExist) {
          throw new BadRequestError(ERROR_MESSAGE.UNIT_CODE_EXIST);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        data.CREATE_DATE = new Date();
      }
    }
    createdUnit = await createUnit(insertData);

    if (updateData.length) {
      for (const data of updateData) {
        const checkExist = await findUnitByCode(data.UNIT_CODE);

        if (!checkExist) {
          throw new BadRequestError(ERROR_MESSAGE.UNIT_CODE_EXIST);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        data.CREATE_DATE = new Date();
      }
      updatedUnit = await updateUnit(updateData);
    }
    return {
      createdUnit,
      updatedUnit,
    };
  };

  static deleteUnit = async (UnitCodeList: string[]) => {
    for (const UnitCode of UnitCodeList) {
      const Unit = await findUnitByCode(UnitCode);
      if (!Unit) {
        throw new BadRequestError(`Unit with ID ${Unit.UNIT_CODE} not exist!`);
      }
    }

    return await deleteUnit(UnitCodeList);
  };

  static getAllUnit = async () => {
    return await getUnit();
  };
}
export default UnitService;
