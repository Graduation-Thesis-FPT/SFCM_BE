import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { findVesselByCode } from '../repositories/vessel.repo';
import { Container, ContainerList } from '../models/container.model';
import { findItemTypeByCode } from '../repositories/item-type.repo';
import { findCustomerByCode } from '../repositories/customer.repo';
import {
  createContainer,
  deleteContainerMany,
  filterContainer,
  findContainer,
  findContainerByRowid,
  isUniqueContainer,
  updateContainer,
} from '../repositories/container.repo';

class ContainerService {
  static createAndUpdateContainer = async (containerInfo: ContainerList, createBy: User) => {
    const insertData = containerInfo.insert;
    const updateData = containerInfo.update;

    let newCreatedContainer: Container[] = [];
    let newUpdatedContainer;

    const processContainer = (containerInfo: Container) => {
      if (containerInfo.BILLOFLADING === '') containerInfo.BILLOFLADING = null;
      if (containerInfo.SEALNO === '') containerInfo.SEALNO = null;
      if (containerInfo.COMMODITYDESCRIPTION === '') containerInfo.COMMODITYDESCRIPTION = null;
      containerInfo.CREATE_BY = createBy.ROWGUID;
      containerInfo.UPDATE_BY = createBy.ROWGUID;
      containerInfo.UPDATE_DATE = new Date();
    };

    await manager.transaction(async transactionEntityManager => {
      if (insertData) {
        for (const containerInfo of insertData) {
          const isDuplicated = await isUniqueContainer(
            containerInfo.VOYAGEKEY,
            containerInfo.CNTRNO,
            transactionEntityManager,
          );

          if (isDuplicated) {
            throw new BadRequestError(
              `Số container ${containerInfo.CNTRNO} đã tồn tại trên tàu ${containerInfo.VOYAGEKEY}`,
            );
          }

          const isContainerExist = await findVesselByCode(
            containerInfo.VOYAGEKEY,
            transactionEntityManager,
          );
          if (!isContainerExist) {
            throw new BadRequestError(`Mã tàu ${containerInfo.VOYAGEKEY} không tồn tại`);
          }

          const isValidItemTypeCode = await findItemTypeByCode(
            containerInfo.ITEM_TYPE_CODE,
            transactionEntityManager,
          );

          if (!isValidItemTypeCode) {
            throw new BadRequestError(
              `Mã loại hàng hóa ${containerInfo.ITEM_TYPE_CODE} không hợp lệ`,
            );
          }

          const isValidCustomerCode = await findCustomerByCode(
            containerInfo.CONSIGNEE,
            transactionEntityManager,
          );

          if (!isValidCustomerCode) {
            throw new BadRequestError(`Mã loại khách hàng ${containerInfo.CONSIGNEE} không hợp lệ`);
          }

          processContainer(containerInfo);
        }

        newCreatedContainer = await createContainer(insertData, transactionEntityManager);
      }

      if (updateData) {
        for (const containerInfo of updateData) {
          const container = await findContainerByRowid(
            containerInfo.ROWGUID,
            transactionEntityManager,
          );
          if (!container) {
            throw new BadRequestError(`Mã container ${containerInfo.ROWGUID} không hợp lệ`);
          }

          const isDuplicated = await isUniqueContainer(
            containerInfo.VOYAGEKEY,
            containerInfo.CNTRNO,
            transactionEntityManager,
          );

          if (isDuplicated) {
            throw new BadRequestError(
              `Không thể cập nhật số container ${containerInfo.CNTRNO} đã tồn tại trên tàu ${containerInfo.VOYAGEKEY}`,
            );
          }

          const isValidItemTypeCode = await findItemTypeByCode(
            containerInfo.ITEM_TYPE_CODE,
            transactionEntityManager,
          );

          if (!isValidItemTypeCode) {
            throw new BadRequestError(
              `Mã loại hàng hóa ${containerInfo.ITEM_TYPE_CODE} không hợp lệ`,
            );
          }

          const isValidCustomerCode = await findCustomerByCode(
            containerInfo.CONSIGNEE,
            transactionEntityManager,
          );

          if (!isValidCustomerCode) {
            throw new BadRequestError(`Mã loại khách hàng ${containerInfo.CONSIGNEE} không hợp lệ`);
          }

          processContainer(containerInfo);
        }

        newUpdatedContainer = await updateContainer(updateData, transactionEntityManager);
      }
    });

    return {
      newCreatedContainer,
      newUpdatedContainer,
    };
  };

  static deleteContainer = async (containerRowIdList: string[]) => {
    for (const rowId of containerRowIdList) {
      const container = await findContainer(rowId.trim());
      if (!container) {
        throw new BadRequestError(`Container with ID ${rowId} not exist!`);
      }
    }

    return await deleteContainerMany(containerRowIdList);
  };

  static getAllContainer = async (rule: any) => {
    return await filterContainer(rule);
  };
}
export default ContainerService;
