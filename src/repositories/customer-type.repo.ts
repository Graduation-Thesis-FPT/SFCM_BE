import { EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
import { CustomerType as CustomerTypeEntity } from '../entity/customer-type.entity';
import { CustomerType } from '../models/customer-type.model';

export const customerTypeRepository = mssqlConnection.getRepository(CustomerTypeEntity);

const isDuplicateCustomerType = async (
  customerTypeName: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(CustomerTypeEntity, 'customer')
    .where('customer.CUSTOMER_TYPE_NAME = :customerTypeName', {
      customerTypeName: customerTypeName,
    })
    .getOne();
};

const createCustomerType = async (
  customerTypeListInfo: CustomerType[],
  transactionalEntityManager: EntityManager,
) => {
  const customerType = customerTypeRepository.create(customerTypeListInfo);

  const newCustomerType = await transactionalEntityManager.save(customerType);
  return newCustomerType;
};

const updateCustomerType = async (
  customerTypeListInfo: CustomerType[],
  transactionalEntityManager: EntityManager,
) => {
  return await Promise.all(
    customerTypeListInfo.map(customerType =>
      transactionalEntityManager.update(
        CustomerTypeEntity,
        customerType.CUSTOMER_TYPE_CODE,
        customerType,
      ),
    ),
  );
};

const findCustomerTypeByCode = async (
  customerTypeCode: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(CustomerTypeEntity, 'cust')
    .where('cust.CUSTOMER_TYPE_CODE = :customerTypeCode', { customerTypeCode: customerTypeCode })
    .getOne();
};

const findCustomerType = async (customerTypeCode: string) => {
  return await customerTypeRepository
    .createQueryBuilder('customer')
    .where('customer.CUSTOMER_TYPE_CODE = :customerTypeCode', {
      customerTypeCode: customerTypeCode,
    })
    .getOne();
};

const deleteCustomerTypeMany = async (customerTypeCode: string[]) => {
  return await customerTypeRepository.delete(customerTypeCode);
};

const getAllCustomerType = async () => {
  return await customerTypeRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export {
  isDuplicateCustomerType,
  createCustomerType,
  updateCustomerType,
  findCustomerTypeByCode,
  deleteCustomerTypeMany,
  getAllCustomerType,
  findCustomerType,
};
