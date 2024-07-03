import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { findTariffCodeByCode } from '../repositories/tariff-code.repo';
import { manager } from '../repositories/index.repo';
import { findItemTypeByCode } from '../repositories/item-type.repo';
import { findMethodCode } from '../repositories/method.repo';
import { findTariffTemp } from '../repositories/tariff-temp.repo';
import { DiscountTariffList } from '../models/discount-tariff.model';
import { findCustomerByCode } from '../repositories/customer.repo';
import {
  createDiscountTariff,
  deleteDiscountTariff,
  findDiscountTariff,
  findDiscountTariffById,
  getAllDiscountTariff,
  getDiscountTariffByTemplate,
  updateDiscountTariff,
} from '../repositories/discount-tariff.repo';

class DiscountTariffService {
  static createAndUpdateDiscountTariff = async (
    discountTariffListInfo: DiscountTariffList,
    createBy: User,
  ) => {
    const insertData = discountTariffListInfo.insert;
    const updateData = discountTariffListInfo.update;

    let createdDiscountTariff;
    let updatedDiscountTariff;

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

          const isValidCustomerCode = await findCustomerByCode(
            data.CUSTOMER_CODE,
            transactionalEntityManager,
          );

          if (!isValidCustomerCode) {
            throw new BadRequestError(`Mã khách hàng ${data.CUSTOMER_CODE} không hợp lệ`);
          }

          if (data.TRF_DESC === '') data.TRF_DESC = null;

          data.CREATE_BY = createBy.ROWGUID;
          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
          data.CREATE_DATE = new Date();
        }
      }
      createdDiscountTariff = await createDiscountTariff(insertData, transactionalEntityManager);

      if (updateData) {
        for (const data of updateData) {
          const tariff = await findDiscountTariffById(data.ROWGUID);
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

          if (data.CUSTOMER_CODE) {
            const isValidCustomerCode = await findCustomerByCode(
              data.CUSTOMER_CODE,
              transactionalEntityManager,
            );

            if (!isValidCustomerCode) {
              throw new BadRequestError(`Mã khách hàng ${data.CUSTOMER_CODE} không hợp lệ`);
            }
          }

          if (data.TRF_DESC === '') data.TRF_DESC = null;

          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
        }
        updatedDiscountTariff = await updateDiscountTariff(updateData, transactionalEntityManager);
      }
    });
    return {
      createdDiscountTariff,
      updatedDiscountTariff,
    };
  };

  static deleteDiscountTariff = async (tariffRowIdList: string[]) => {
    for (const tariffId of tariffRowIdList) {
      const tariff = await findDiscountTariff(tariffId);
      if (!tariff) {
        throw new BadRequestError(`Discount Tariff Code ${tariffId} không hợp lệ`);
      }
    }

    return await deleteDiscountTariff(tariffRowIdList);
  };

  static getAllDiscountTariff = async () => {
    return await getAllDiscountTariff();
  };

  static getDiscountTariffByTemplate = async (template: string) => {
    return await getDiscountTariffByTemplate(template);
  };
}
export default DiscountTariffService;
