import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  checkMethodIsExist,
  checkMethodIsSrv,
  createConfigAttachSrv,
  deleteConfigAttachSrv,
  getConfigAttachSrvByMethodCode,
} from '../repositories/config-attach-srv.repo';
import { manager } from '../repositories/index.repo';

class ConfigAttachSrvService {
  static getConfigAttachSrvByMethodCode = async (METHOD_CODE: string) => {
    return await getConfigAttachSrvByMethodCode(METHOD_CODE);
  };

  static createAndUpdateConfigAttachSrvByMethodCode = async (
    METHOD_CODE: string,
    reqData: any,
    createBy: User,
  ) => {
    const isExist = await checkMethodIsExist(METHOD_CODE);
    if (!isExist) {
      throw new BadRequestError(`Phương án công việc ${METHOD_CODE} không tồn tại!`);
    }

    const isSrv = await checkMethodIsSrv(METHOD_CODE);
    if (isSrv) {
      throw new BadRequestError(`${METHOD_CODE} không phải phương án công việc!`);
    }

    const deleteData = reqData.deleteData;
    const createData = reqData.createData;

    let newCreated;
    let newUpdated;

    await manager.transaction(async transactionalEntityManager => {
      if (deleteData.length) {
        for (const data of deleteData) {
          const isExist = await checkMethodIsExist(data.METHOD_CODE);
          if (!isExist) {
            throw new BadRequestError(`Mã dịch vụ ${data.METHOD_CODE} không tồn tại!`);
          }

          const isSrv = await checkMethodIsSrv(data.METHOD_CODE);
          if (!isSrv) {
            throw new BadRequestError(`${data.METHOD_CODE} không không phải là dịch vụ đính kèm!`);
          }
        }
      }

      if (createData.length) {
        let createDataInfo = [];
        for (const data of createData) {
          const isExist = await checkMethodIsExist(data.METHOD_CODE);
          if (!isExist) {
            throw new BadRequestError(`Mã dịch vụ ${data.METHOD_CODE} không tồn tại!`);
          }

          const isSrv = await checkMethodIsSrv(data.METHOD_CODE);
          if (!isSrv) {
            throw new BadRequestError(`${data.METHOD_CODE} không không phải là dịch vụ đính kèm!`);
          }

          createDataInfo.push({
            METHOD_CODE: METHOD_CODE,
            ATTACH_SERVICE_CODE: data.METHOD_CODE,
            CREATE_BY: createBy.ROWGUID,
            UPDATE_BY: createBy.ROWGUID,
          });
        }
        newCreated = await createConfigAttachSrv(createDataInfo, transactionalEntityManager);
      }

      if (deleteData.length) {
        newUpdated = await deleteConfigAttachSrv(
          METHOD_CODE,
          deleteData,
          transactionalEntityManager,
        );
      }
    });

    return {
      newCreated,
      newUpdated,
    };
  };
}

export default ConfigAttachSrvService;
