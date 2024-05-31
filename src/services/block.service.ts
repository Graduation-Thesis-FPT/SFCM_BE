import { BadRequestError } from '../core/error.response';
import { isValidID } from '../utils';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import {
  checkDuplicateBlock,
  createBlock,
  deleteBlockMany,
  findBlockById,
  findBlockByWarehouseCode,
  getAllBlock,
} from '../repositories/block.repo';
import { Block } from '../entity/block.entity';

class BlockService {
  static createBlock = async (blockListInfo: Block[], createBy: User) => {
    for (const blockInfo of blockListInfo) {
      const block = await findBlockByWarehouseCode(blockInfo.WAREHOUSE_CODE);

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

    const newBlock = await createBlock(blockListInfo);

    return newBlock;
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
