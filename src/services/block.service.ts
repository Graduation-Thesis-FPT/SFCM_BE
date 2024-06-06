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
} from '../repositories/block.repo';
import { Block, BlockListInfo } from '../models/block.model';

class BlockService {
  static createAndUpdateBlock = async (blockListInfo: BlockListInfo, createBy: User) => {
    const insertData = blockListInfo.insert;
    const updateData = blockListInfo.update;

    let newCreatedBlock: Block[] = [];
    let updatedBlock;
    if (insertData) {
      for (const blockInfo of insertData) {
        const block = await isValidWarehouseCode(blockInfo.WAREHOUSE_CODE);

        if (!block) {
          throw new BadRequestError(ERROR_MESSAGE.INVALID_WAREHOUSE_CODE);
        }
        const isDuplicateBlock = await checkDuplicateBlock(
          blockInfo.WAREHOUSE_CODE,
          blockInfo.BLOCK_NAME,
        );
        if (isDuplicateBlock) {
          throw new BadRequestError(
            `Không thể thêm dãy ${blockInfo.BLOCK_NAME} ở kho ${blockInfo.WAREHOUSE_CODE} (Đã tồn tại)`,
          );
        }

        blockInfo.CREATE_BY = createBy.ROWGUID;
        blockInfo.UPDATE_BY = createBy.ROWGUID;
        blockInfo.UPDATE_DATE = new Date();
        blockInfo.STATUS = false;
      }

      newCreatedBlock = await createBlock(insertData);
    }

    if (updateData) {
      for (const blockInfo of updateData) {
        const block = await findBlockById(blockInfo.ROWGUID);
        if (!block) {
          throw new BadRequestError(ERROR_MESSAGE.BLOCK_NOT_EXIST);
        }

        if (block.STATUS) {
          throw new BadRequestError(
            `Không thể cập nhật dãy ${block.BLOCK_NAME} ở kho ${block.WAREHOUSE_CODE} đang hoạt động`,
          );
        }

        blockInfo.CREATE_BY = createBy.ROWGUID;
        blockInfo.UPDATE_BY = createBy.ROWGUID;
        blockInfo.UPDATE_DATE = new Date();
      }

      updatedBlock = await updateBlock(updateData);
    }

    return {
      newCreatedBlock,
      updatedBlock,
    };
  };

  static deleteBlock = async (blockListID: string[]) => {
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

  static getAllBlock = async () => {
    return await getAllBlock();
  };
}
export default BlockService;
