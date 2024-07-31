import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { Customer, CustomerList } from '../models/customer.model';
import { findCustomerTypeByCode } from '../repositories/customer-type.repo';
import {
  createCustomer,
  deleteCustomerMany,
  findCustomer,
  findCustomerByCode,
  getAllCustomer,
  updateCustomer,
} from '../repositories/customer.repo';
import { manager } from '../repositories/index.repo';
import { findUserByUserName } from '../repositories/user.repo';
import UserService from './user.service';

class CustomerService {
  static createAndUpdateCustomer = async (customerInfo: CustomerList, createBy: User) => {
    const insertData = customerInfo.insert;
    const updateData = customerInfo.update;

    let newCreatedCustomer: Customer[] = [];
    let newUpdatedCustomer;
    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const customerInfo of insertData) {
          const customer = await findCustomerByCode(
            customerInfo.CUSTOMER_CODE,
            transactionalEntityManager,
          );
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
          const foundUser = await findUserByUserName(customerInfo.EMAIL);
          if (foundUser) {
            throw new BadRequestError(
              `Email ${customerInfo.EMAIL} đã được sử dụng cho tài khoản khác`,
            );
          }

          customerInfo.CREATE_BY = createBy.ROWGUID;
          customerInfo.CREATE_DATE = new Date();
          customerInfo.UPDATE_BY = createBy.ROWGUID;
          customerInfo.UPDATE_DATE = new Date();
          customerInfo.USER_NAME = customerInfo.EMAIL;
        }

        newCreatedCustomer = await createCustomer(insertData, transactionalEntityManager);
        for (const customer of newCreatedCustomer) {
          const userInfo: Partial<User> = {
            USER_NAME: customer.USER_NAME,
            EMAIL: customer.EMAIL,
            FULLNAME: customer.CUSTOMER_NAME,
            ROLE_CODE: 'customer',
            IS_ACTIVE: customer.IS_ACTIVE,
          };

          try {
            await UserService.createUserAccount(userInfo as User, createBy);
          } catch (error) {
            // console.error(`Lối khi tạo tài khoản cho khách hàng ${customer.CUSTOMER_CODE}:`, error);
            throw new BadRequestError(
              `Lối khi tạo tài khoản cho khách hàng ${customer.CUSTOMER_CODE}:${error.message}`,
            );
          }
        }
      }

      if (updateData) {
        for (const customerInfo of updateData) {
          const gate = await findCustomerByCode(
            customerInfo.CUSTOMER_CODE,
            transactionalEntityManager,
          );
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

          customerInfo.UPDATE_BY = createBy.ROWGUID;
          customerInfo.UPDATE_DATE = new Date();

          try {
            const existingUser = await findUserByUserName(customerInfo.USER_NAME);
            if (existingUser) {
              const userUpdateInfo: Partial<User> = {
                FULLNAME: customerInfo.CUSTOMER_NAME,
                IS_ACTIVE: customerInfo.IS_ACTIVE,
                ADDRESS: customerInfo.ADDRESS,
              };

              // Only update email/username if it has changed
              if (customerInfo.EMAIL !== existingUser.EMAIL) {
                userUpdateInfo.EMAIL = customerInfo.EMAIL;
                userUpdateInfo.USER_NAME = customerInfo.EMAIL;
              }

              await UserService.updateUser(existingUser.ROWGUID, userUpdateInfo, createBy);
            }
          } catch (error) {
            // console.error(
            //   `Lỗi khi cập nhật tài khoản khách hàng ${customerInfo.CUSTOMER_CODE}:`,
            //   error,
            // );
            throw new BadRequestError(
              `Lỗi khi cập nhật tài khoản khách hàng ${customerInfo.CUSTOMER_CODE}: ${error.message}`,
            );
          }
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
      try {
        console.log('customer', customer.USER_NAME);
        const user = await findUserByUserName(customer.USER_NAME.trim());
        console.log('user', user);
        if (user) {
          await UserService.deleteUser(user.ROWGUID);
        }
      } catch (error) {
        // console.error(`Lỗi khi xoá tài khoản khách hàng ${customerCode}:`, error);
        throw new BadRequestError(
          `Lỗi khi xoá tài khoản khách hàng ${customerCode}:${error.message}`,
        );
      }
    }

    return await deleteCustomerMany(customerCodeList);
  };

  static getAllCustomer = async () => {
    return await getAllCustomer();
  };
}
export default CustomerService;
