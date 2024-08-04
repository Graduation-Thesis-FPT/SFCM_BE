import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { getAllAvailableCell } from '../repositories/cell.repo';
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
  completeJobQuantityCheckByPackageId,
  checkSEQExist,
  checkJobStatus,
  checkCanCompoleteJobQuantityCheck,
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
          if (!data.PALLET_LENGTH || !data.PALLET_WIDTH || !data.PALLET_HEIGHT) {
            throw new BadRequestError(`Kích thước Pallet không được để trống`);
          }

          const isExist = await checkPackageIdExist(data.PACKAGE_ID);
          if (!isExist) {
            throw new BadRequestError(`Kiện hàng không tồn tại. Vui lòng kiểm tra lại`);
          }

          const isSEQExist = await checkSEQExist(PACKAGE_ID, data.SEQ);
          if (isSEQExist) {
            throw new BadRequestError(`Số thứ tự đã tồn tại. Vui lòng kiểm tra lại`);
          }

          const listVaidCell = await getAllAvailableCell({
            palletLength: data.PALLET_LENGTH,
            palletWidth: data.PALLET_WIDTH,
            palletHeight: data.PALLET_HEIGHT,
          });

          if (listVaidCell.length === 0) {
            throw new BadRequestError(`Kích thước Pallet không phù hợp với bất kỳ ô nào trong kho`);
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

          const isJobStatusExist = await checkJobStatus(data.ROWGUID, 'C');
          if (isJobStatusExist) {
            throw new BadRequestError(
              `${data.PALLET_NO} đã hoàn tất kiểm đếm. Vui lòng kiểm tra lại`,
            );
          }

          const listVaidCell = await getAllAvailableCell({
            palletLength: data.PALLET_LENGTH,
            palletWidth: data.PALLET_WIDTH,
            palletHeight: data.PALLET_HEIGHT,
          });

          if (listVaidCell.length === 0) {
            throw new BadRequestError(
              `Kích thước Housebill ${data.HOUSE_BILL} không phù hợp với bất kỳ ô nào trong kho`,
            );
          }

          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
        }

        const dataJob = updateData.map((item: any) => {
          return {
            ROWGUID: item.ROWGUID,
            ESTIMATED_CARGO_PIECE: item.ESTIMATED_CARGO_PIECE,
          };
        });
        const dataPallet = updateData.map((item: any) => {
          return {
            PALLET_NO: item.PALLET_NO,
            PALLET_HEIGHT: item.PALLET_HEIGHT,
            PALLET_LENGTH: item.PALLET_LENGTH,
            PALLET_WIDTH: item.PALLET_WIDTH,
            NOTE: item.NOTE,
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

  static completeJobQuantityCheckByPackageId = async (PACKAGE_ID: string, createBy: User) => {
    let newUpdateData;
    const dataUpdate = { JOB_STATUS: 'C', UPDATE_BY: createBy.ROWGUID, UPDATE_DATE: new Date() };
    await manager.transaction(async transactionalEntityManager => {
      const check = await checkCanCompoleteJobQuantityCheck(PACKAGE_ID);
      if (!check) {
        throw new BadRequestError(`Không thể hoàn tất kiểm đếm. Vui lòng kiểm tra lại`);
      }
      newUpdateData = await completeJobQuantityCheckByPackageId(
        PACKAGE_ID,
        dataUpdate,
        transactionalEntityManager,
      );
    });
    return {
      newUpdateData,
    };
  };
}

export default JobQuantityCheckService;
