import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { MethodEntity } from '../entity/method.entity';
import { Method } from '../models/method.model';

export const methodRepository = mssqlConnection.getRepository(MethodEntity);

const findMethodByCode = async (methodCode: string) => {
  return await methodRepository
    .createQueryBuilder('method')
    .where('method.METHOD_CODE = :methodCode', { methodCode: methodCode })
    .getOne();
};

const getMethodCode = async () => {
  return await methodRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const deleteMethodMany = async (methodList: string[]) => {
  return await methodRepository.delete(methodList);
};

const createMethod = async (insertList: Method[]) => {
  return await methodRepository.save(insertList);
};

const updateMethod = async (updateList: Method[]) => {
  for (const data of updateList) {
    await methodRepository.update({ METHOD_CODE: data.METHOD_CODE }, data);
  }
  return true;
};

const findMethodByName = async (methodName: string, transactionalEntityManager: EntityManager) => {
  return await transactionalEntityManager
    .createQueryBuilder(MethodEntity, 'method')
    .where('method.METHOD_NAME = :methodName', { methodName: methodName })
    .getOne();
};
export {
  findMethodByCode,
  getMethodCode,
  deleteMethodMany,
  createMethod,
  updateMethod,
  findMethodByName,
};
