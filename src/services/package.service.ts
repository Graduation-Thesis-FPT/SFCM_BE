import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { Package, PackageInfo } from '../models/packageMnfLd.model';
import { isContainerExecuted } from '../repositories/container.repo';
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

    let newCreated;
    let newUpdated;

    await manager.transaction(async transactionalEntityManager => {
      for (const data of insertData) {
        const isExecuted = await isContainerExecuted(data.CONTAINER_ID);
        if (isExecuted) {
          throw new BadRequestError(`Không thể thêm dữ liệu, container đã làm lệnh!`);
        }
        const isExist = await check4AddnUpdate(data);
        if (isExist) {
          throw new BadRequestError(`Số HouseBill ${data.HOUSE_BILL} đã tồn tại trong container!`);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        // data.TIME_IN = new Date();
      }

      if (updateData.length > 0) {
        for (const data of updateData) {
          const isExecuted = await isContainerExecuted(data.CONTAINER_ID);
          if (isExecuted) {
            throw new BadRequestError(`Không thể thay đổi dữ liệu, container đã làm lệnh!`);
          }

          const isExist = await check4AddnUpdate(data);
          if (isExist) {
            throw new BadRequestError(`Số HouseBill ${data.HOUSE_BILL} đã tồn tại`);
          }
          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
          data.TIME_IN = new Date();
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
    // if (!dataPackage.length) {
    //   throw new BadRequestError(`Dữ liệu đâu mà xóa hả Phú, truyền bậy à!`);
    // }
    // const isSuccess = await check4UpdatenDelete(dataPackage[0].CONTAINER_ID);
    // console.log(isSuccess);
    // if (isSuccess) {
    //   throw new BadRequestError(`Không thể xóa dữ liệu vì đã làm lệnh!`);
    // }

    const isExecuted = await isContainerExecuted(dataPackage[0].CONTAINER_ID);
    if (isExecuted) {
      throw new BadRequestError(`Không thể xóa hàng hóa, container đã làm lệnh!`);
    }

    return await deletePackage(dataPackage.map(e => e.ROWGUID));
  };

  static getPackage = async (refcont: string) => {
    return await getPackage(refcont);
  };
}
export default PackageService;
