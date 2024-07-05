import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  getAllImportTallyContainer,
  getAllJobQuantityCheckByPACKAGE_ID,
  getImportTallyContainerInfoByCONTAINER_ID,
  checkPackageIdExist,
  checkJobQuantityIdExist,
  updateJobQuantityCheck,
  updatePalletStock,
  checkPalletNoExist,
  insertJobAndPallet,
  checkEstimatedCargoPieceIsValid,
} from '../repositories/import-tally.repo';
import { manager } from '../repositories/index.repo';

class JobQuantityCheckService {
  static getAllImportTallyContainer = async () => {
    return await getAllImportTallyContainer();
  };

  static getImportTallyContainerInfoByCONTAINER_ID = async (CONTAINER_ID: string) => {
    return await getImportTallyContainerInfoByCONTAINER_ID(CONTAINER_ID);
  };

  static getAllJobQuantityCheckByPACKAGE_ID = async (PACKAGE_ID: string) => {
    return await getAllJobQuantityCheckByPACKAGE_ID(PACKAGE_ID);
  };

  static insertAndUpdateJobQuantityCheck = async (
    listData: any,
    createBy: User,
    PACKAGE_ID: string,
  ) => {
    const insertData = listData.insert;
    const updateData = listData.update;

    if (!insertData.length && !updateData.length) {
      throw new BadRequestError(`Không có dữ liệu để thực hiện thao tác. Vui lòng kiểm tra lại!`);
    }

    let newCreateData;
    let newUpdateData;

    await manager.transaction(async transactionalEntityManager => {
      if (insertData.length) {
        for (const data of insertData) {
          const isExist = await checkPackageIdExist(data.PACKAGE_ID);
          if (!isExist) {
            throw new BadRequestError(`Kiện hàng không tồn tại. Vui lòng kiểm tra lại`);
          }

          data.CREATE_BY = createBy.ROWGUID;
          data.UPDATE_BY = createBy.ROWGUID;
        }
        newCreateData = await insertJobAndPallet(insertData, transactionalEntityManager);
      }

      if (updateData.length) {
        for (const data of updateData) {
          const isPkExist = await checkPackageIdExist(data.PACKAGE_ID);
          if (!isPkExist) {
            throw new BadRequestError(`Kiện hàng không tồn tại. Vui lòng kiểm tra lại`);
          }

          const isJobExist = await checkJobQuantityIdExist(data.ROWGUID);
          if (!isJobExist) {
            throw new BadRequestError(`Mã kiểm đếm không tồn tại. Vui lòng kiểm tra lại`);
          }

          const isPalletExist = await checkPalletNoExist(data.PALLET_NO);
          if (!isPalletExist) {
            throw new BadRequestError(`Mã pallet không tồn tại. Vui lòng kiểm tra lại`);
          }

          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
        }

        const dataJob = updateData.map((item: any) => {
          return {
            ROWGUID: item.ROWGUID,
            ESTIMATED_CARGO_PIECE: item.ESTIMATED_CARGO_PIECE,
            NOTE: item.NOTE,
          };
        });
        const dataPallet = updateData.map((item: any) => {
          return {
            PALLET_NO: item.PALLET_NO,
            PALLET_HEIGHT: item.PALLET_HEIGHT,
            PALLET_LENGTH: item.PALLET_LENGTH,
            PALLET_WIDTH: item.PALLET_WIDTH,
          };
        });
        await Promise.all([
          updateJobQuantityCheck(dataJob, transactionalEntityManager),
          updatePalletStock(dataPallet, transactionalEntityManager),
        ]);
      }

      if (insertData.length || updateData.length) {
        const isValid = await checkEstimatedCargoPieceIsValid(
          PACKAGE_ID,
          transactionalEntityManager,
        );
        if (!isValid) {
          throw new BadRequestError(`Số lượng kiểm đếm không hợp lệ. Vui lòng kiểm tra lại`);
        }
      }
    });

    return {
      newCreateData,
      newUpdateData,
    };
  };
}

export default JobQuantityCheckService;
