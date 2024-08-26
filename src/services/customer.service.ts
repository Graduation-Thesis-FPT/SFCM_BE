import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { Customer, CustomerList } from '../models/customer.model';
import { findCustomerTypeByCode } from '../repositories/customer-type.repo';
import {
  createCustomer,
  deleteCustomerMany,
  findCustomer,
  findCustomerByCode,
  findCustomerTaxCode,
  getAllCustomer,
  updateCustomer,
} from '../repositories/customer.repo';
import { manager } from '../repositories/index.repo';
import { createUser, findUserByUserName, userRepository } from '../repositories/user.repo';
import EmailService from './email.service';
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
          const isValidCustomerType = await findCustomerTypeByCode(
            customerInfo.CUSTOMER_TYPE_CODE,
            transactionalEntityManager,
          );
          if (!isValidCustomerType) {
            throw new BadRequestError(
              `Mã loại khách hàng ${customerInfo.CUSTOMER_TYPE_CODE} không hợp lệ`,
            );
          }

          const customer = await findCustomerByCode(
            customerInfo.CUSTOMER_CODE,
            transactionalEntityManager,
          );
          if (customer) {
            throw new BadRequestError(`Mã khách hàng ${customer.CUSTOMER_CODE} đã tồn tại`);
          }

          const custByTaxCode = await findCustomerTaxCode(
            customerInfo.TAX_CODE,
            transactionalEntityManager,
          );
          if (custByTaxCode) {
            throw new BadRequestError(
              `Mã số thuế ${customerInfo.TAX_CODE} đã được sử dụng bởi khách hàng ${custByTaxCode.CUSTOMER_CODE}`,
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
            ADDRESS: customer.ADDRESS,
            IS_ACTIVE: customer.IS_ACTIVE,
            CREATE_BY: createBy.ROWGUID,
            UPDATE_BY: createBy.ROWGUID,
          };
          try {
            const user = userRepository.create(userInfo);
            const userAccount = await createUser(user, transactionalEntityManager);
            if (userAccount) {
              await EmailService.sendEmailAccountToCustomer(
                {
                  account: userAccount.USER_NAME,
                  password: process.env.DEFAULT_PASSWORD,
                  webUrl: process.env.WEB_URL,
                },
                customer.EMAIL,
              );
            }
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

          if (!customerInfo.EMAIL) {
            throw new BadRequestError(`Email không được để trống`);
          }

          const custByTaxCode = await findCustomerTaxCode(
            customerInfo.TAX_CODE,
            transactionalEntityManager,
          );
          if (custByTaxCode && custByTaxCode.CUSTOMER_CODE !== customerInfo.CUSTOMER_CODE) {
            throw new BadRequestError(
              `Mã số thuế ${customerInfo.TAX_CODE} đã được sử dụng bởi khách hàng ${custByTaxCode.CUSTOMER_CODE}`,
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
              const existingUserUpdate = await findUserByUserName(customerInfo.EMAIL);
              if (existingUserUpdate && existingUserUpdate.ROWGUID !== existingUser.ROWGUID) {
                throw new BadRequestError(
                  `Email ${customerInfo.EMAIL} đã được sử dụng cho tài khoản khác`,
                );
              }

              await UserService.updateUser(existingUser.ROWGUID, userUpdateInfo, createBy);
            }
            customerInfo.USER_NAME = customerInfo.EMAIL;
          } catch (error) {
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
    try {
      // First, fetch all customers to be deleted
      const customersToDelete = await Promise.all(
        customerCodeList.map(async code => {
          const customer = await findCustomer(code.trim());
          if (!customer) {
            throw new BadRequestError(`Mã khách ${code} không tồn tại!`);
          }
          return customer;
        }),
      );

      // Delete customers
      const deleteResult = await deleteCustomerMany(customerCodeList);

      if (deleteResult === true) {
        // If customers were successfully deleted, proceed to delete associated users
        for (const customer of customersToDelete) {
          if (customer.USER_NAME) {
            try {
              const user = await findUserByUserName(customer.USER_NAME.trim());
              if (user) {
                await UserService.deleteUser(user.ROWGUID);
              }
            } catch (error) {
              throw new BadRequestError(
                error.message || `Lỗi khi xoá tài khoản khách hàng ${customer.CUSTOMER_CODE}`,
              );
            }
          }
        }
        return true;
      }
    } catch (error) {
      throw new BadRequestError(`Lỗi khi xoá khách hàng: ${error.message}`);
    }
  };

  static getAllCustomer = async () => {
    return await getAllCustomer();
  };
}
export default CustomerService;
