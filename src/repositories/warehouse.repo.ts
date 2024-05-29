import mssqlConnection from '../db/mssql.connect';
import { WareHouse as WarehouseEntity } from '../entity/warehouse.entity';

export const warehouseRepository = mssqlConnection.getRepository(WarehouseEntity);

const findWarehouseByCode = async (warehouseCode: string) => {
  return await warehouseRepository
    .createQueryBuilder('warehouse')
    .where('warehouse.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .getOne();
};

export { findWarehouseByCode };
