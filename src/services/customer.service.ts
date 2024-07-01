import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { findCustomerTypeByCode } from '../repositories/customer-type.repo';
import { Customer, CustomerList } from '../models/customer.model';
import {
  createCustomer,
  deleteCustomerMany,
  findCustomer,
  findCustomerByCode,
  getAllCustomer,
  updateCustomer,
} from '../repositories/customer.repo';

class CustomerService {
  static createAndUpdateCustomer = async (customerInfo: CustomerList, createBy: User) => {
    const insertData = customerInfo.insert;
    const updateData = customerInfo.update;

    let newCreatedCustomer: Customer[] = [];
    let newUpdatedCustomer;
    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const customerInfo of insertData) {
          const customer = await findCustomerByCode(customerInfo.CUSTOMER_CODE);
          if (customer) {
            throw new BadRequestError(`Mã khách hàng ${customer.CUSTOMER_CODE} đã tồn tại`);
          }

          const isValidCustomerType = await findCustomerTypeByCode(
            customerInfo.CUSTOMER_TYPE_CODE,
            transactionalEntityManager,
          );

          if (!isValidCustomerType) {
            throw new BadRequestError(
              `Mã loại khách hàng ${customerInfo.CUSTOMER_TYPE_CODE} không hợp lệ`,
            );
          }

          customerInfo.CREATE_BY = createBy.ROWGUID;
          customerInfo.UPDATE_BY = createBy.ROWGUID;
          customerInfo.UPDATE_DATE = new Date();
        }

        newCreatedCustomer = await createCustomer(insertData, transactionalEntityManager);
      }

      if (updateData) {
        for (const customerInfo of updateData) {
          const gate = await findCustomerByCode(customerInfo.CUSTOMER_CODE);
          if (!gate) {
            throw new BadRequestError(`Mã khách hàng ${customerInfo.CUSTOMER_CODE} không tồn tại`);
          }

          const isValidCustomerType = await findCustomerTypeByCode(
            customerInfo.CUSTOMER_TYPE_CODE,
            transactionalEntityManager,
          );

          if (!isValidCustomerType) {
            throw new BadRequestError(
              `Mã loại khách hàng ${customerInfo.CUSTOMER_TYPE_CODE} không hợp lệ`,
            );
          }

          customerInfo.CREATE_BY = createBy.ROWGUID;
          customerInfo.UPDATE_BY = createBy.ROWGUID;
          customerInfo.UPDATE_DATE = new Date();
        }

        newUpdatedCustomer = await updateCustomer(updateData, transactionalEntityManager);
      }
    });

    return {
      newCreatedCustomer,
      newUpdatedCustomer,
    };
  };

  static deleteCustomer = async (customerCodeList: string[]) => {
    for (const customerCode of customerCodeList) {
      const customer = await findCustomer(customerCode.trim());
      if (!customer) {
        throw new BadRequestError(`EquipType with ID ${customerCode} not exist!`);
      }
    }

    return await deleteCustomerMany(customerCodeList);
  };

  static getAllCustomer = async () => {
    return await getAllCustomer();
  };
}
export default CustomerService;
