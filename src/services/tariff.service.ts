import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { findTariffCodeByCode } from '../repositories/tariff-code.repo';
import { manager } from '../repositories/index.repo';
import { TariffList } from '../models/tariff.model';
import { findItemTypeByCode } from '../repositories/item-type.repo';
import { findMethodCode } from '../repositories/method.repo';
import {
  createTariff,
  deleteTariff,
  findTariff,
  findTariffCodeById,
  getAllTariff,
  getTariffByTemplate,
  getTariffTemp,
  updateTariff,
} from '../repositories/tariff.repo';
import { findTariffTemp } from '../repositories/tariff-temp.repo';

class TariffService {
  static createAndUpdateTariff = async (tariffCodeListInfo: TariffList, createBy: User) => {
    const insertData = tariffCodeListInfo.insert;
    const updateData = tariffCodeListInfo.update;

    let createdTariff;
    let updatedTariff;

    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const data of insertData) {
          const checkExist = await findTariffCodeByCode(data.TRF_CODE, transactionalEntityManager);

          if (!checkExist) {
            throw new BadRequestError(`Mã biểu cước ${data.TRF_CODE} không hợp lệ`);
          }

          const checkItemTypeCodeExist = await findItemTypeByCode(
            data.ITEM_TYPE_CODE,
            transactionalEntityManager,
          );

          if (!checkItemTypeCodeExist) {
            throw new BadRequestError(`Mã loại hàng hóa ${data.ITEM_TYPE_CODE} không tồn tại`);
          }

          const checkMethodCode = await findMethodCode(
            data.METHOD_CODE,
            transactionalEntityManager,
          );
          if (!checkMethodCode) {
            throw new BadRequestError(`Mã phương án ${data.METHOD_CODE} không hợp lệ`);
          }

          const isValidTariffTemp = await findTariffTemp(
            data.TRF_TEMP_CODE,
            transactionalEntityManager,
          );

          if (!isValidTariffTemp) {
            throw new BadRequestError(`Mã mẫu biểu cước ${data.TRF_TEMP_CODE} không hợp lệ`);
          }

          if (data.TRF_DESC === '') data.TRF_DESC = null;

          data.CREATE_BY = createBy.ROWGUID;
          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
          data.CREATE_DATE = new Date();
        }
      }
      createdTariff = await createTariff(insertData, transactionalEntityManager);

      if (updateData) {
        for (const data of updateData) {
          const tariff = await findTariffCodeById(data.ROWGUID);
          if (!tariff) {
            throw new BadRequestError(`RowId ${data.ROWGUID} không hợp lệ`);
          }

          if (data.TRF_CODE) {
            const checkExist = await findTariffCodeByCode(
              data.TRF_CODE,
              transactionalEntityManager,
            );

            if (!checkExist) {
              throw new BadRequestError(`Mã biểu cước ${data.TRF_CODE} không hợp lệ`);
            }
          }

          if (data.ITEM_TYPE_CODE) {
            const checkItemTypeCodeExist = await findItemTypeByCode(
              data.ITEM_TYPE_CODE,
              transactionalEntityManager,
            );

            if (!checkItemTypeCodeExist) {
              throw new BadRequestError(`Mã loại hàng hóa ${data.ITEM_TYPE_CODE} không hợp lệ`);
            }
          }

          if (data.METHOD_CODE) {
            const checkMethodCode = await findMethodCode(
              data.METHOD_CODE,
              transactionalEntityManager,
            );
            if (!checkMethodCode) {
              throw new BadRequestError(`Mã phương án ${data.METHOD_CODE} không hợp lệ`);
            }
          }

          if (data.TRF_DESC === '') data.TRF_DESC = null;

          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
        }
        updatedTariff = await updateTariff(updateData, transactionalEntityManager);
      }
    });
    return {
      createdTariff,
      updatedTariff,
    };
  };

  static deleteTariff = async (tariffRowIdList: string[]) => {
    for (const tariffId of tariffRowIdList) {
      const tariff = await findTariff(tariffId);
      if (!tariff) {
        throw new BadRequestError(`Tariff Code ${tariffId} không hợp lệ`);
      }
    }

    return await deleteTariff(tariffRowIdList);
  };

  static getAllTariff = async () => {
    return await getAllTariff();
  };

  static getTariffTemplate = async () => {
    return await getTariffTemp();
  };

  static getTariffByTemplate = async (template: string) => {
    return await getTariffByTemplate(template);
  };
}
export default TariffService;
