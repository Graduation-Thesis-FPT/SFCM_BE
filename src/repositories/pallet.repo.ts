import mssqlConnection from '../db/mssql.connect';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { User } from '../entity/user.entity';
import { Cell as CellEntity } from '../entity/cell.entity';

const palletRepository = mssqlConnection.getRepository(PalletStockEntity);
const cellRepository = mssqlConnection.getRepository(CellEntity);

const updatePallet = async (cellId: string, PalletNo: string, createBy: User) => {
  return await palletRepository
    .createQueryBuilder('pallet')
    .update(PalletStockEntity)
    .set({
      CELL_ID: cellId,
      UPDATE_BY: createBy.ROWGUID,
    })
    .where('PALLET_NO = :PalletNo', { PalletNo })
    .execute();
};

const findPallet = async (PalletNo: string) => {
  return await palletRepository.findOne({
    where: {
      PALLET_NO: PalletNo,
    },
  });
};

const getAllPalletPositionByWarehouseCode = async (warehouseCode: string) => {
  return await cellRepository
    .createQueryBuilder('cell')
    .innerJoinAndSelect('BS_BLOCK', 'block', 'block.BLOCK_CODE = cell.BLOCK_CODE')
    .leftJoinAndSelect('DT_PALLET_STOCK', 'pallet', 'pallet.CELL_ID = cell.ROWGUID')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .select([
      'pallet.CELL_ID as CELL_ID',
      'pallet.PALLET_STATUS as PALLET_STATUS',
      'cell.BLOCK_CODE as BLOCK_CODE',
      'cell.TIER_ORDERED as TIER_ORDERED',
      'cell.SLOT_ORDERED as SLOT_ORDERED',
      'cell.STATUS as STATUS',
      'block.WAREHOUSE_CODE as WAREHOUSE_CODE',
      'block.BLOCK_NAME as BLOCK_NAME',
    ])
    .getRawMany();
};

const getPalletByStatus = async () => {
  return await palletRepository.find({
    where: {
      PALLET_STATUS: 'incoming',
    },
  });
};

export { updatePallet, findPallet, getAllPalletPositionByWarehouseCode, getPalletByStatus };
