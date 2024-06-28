import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { Package, PackageInfo } from '../models/packageMnfLd.model';
import { manager } from '../repositories/index.repo';
import {
  check4AddnUpdate,
  check4UpdatenDelete,
  createPackage,
  updatePackage,
  deletePackage,
  getPackage,
} from '../repositories/package.repo';

class PackageService {
  static createAndUpdate = async (reqData: PackageInfo, createBy: User) => {
    const insertData = reqData.insert;
    const updateData = reqData.update;

    let newCreated: Package[] = [];
    let newUpdated;

    await manager.transaction(async transactionalEntityManager => {
      for (const data of insertData) {
        const isExist = await check4AddnUpdate(data);
        if (isExist) {
          throw new BadRequestError(`Số HouseBill ${data.HOUSE_BILL} đã tồn tại trong container!`);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
      }

      if (updateData.length) {
        const isSuccess = await check4UpdatenDelete(updateData[0].ROWGUID);
        if (isSuccess) {
          throw new BadRequestError(`Không thể thay đổi dữ liệu vì đã làm lệnh!`);
        }
        for (const data of updateData) {
          const isExist = await check4AddnUpdate(data);
          if (isExist) {
            throw new BadRequestError(`Số HouseBill ${data.HOUSE_BILL} đã tồn tại`);
          }
          data.CREATE_BY = createBy.ROWGUID;
          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
        }
        newUpdated = await updatePackage(updateData, transactionalEntityManager);
      }
      if (insertData.length) {
        newCreated = await createPackage(insertData, transactionalEntityManager);
      }
    });

    return {
      newCreated,
      newUpdated,
    };
  };

  static deletePackage = async (dataPackage: Package[]) => {
    if (!dataPackage.length) {
      throw new BadRequestError(`Dữ liệu đâu mà xóa hả Phú, truyền bậy à!`);
    }
    const isSuccess = await check4UpdatenDelete(dataPackage[0].ROWGUID);
    if (isSuccess) {
      throw new BadRequestError(`Không thể xóa dữ liệu vì đã làm lệnh!`);
    }
    return await deletePackage(dataPackage.map(e => e.ROWGUID));
  };

  static getPackage = async (refcont: string) => {
    return await getPackage(refcont);
  };
}
export default PackageService;
