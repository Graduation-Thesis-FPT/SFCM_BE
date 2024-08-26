import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  checkPalletJobTypeStatus,
  findPallet,
  getAllPalletPositionByWarehouseCode,
  getListJobExport,
  getListJobImport,
  updateExportPallet,
  updatePallet,
} from '../repositories/pallet.repo';
import {
  findCellById,
  findCellInWarehouse,
  updateNewCellStatus,
  updateOldCellStatus,
} from '../repositories/cell.repo';
import { PalletReq } from '../models/pallet.model';
import _ from 'lodash';
import {
  findPackageByPalletNo,
  updatePackageTimeIn,
  updatePackageTimeOut,
} from '../repositories/package.repo';
import { checkIsValidExportPallet } from '../repositories/delivery-order.repo';

class PalletService {
  static placePalletIntoCell = async (data: PalletReq, createBy: User) => {
    const cell = await findCellInWarehouse(data.CELL_ID, data.WAREHOUSE_CODE);

    if (!cell) {
      throw new BadRequestError(`ô không hợp lệ!`);
    }

    if (cell.STATUS === 1) {
      throw new BadRequestError(
        `Ô ${cell.BLOCK_CODE}-${cell.TIER_ORDERED}-${cell.SLOT_ORDERED} đã chứa pallet, xin vui lòng chọn ô khác!`,
      );
    }

    const pallet = await findPallet(data.PALLET_NO);
    if (!pallet) {
      throw new BadRequestError(`Mã pallet không hợp lệ`);
    }

    const { PALLET_HEIGHT, PALLET_WIDTH, PALLET_LENGTH } = pallet;
    const { CELL_HEIGHT, CELL_WIDTH, CELL_LENGTH } = cell;

    if (PALLET_HEIGHT > CELL_HEIGHT || PALLET_LENGTH > CELL_LENGTH || PALLET_WIDTH > CELL_WIDTH) {
      throw new BadRequestError(`Kích thước pallet không phù hợp`);
    }

    const packageInfo = await findPackageByPalletNo(data.PALLET_NO);
    if (!packageInfo) {
      throw new BadRequestError(`Kiện hàng không tồn tại, vui lòng kiểm tra lại!`);
    }

    if (!packageInfo.TIME_IN) {
      packageInfo.TIME_IN = new Date();
      await updatePackageTimeIn(packageInfo, createBy.ROWGUID);
    }

    return await Promise.all([
      updatePallet(data.CELL_ID, data.PALLET_NO, createBy),
      updateNewCellStatus(data.CELL_ID),
    ]);
  };

  static changePalletPosition = async (data: PalletReq, createBy: User) => {
    //1: tìm cell id của pallet muốn chuyển, set status = 0
    const pallet = await findPallet(data.PALLET_NO);

    if (!pallet) {
      throw new BadRequestError(`Mã Pallet không hợp lệ!`);
    }

    //2: tìm cell id của ô muốn chuyển đến, kiểm tra ô có chứa pallet không
    const cell = await findCellById(data.CELL_ID);

    if (!cell) {
      throw new BadRequestError(`Ô không không tồn tại trong kho!`);
    }

    if (cell.STATUS) {
      throw new BadRequestError(
        `Ô ${cell.BLOCK_CODE}-${cell.TIER_ORDERED}-${cell.SLOT_ORDERED} đã chứa pallet, xin vui lòng chọn ô khác!`,
      );
    }

    const { PALLET_HEIGHT, PALLET_WIDTH, PALLET_LENGTH } = pallet;
    const { CELL_HEIGHT, CELL_WIDTH, CELL_LENGTH } = cell;
    const cellVolumn = CELL_HEIGHT * CELL_WIDTH * CELL_LENGTH;
    const palletVolumn = PALLET_HEIGHT * PALLET_WIDTH * PALLET_LENGTH;

    if (palletVolumn > cellVolumn) {
      throw new BadRequestError(`Kích thước pallet không phù hợp`);
    }

    if (PALLET_HEIGHT > CELL_HEIGHT || PALLET_LENGTH > CELL_LENGTH || PALLET_WIDTH > CELL_WIDTH) {
      throw new BadRequestError(`Kích thước pallet không phù hợp`);
    }

    return await Promise.all([
      updatePallet(data.CELL_ID, data.PALLET_NO, createBy),
      updateNewCellStatus(data.CELL_ID),
      updateOldCellStatus(pallet.CELL_ID),
    ]);
  };

  static getPalletPosition = async (warehouseCode: string) => {
    const pallet = await getAllPalletPositionByWarehouseCode(warehouseCode);
    const groupPalletByBlock = _.groupBy(pallet, 'BLOCK_CODE');
    return groupPalletByBlock;
  };

  static getListJobImport = async (palletStatus: string) => {
    return await getListJobImport(palletStatus);
  };

  static getListJobExport = async () => {
    return await getListJobExport();
  };

  static exportPallet = async (data: PalletReq, createBy: User) => {
    const pallet = await findPallet(data.PALLET_NO);

    const isValidExport = await checkIsValidExportPallet(data.PALLET_NO);
    if (isValidExport) {
      throw new BadRequestError(`Lệnh xuất kho đã được hủy, không thể xuất pallet!`);
    }

    if (!pallet) {
      throw new BadRequestError(`Mã Pallet không hợp lệ!`);
    }

    const jobType = await checkPalletJobTypeStatus(data.PALLET_NO);

    if (jobType.JOB_TYPE !== 'XK') {
      throw new BadRequestError(`Pallet chưa được làm lệnh xuất!`);
    }

    const packageInfo = await findPackageByPalletNo(data.PALLET_NO);
    if (!packageInfo) {
      throw new BadRequestError(`Kiện hàng không tồn tại, vui lòng kiểm tra lại!`);
    }

    packageInfo.TIME_OUT = new Date();
    await updatePackageTimeOut(packageInfo, createBy.ROWGUID);

    return await Promise.all([
      updateExportPallet(null, data.PALLET_NO, createBy),
      updateOldCellStatus(pallet.CELL_ID),
    ]);
  };

  static testValidPallet = async (palletNO: string) => {
    return await checkIsValidExportPallet(palletNO);
  };
}
export default PalletService;
