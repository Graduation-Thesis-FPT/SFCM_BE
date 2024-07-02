import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { ConfigAttachSrvEntity } from '../entity/config-attach-srv.entity';
import { MethodEntity } from '../entity/method.entity';
import { User } from '../entity/user.entity';

const tbConfigAttachSrv = mssqlConnection.getRepository(ConfigAttachSrvEntity);
const tbMethod = mssqlConnection.getRepository(MethodEntity);

export const getConfigAttachSrvByMethodCode = async (METHOD_CODE: string) => {
  return await tbConfigAttachSrv.find({
    where: {
      METHOD_CODE: METHOD_CODE,
    },
  });
};

export const createAndUpdateConfigAttachSrvByMethodCode = async (
  METHOD_CODE: string,
  data: any,
  createBy: User,
) => {
  console.log(data);
  return await tbConfigAttachSrv.find({
    where: {
      METHOD_CODE: METHOD_CODE,
    },
  });
};

export const checkMethodIsExist = async (METHOD_CODE: string) => {
  return await tbMethod.findOne({
    where: { METHOD_CODE: METHOD_CODE },
  });
};

export const checkMethodIsSrv = async (METHOD_CODE: string) => {
  return await tbMethod.findOne({
    where: { METHOD_CODE: METHOD_CODE, IS_SERVICE: true },
  });
};

export const createConfigAttachSrv = async (
  createDataList: any,
  transactionalEntityManager: EntityManager,
) => {
  const configAttachSrv = tbConfigAttachSrv.create(createDataList);
  return await transactionalEntityManager.save(configAttachSrv);
};

export const deleteConfigAttachSrv = async (
  METHOD_CODE: string,
  deleteDataList: any,
  transactionalEntityManager: EntityManager,
) => {
  return transactionalEntityManager.transaction(async transactionEntityManager => {
    for (const deleteData of deleteDataList) {
      await transactionEntityManager.delete(ConfigAttachSrvEntity, {
        METHOD_CODE: METHOD_CODE,
        ATTACH_SERVICE_CODE: deleteData.METHOD_CODE,
      });
    }
  });
};
