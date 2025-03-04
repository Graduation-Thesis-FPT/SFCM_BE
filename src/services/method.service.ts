import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { Method, MethodInfoList } from '../models/method.model';
import { manager } from '../repositories/index.repo';
import { MethodEntity } from '../entity/method.entity';
import {
  deleteMethodMany,
  findMethodByCode,
  findMethodByName,
  getMethodCode,
} from '../repositories/method.repo';

class MethodService {
  static createAndUpdateMethod = async (methodInfoList: MethodInfoList, createBy: User) => {
    const insertData = methodInfoList.insert;
    const updateData = methodInfoList.update;

    const newCreatedMethod: Method[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newUpdatedMethod: any = [];

    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const methodInfo of insertData) {
          const methodCode = await transactionalEntityManager.findOne(MethodEntity, {
            where: { METHOD_CODE: methodInfo.METHOD_CODE },
          });
          if (methodCode) {
            throw new BadRequestError(`Mã phương án ${methodInfo.METHOD_CODE} đã tồn tại`);
          }

          const methodName = await findMethodByName(
            methodInfo.METHOD_NAME,
            transactionalEntityManager,
          );
          if (methodName) {
            throw new BadRequestError(`Tên phương án ${methodInfo.METHOD_NAME} đã tồn tại`);
          }

          methodInfo.METHOD_CODE = methodInfo.METHOD_CODE;
          methodInfo.CREATE_BY = createBy.ROWGUID;
          methodInfo.UPDATE_BY = createBy.ROWGUID;
          methodInfo.UPDATE_DATE = new Date();
          const newMethod = await transactionalEntityManager.save(MethodEntity, methodInfo);
          newCreatedMethod.push(newMethod);
        }
      }

      if (updateData) {
        for (const methodInfo of updateData) {
          const method = await transactionalEntityManager.findOne(MethodEntity, {
            where: { METHOD_CODE: methodInfo.METHOD_CODE },
          });
          if (!method) {
            throw new BadRequestError(ERROR_MESSAGE.METHOD_CODE_NOT_EXIST);
          }

          methodInfo.CREATE_BY = createBy.ROWGUID;
          methodInfo.UPDATE_BY = createBy.ROWGUID;
          methodInfo.UPDATE_DATE = new Date();

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { METHOD_CODE, ...updateDataWithoutPK } = methodInfo;

          const updatedMethod = await transactionalEntityManager.update(
            MethodEntity,
            methodInfo.METHOD_CODE,
            updateDataWithoutPK,
          );
          newUpdatedMethod.push(updatedMethod);
        }
      }
    });

    return {
      newCreatedMethod,
      newUpdatedMethod,
    };
  };

  static deleteMethod = async (methodCodeList: string[]) => {
    for (const method of methodCodeList) {
      const methodFound = await findMethodByCode(method.trim());
      if (!methodFound) {
        throw new BadRequestError(`Mã phương án ${method} không tồn tại!`);
      }
    }

    return await deleteMethodMany(methodCodeList);
  };

  static getAllMethod = async () => {
    return await getMethodCode();
  };
}
export default MethodService;
