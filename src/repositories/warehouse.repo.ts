import mssqlConnection from '../db/mssql.connect';
import { WareHouse as WarehouseEntity } from '../entity/warehouse.entity';
import { isValidInfor } from '../utils';

export const warehouseRepository = mssqlConnection.getRepository(WarehouseEntity);

const findWarehouseByCode = async (warehouseCode: string) => {
  return await warehouseRepository
    .createQueryBuilder('warehouse')
    .where('warehouse.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .getOne();
};

const getAllWarehouse = async () => {
  return await warehouseRepository.find({
    order: {
      UPDATE_DATE: 'DESC'
    }
  })
}

const deleteWarehose = async (warehouseListId: string[]) => {
  return await warehouseRepository.delete(warehouseListId)
}

const createWarehouse = async (warehouseList: WarehouseEntity[]) => {
  const warehouse = warehouseRepository.create(warehouseList);
  await isValidInfor(warehouse);

  const newWarehouse = warehouseRepository.save(warehouseList);
  return newWarehouse;
}

const updateWareHouse = async (warehouseList: WarehouseEntity[]) => {
  const warehouse = warehouseRepository.create(warehouseList);
  await isValidInfor(warehouse);

  for await (const warehouse of warehouseList) {
    await warehouseRepository.update({ WAREHOUSE_CODE: warehouse.WAREHOUSE_CODE }, warehouse)
  }
  return warehouseList;
}


export { findWarehouseByCode, getAllWarehouse, deleteWarehose, createWarehouse, updateWareHouse };
