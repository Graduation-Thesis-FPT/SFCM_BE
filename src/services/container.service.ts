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
  isContainerExecuted,
  isDuplicateContainer,
  updateContainer,
} from '../repositories/container.repo';

class ContainerService {
  static createAndUpdateContainer = async (containerInfo: ContainerList, createBy: User) => {
    const insertData = containerInfo.insert;
    const updateData = containerInfo.update;

    let newCreatedContainer: Container[] = [];
    let newUpdatedContainer;

    await manager.transaction(async transactionalEntityManager => {
      if (insertData.length > 0) {
        for (const containerInfo of insertData) {
          const container = await isDuplicateContainer(
            containerInfo.VOYAGEKEY,
            containerInfo.CNTRNO,
            transactionalEntityManager,
          );

          if (container) {
            if (container.CNTRNO === containerInfo.CNTRNO) {
              throw new BadRequestError(`Số container ${containerInfo.CNTRNO} đã tồn tại trên tàu`);
            }
          }

          const isContainerExist = await findVesselByCode(
            containerInfo.VOYAGEKEY,
            transactionalEntityManager,
          );
          if (!isContainerExist) {
            throw new BadRequestError(`Mã tàu ${containerInfo.VOYAGEKEY} không tồn tại`);
          }

          const isValidItemTypeCode = await findItemTypeByCode(
            containerInfo.ITEM_TYPE_CODE,
            transactionalEntityManager,
          );

          if (!isValidItemTypeCode) {
            throw new BadRequestError(
              `Mã loại hàng hóa ${containerInfo.ITEM_TYPE_CODE} không hợp lệ`,
            );
          }

          const isValidCustomerCode = await findCustomerByCode(
            containerInfo.CONSIGNEE,
            transactionalEntityManager,
          );

          if (!isValidCustomerCode) {
            throw new BadRequestError(`Mã loại khách hàng ${containerInfo.CONSIGNEE} không hợp lệ`);
          }

          if (containerInfo.BILLOFLADING === '') containerInfo.BILLOFLADING = null;
          if (containerInfo.SEALNO === '') containerInfo.SEALNO = null;
          if (containerInfo.COMMODITYDESCRIPTION === '') containerInfo.COMMODITYDESCRIPTION = null;
          containerInfo.CREATE_BY = createBy.ROWGUID;
          containerInfo.CREATE_DATE = new Date();
          containerInfo.UPDATE_BY = createBy.ROWGUID;
          containerInfo.UPDATE_DATE = new Date();
        }

        newCreatedContainer = await createContainer(insertData, transactionalEntityManager);
      }

      if (updateData.length > 0) {
        const isExecuted = await isContainerExecuted(updateData[0].ROWGUID);
        if (isExecuted) {
          throw new BadRequestError(`Không thể cập nhật, container đã làm lệnh!`);
        }
        for (const containerReqInfo of updateData) {
          const container = await findContainerByRowid(
            containerReqInfo.ROWGUID,
            transactionalEntityManager,
          );
          if (!container) {
            throw new BadRequestError(`Mã container ${containerReqInfo.ROWGUID} không hợp lệ`);
          }

          // if (!container.STATUSOFGOOD) {
          //   throw new BadRequestError(
          //     `Không thể cập nhật container ${container.CNTRNO}, container đã được làm lệnh`,
          //   );
          // }

          if (containerReqInfo.CNTRNO !== container.CNTRNO) {
            const container = await isDuplicateContainer(
              containerReqInfo.VOYAGEKEY,
              containerReqInfo.CNTRNO,
              transactionalEntityManager,
            );

            if (container)
              if (container.CNTRNO === containerReqInfo.CNTRNO) {
                throw new BadRequestError(
                  `Số container ${containerReqInfo.CNTRNO} đã tồn tại trên tàu`,
                );
              }
          }

          const isValidItemTypeCode = await findItemTypeByCode(
            containerReqInfo.ITEM_TYPE_CODE,
            transactionalEntityManager,
          );

          if (!isValidItemTypeCode) {
            throw new BadRequestError(
              `Mã loại hàng hóa ${containerReqInfo.ITEM_TYPE_CODE} không hợp lệ`,
            );
          }

          const isValidCustomerCode = await findCustomerByCode(
            containerReqInfo.CONSIGNEE,
            transactionalEntityManager,
          );

          if (!isValidCustomerCode) {
            throw new BadRequestError(`Mã khách hàng ${containerReqInfo.CONSIGNEE} không hợp lệ`);
          }

          if (containerReqInfo.BILLOFLADING === '') containerReqInfo.BILLOFLADING = null;
          if (containerReqInfo.SEALNO === '') containerReqInfo.SEALNO = null;
          if (containerReqInfo.COMMODITYDESCRIPTION === '')
            containerReqInfo.COMMODITYDESCRIPTION = null;
          containerReqInfo.UPDATE_BY = createBy.ROWGUID;
          containerReqInfo.UPDATE_DATE = new Date();
        }

        newUpdatedContainer = await updateContainer(updateData, transactionalEntityManager);
      }
    });

    return {
      newCreatedContainer,
      newUpdatedContainer,
    };
  };

  static deleteContainer = async (containerRowIdList: string[]) => {
    const isExecuted = await isContainerExecuted(containerRowIdList[0]);
    if (isExecuted) {
      throw new BadRequestError(`Không thể xóa, container đã làm lệnh!`);
    }
    for (const rowId of containerRowIdList) {
      const container = await findContainer(rowId.trim());
      if (!container) {
        throw new BadRequestError(`Container with ID ${rowId} not exist!`);
      }

      // if (!container.STATUSOFGOOD) {
      //   throw new BadRequestError(
      //     `Không thể xóa container ${container.CNTRNO}, container đã được làm lệnh`,
      //   );
      // }
    }

    return await deleteContainerMany(containerRowIdList);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getAllContainer = async (rule: any) => {
    return await filterContainer(rule);
  };
}
export default ContainerService;
