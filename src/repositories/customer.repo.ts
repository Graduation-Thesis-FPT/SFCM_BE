import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { Customer as CustomerEntity } from '../entity/customer.entity';
import { Customer } from '../models/customer.model';

export const customerRepository = mssqlConnection.getRepository(CustomerEntity);

const createCustomer = async (
  customerListInfo: Customer[],
  transactionalEntityManager: EntityManager,
) => {
  const customer = customerRepository.create(customerListInfo);

  const newCustomer = await transactionalEntityManager.save(customer);
  return newCustomer;
};

const updateCustomer = async (
  customerListInfo: Customer[],
  transactionalEntityManager: EntityManager,
) => {
  return await Promise.all(
    customerListInfo.map(customer =>
      transactionalEntityManager.update(CustomerEntity, customer.CUSTOMER_CODE, customer),
    ),
  );
};

const updateOneCustomer = async (
  userName: string,
  customerInfo: Partial<Customer>,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager.update(CustomerEntity, { USER_NAME: userName }, customerInfo);
}

const findCustomerByCode = async (
  customerCode: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(CustomerEntity, 'cust')
    .where('cust.CUSTOMER_CODE = :customerCode', { customerCode: customerCode })
    .getOne();
};

const findCustomer = async (customerCode: string) => {
  return await customerRepository
    .createQueryBuilder('customer')
    .where('customer.CUSTOMER_CODE = :customerCode', {
      customerCode: customerCode,
    })
    .getOne();
};

const deleteCustomerMany = async (customerCode: string[]) => {
  return await customerRepository.delete(customerCode);
};

const getAllCustomer = async () => {
  return await customerRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const findCustomerByUserName = async (userName: string) => {
  return await customerRepository
    .createQueryBuilder('customer')
    .where('customer.USER_NAME = :userName', {
      userName: userName,
    })
    .getOne();
}

export {
  createCustomer,
  updateCustomer,
  updateOneCustomer,
  findCustomerByCode,
  deleteCustomerMany,
  getAllCustomer,
  findCustomer,
  findCustomerByUserName,
};
