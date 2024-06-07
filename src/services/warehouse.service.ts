import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { findWarehouseByCode, getAllWarehouse, deleteWarehose, createWarehouse, updateWareHouse } from '../repositories/warehouse.repo';
import { WareHouse, WareHouseInfo } from '../models/warehouse.model';

class WarehouseService {
    static createAndUpdateWarehouse = async (warehouseListInfo: WareHouseInfo, createBy: User) => {
        let insertData = warehouseListInfo.insert;
        let updateData = warehouseListInfo.update;

        let createdWarehouse;
        let updatedWarehouse;
        if (insertData.length) {
            for (const data of insertData) {
                const checkExist = await findWarehouseByCode(data.WAREHOUSE_CODE);

                if (checkExist) {
                    throw new BadRequestError(ERROR_MESSAGE.WAREHOUSE_EXIST);
                }
                data.CREATE_BY = createBy.ROWGUID;
                data.UPDATE_BY = createBy.ROWGUID;
                data.UPDATE_DATE = new Date();
                data.CREATE_DATE = new Date();
                data.STATUS = false;
            }
        }
        createdWarehouse = await createWarehouse(insertData);

        if (updateData.length) {
            for (const data of updateData) {
                const checkExist = await findWarehouseByCode(data.WAREHOUSE_CODE);

                if (!checkExist) {
                    throw new BadRequestError(ERROR_MESSAGE.WAREHOUSE_NOT_EXIST);
                }
                if (data.STATUS) {
                    throw new BadRequestError(
                        `Không thể cập nhật kho ${data.WAREHOUSE_CODE} vì đang hoạt động`,
                    );
                }
                data.CREATE_BY = createBy.ROWGUID;
                data.UPDATE_BY = createBy.ROWGUID;
                data.UPDATE_DATE = new Date();
                data.CREATE_DATE = new Date();
                data.STATUS = false;
            }
            updatedWarehouse = await updateWareHouse(updateData);
        }
        return {
            createdWarehouse,
            updatedWarehouse
        }
    }

    static deleteWarehouse = async (warehouseCodeList: string[]) => {
        for (const warehouseCode of warehouseCodeList) {

            const warehouse = await findWarehouseByCode(warehouseCode);
            if (!warehouse) {
                throw new BadRequestError(`Warehouse with ID ${warehouse.WAREHOUSE_CODE} not exist!`);
            }

            if (warehouse.STATUS) {
                throw new BadRequestError(
                    `Không thể xóa kho ${warehouse.WAREHOUSE_NAME} : tồn tại hàng hóa!`,
                );
            }
        }

        return await deleteWarehose(warehouseCodeList);
    }

    static getAllWarehouse = async () => {
        return await getAllWarehouse();
    };
}
export default WarehouseService;

