import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { WareHouse as WarehouseEntity } from '../entity/warehouse.entity';
import { WareHouse } from '../models/warehouse.model';

export const warehouseRepository = mssqlConnection.getRepository(WarehouseEntity);

const findWarehouseByCode = async (
  warehouseCode: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(WarehouseEntity, 'warehouse')
    .where('warehouse.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .getOne();
};

const findWarehouse = async (warehouseCode: string) => {
  return await warehouseRepository
    .createQueryBuilder('warehouse')
    .where('warehouse.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .getOne();
};

const getAllWarehouse = async () => {
  return await warehouseRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const deleteWarehose = async (warehouseListId: string[]) => {
  return await warehouseRepository.delete(warehouseListId);
};

const createWarehouse = async (warehouseList: WareHouse[]) => {
  const newWarehouse = await warehouseRepository.save(warehouseList);
  return newWarehouse;
};

const updateWareHouse = async (warehouseList: WareHouse[]) => {
  for await (const data of warehouseList) {
    await warehouseRepository.update({ WAREHOUSE_CODE: data.WAREHOUSE_CODE }, data);
  }
  return true;
};

export {
  findWarehouseByCode,
  getAllWarehouse,
  deleteWarehose,
  createWarehouse,
  updateWareHouse,
  findWarehouse,
};
