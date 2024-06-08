import { BadRequestError } from '../core/error.response';
import { isValidID } from '../utils';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import {
  checkDuplicateBlock,
  createBlock,
  deleteBlockMany,
  findBlockById,
  getAllBlock,
  isValidWarehouseCode,
  updateBlock,
} from '../repositories/cell.repo';
import { Cell, CellListInfo } from '../models/block.model';

class BlockService {
  static createAndUpdateCell = async (cellListInfo: CellListInfo, createBy: User) => {
    const insertData = cellListInfo.insert;
    const updateData = cellListInfo.update;

    let newCreatedCell: Cell[] = [];
    let updatedCell;
    if (insertData) {
      for (const cellInfo of insertData) {
        const cell = await isValidWarehouseCode(cellInfo.WAREHOUSE_CODE);

        if (!cell) {
          throw new BadRequestError(ERROR_MESSAGE.INVALID_WAREHOUSE_CODE);
        }
        const isDuplicateBlock = await checkDuplicateBlock(
          cellInfo.WAREHOUSE_CODE,
          cellInfo.BLOCK_NAME,
        );
        if (isDuplicateBlock) {
          throw new BadRequestError(
            `Không thể thêm dãy ${cellInfo.BLOCK_NAME} ở kho ${cellInfo.WAREHOUSE_CODE} (Đã tồn tại)`,
          );
        }

        cellInfo.CREATE_BY = createBy.ROWGUID;
        cellInfo.UPDATE_BY = createBy.ROWGUID;
        cellInfo.UPDATE_DATE = new Date();
        cellInfo.STATUS = false;
      }

      newCreatedCell = await createBlock(insertData);
    }

    if (updateData) {
      for (const cellInfo of updateData) {
        const cell = await findBlockById(cellInfo.ROWGUID);
        if (!cell) {
          throw new BadRequestError(ERROR_MESSAGE.BLOCK_NOT_EXIST);
        }

        if (cell.STATUS) {
          throw new BadRequestError(
            `Không thể cập nhật dãy ${cell.BLOCK_NAME} ở kho ${cell.WAREHOUSE_CODE} đang hoạt động`,
          );
        }

        cellInfo.CREATE_BY = createBy.ROWGUID;
        cellInfo.UPDATE_BY = createBy.ROWGUID;
        cellInfo.UPDATE_DATE = new Date();
      }

      updatedCell = await updateBlock(updateData);
    }

    return {
      newCreatedCell,
      updatedCell,
    };
  };

  static deleteCell = async (blockListID: string[]) => {
    for (const blockID of blockListID) {
      const isValidId = isValidID(blockID);
      if (!isValidId) {
        throw new BadRequestError(`ID ${blockID} is invalid!`);
      }

      const block = await findBlockById(blockID);
      if (!block) {
        throw new BadRequestError(`Block with ID ${block.ROWGUID} not exist!`);
      }

      if (block.STATUS) {
        throw new BadRequestError(
          `Không thể xóa dãy ${block.BLOCK_NAME} ở kho ${block.WAREHOUSE_CODE}`,
        );
      }
    }

    return await deleteBlockMany(blockListID);
  };

  static getAllCell = async () => {
    return await getAllBlock();
  };
}
export default BlockService;
