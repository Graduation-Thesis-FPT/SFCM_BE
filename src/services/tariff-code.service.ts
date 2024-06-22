import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { TariffCode, TariffCodeList } from '../models/tariff-code.model';
import {
  createTariffCode,
  deleteTariffCode,
  findTariffCode,
  findTariffCodeByCode,
  getAllTariffCode,
  updateTariffCode,
} from '../repositories/tariff-code.repo';
import { manager } from '../repositories/index.repo';

class TariffCodeService {
  static createAndUpdateTariffCode = async (tariffCodeListInfo: TariffCodeList, createBy: User) => {
    const insertData = tariffCodeListInfo.insert;
    const updateData = tariffCodeListInfo.update;

    let createdTariffCode;
    let updatedTariffCode;

    const processTariffCode = (data: TariffCode) => {
      data.CREATE_BY = createBy.ROWGUID;
      data.UPDATE_BY = createBy.ROWGUID;
      data.UPDATE_DATE = new Date();
      data.CREATE_DATE = new Date();
    };

    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const data of insertData) {
          const checkExist = await findTariffCodeByCode(data.TRF_CODE, transactionalEntityManager);

          if (checkExist) {
            throw new BadRequestError(`Mã biểu cước ${data.TRF_CODE} đã tồn tại`);
          }

          processTariffCode(data);
        }
      }
      createdTariffCode = await createTariffCode(insertData, transactionalEntityManager);

      if (updateData) {
        for (const data of updateData) {
          const checkExist = await findTariffCodeByCode(data.TRF_CODE, transactionalEntityManager);

          if (!checkExist) {
            throw new BadRequestError(`Mã biểu cước ${data.TRF_CODE} không hợp lệ`);
          }

          processTariffCode(data);
        }
        updatedTariffCode = await updateTariffCode(updateData, transactionalEntityManager);
      }
    });
    return {
      createdTariffCode,
      updatedTariffCode,
    };
  };

  static deleteTariffCode = async (tariffCodeList: string[]) => {
    for (const tariffCode of tariffCodeList) {
      const tariff = await findTariffCode(tariffCode);
      if (!tariff) {
        throw new BadRequestError(`Tariff Code ${tariffCode} không hợp lệ`);
      }
    }

    return await deleteTariffCode(tariffCodeList);
  };

  static getAllTariffCode = async () => {
    return await getAllTariffCode();
  };
}
export default TariffCodeService;
