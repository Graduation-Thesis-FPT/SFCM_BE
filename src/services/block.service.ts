import { BadRequestError } from '../core/error.response';
import { getInfoData } from '../utils';
import { ERROR_MESSAGE } from '../constants';
import { findWarehouseByCode } from '../repositories/warehouse.repo';
import { User } from '../entity/user.entity';
import { checkDuplicateBlock, createBlock } from '../repositories/block.repo';
import { Block } from '../entity/block.entity';

class BlockService {
  static createBlock = async (blockInfo: Block, createBy: User) => {
    const warehouse = await findWarehouseByCode(blockInfo.WAREHOUSE_CODE);
    if (!warehouse) {
      throw new BadRequestError(ERROR_MESSAGE.INVALID_WAREHOUSE_CODE);
    }

    const isDuplicateBlock = await checkDuplicateBlock(
      blockInfo.WAREHOUSE_CODE,
      blockInfo.BLOCK_NAME,
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
}
export default BlockService;
