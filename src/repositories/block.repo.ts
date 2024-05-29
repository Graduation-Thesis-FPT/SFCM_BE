import mssqlConnection from '../db/mssql.connect';
import { Block as BlockEntity } from '../entity/block.entity';
import { User } from '../entity/user.entity';

export const blockRepository = mssqlConnection.getRepository(BlockEntity);

const createBlock = async (blockInfo: BlockEntity, createBy: User) => {
  blockInfo.CREATE_BY = createBy.ROWGUID;
  blockInfo.UPDATE_BY = createBy.ROWGUID;
  blockInfo.UPDATE_DATE = new Date();

  const block = blockRepository.create(blockInfo);
  const newBlock = await blockRepository.save(block);
  return newBlock;
};

const checkDuplicateBlock = async (warehouseCode: string, blockName: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .andWhere('block.BLOCK_NAME = :blockName', { blockName: blockName })
    .getOne();
};

export { createBlock, checkDuplicateBlock };
