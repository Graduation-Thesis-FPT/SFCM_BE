import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { findTariffCodeByCode } from '../repositories/tariff-code.repo';
import { manager } from '../repositories/index.repo';
import { Tariff, TariffList } from '../models/tariff.model';
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
  isMatchTariff,
  updateTariff,
} from '../repositories/tariff.repo';
import moment from 'moment';

class TariffService {
  static createAndUpdateTariff = async (tariffCodeListInfo: TariffList, createBy: User) => {
    const insertData = tariffCodeListInfo.insert;
    const updateData = tariffCodeListInfo.update;

    let createdTariff;
    let updatedTariff;

    const processTariff = (data: Tariff) => {
      if (data.TRF_DESC === '') data.TRF_DESC = null;

      const from = moment(new Date(data.FROM_DATE)).format('DD/MM/YYYY');
      const to = moment(new Date(data.TO_DATE)).format('DD/MM/YYYY');

      data.TRF_TEMP = from + '-' + to + '-' + data.TRF_NAME;
      data.CREATE_BY = createBy.ROWGUID;
      data.UPDATE_BY = createBy.ROWGUID;
      data.UPDATE_DATE = new Date();
      data.CREATE_DATE = new Date();
    };

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

          if (data.FROM_DATE && data.TO_DATE) {
            const from = new Date(data.FROM_DATE);
            const to = new Date(data.TO_DATE);
            if (from > to) {
              throw new BadRequestError(`Ngày hiệu lực biểu cước phải nhỏ hơn ngày hết hạn`);
            }
          }

          processTariff(data);
        }
      }
      createdTariff = await createTariff(insertData, transactionalEntityManager);

      if (updateData) {
        const insert: Tariff[] = [];
        for (const data of updateData) {
          const tariff = await findTariffCodeById(data.ROWGUID, transactionalEntityManager);
          console.log(tariff);
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

          const from = data.FROM_DATE ? new Date(data.FROM_DATE) : null;
          const to = data.TO_DATE ? new Date(data.TO_DATE) : null;
          if (from && to) {
            if (from > to) {
              throw new BadRequestError(`Ngày hiệu lực biểu cước phải nhỏ hơn ngày hết hạn`);
            }
          }

          if (to) {
            if (to < new Date(tariff.FROM_DATE)) {
              throw new BadRequestError(`Ngày hết hạn biểu cước phải lớn hơn ngày hiệu lực`);
            }
          }

          if (from) {
            console.log(from);
            console.log(tariff.TO_DATE);
            if (from > new Date(tariff.TO_DATE)) {
              throw new BadRequestError(`Ngày hiệu lực biểu cước phải nhỏ hơn ngày hết hạn`);
            }
          }

          processTariff(data);

          if (data.TRF_CODE && data.METHOD_CODE && data.ITEM_TYPE_CODE) {
            const foundMatchTariff = await isMatchTariff(
              data.TRF_CODE,
              data.METHOD_CODE,
              data.ITEM_TYPE_CODE,
            );

            if (!foundMatchTariff) {
              delete data.ROWGUID;
              insert.push(data);
            }
          }
        }
        if (insert.length > 0) {
          updatedTariff = await createTariff(insert, transactionalEntityManager);
        } else {
          updatedTariff = await updateTariff(updateData, transactionalEntityManager);
        }
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
