import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { CustomerType, CustomerTypeList } from '../models/customer-type.model';
import {
  createCustomerType,
  deleteCustomerTypeMany,
  findCustomerType,
  findCustomerTypeByCode,
  getAllCustomerType,
  isDuplicateCustomerType,
  updateCustomerType,
} from '../repositories/customer-type.repo';

class CustomerTypeService {
  static createAndUpdateCustomerType = async (
    customerTypeInfo: CustomerTypeList,
    createBy: User,
  ) => {
    const insertData = customerTypeInfo.insert;
    const updateData = customerTypeInfo.update;

    let newCreatedCustomerType: CustomerType[] = [];
    let newUpdatedCustomerType;
    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const customerType of insertData) {
          const customer = await findCustomerTypeByCode(
            customerType.CUSTOMER_TYPE_CODE,
            transactionalEntityManager,
          );
          if (customer) {
            throw new BadRequestError(
              `Mã loại khách hàng ${customerType.CUSTOMER_TYPE_CODE} đã tồn tại`,
            );
          }

          const isDuplicate = await isDuplicateCustomerType(
            customerType.CUSTOMER_TYPE_NAME,
            transactionalEntityManager,
          );

          if (isDuplicate) {
            throw new BadRequestError(
              `Tên loại khách hàng ${customerType.CUSTOMER_TYPE_NAME} (Đã tồn tại)`,
            );
          }

          customerType.CREATE_BY = createBy.ROWGUID;
          customerType.UPDATE_BY = createBy.ROWGUID;
          customerType.UPDATE_DATE = new Date();
        }

        newCreatedCustomerType = await createCustomerType(insertData, transactionalEntityManager);
      }

      if (updateData) {
        for (const customerTypeInfo of updateData) {
          const gate = await findCustomerTypeByCode(
            customerTypeInfo.CUSTOMER_TYPE_CODE,
            transactionalEntityManager,
          );
          if (!gate) {
            throw new BadRequestError(
              `Mã loại khách hàng ${customerTypeInfo.CUSTOMER_TYPE_CODE} không tồn tại`,
            );
          }

          customerTypeInfo.CREATE_BY = createBy.ROWGUID;
          customerTypeInfo.UPDATE_BY = createBy.ROWGUID;
          customerTypeInfo.UPDATE_DATE = new Date();
        }

        newUpdatedCustomerType = await updateCustomerType(updateData, transactionalEntityManager);
      }
    });

    return {
      newCreatedCustomerType,
      newUpdatedCustomerType,
    };
  };

  static deleteCustomerType = async (customerTypeCodeList: string[]) => {
    for (const customerType of customerTypeCodeList) {
      const customer = await findCustomerType(customerType.trim());
      if (!customer) {
        throw new BadRequestError(`EquipType with ID ${customerType} not exist!`);
      }
    }

    return await deleteCustomerTypeMany(customerTypeCodeList);
  };

  static getAllCustomerType = async () => {
    return await getAllCustomerType();
  };
}
export default CustomerTypeService;
