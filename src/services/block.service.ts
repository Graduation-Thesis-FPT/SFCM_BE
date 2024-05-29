import { BadRequestError } from '../core/error.response';
import { getInfoData, isValidID, isValidInfor } from '../utils';
import { ERROR_MESSAGE } from '../constants';
import { findWarehouseByCode } from '../repositories/warehouse.repo';
import { User } from '../entity/user.entity';
import {
  checkDuplicateBlock,
  createBlock,
  deleteBlockMany,
  findBlockById,
  getAllBlock,
} from '../repositories/block.repo';
import { Block } from '../entity/block.entity';

class BlockService {
  static createBlock = async (blockInfo: Block, createBy: User) => {
    if (!blockInfo.WAREHOUSE_CODE) {
      throw new BadRequestError('WAREHOUSE_CODE is required!');
    }

    const warehouse = await findWarehouseByCode(blockInfo.WAREHOUSE_CODE);
    if (!warehouse) {
      throw new BadRequestError(ERROR_MESSAGE.INVALID_WAREHOUSE_CODE);
    }

    const isDuplicateBlock = await checkDuplicateBlock(
      blockInfo.WAREHOUSE_CODE.trim(),
      blockInfo.BLOCK_NAME.trim(),
    );

    if (isDuplicateBlock) {
      throw new BadRequestError(ERROR_MESSAGE.BLOCK_DUPLICATED);
    }

    const newBlock = await createBlock(blockInfo, createBy);

    return getInfoData(newBlock, [
      'ROWGUID',
      'WAREHOUSE_CODE',
      'BLOCK_NAME',
      'TIER_COUNT',
      'SLOT_COUNT',
      'BLOCK_WIDTH',
      'BLOCK_HEIGH',
    ]);
  };

  static deleteBlock = async (blockListID: string[]) => {
    for (const blockID of blockListID) {
      const isValidId = isValidID(blockID);
      if (!isValidId) {
        throw new BadRequestError(`ID ${blockID} is invalid!`);
      }

      const block = await findBlockById(blockID);
      if (!block) {
        throw new BadRequestError(`Block with ID ${blockID} not exist!`);
      }

      if (block.STATUS) {
        throw new BadRequestError(
          `Block ${block.BLOCK_NAME} in warehouse ${block.WAREHOUSE_CODE} can not delete`,
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
