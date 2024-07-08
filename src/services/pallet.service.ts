import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  findPallet,
  getAllPalletPositionByWarehouseCode,
  getPalletByStatus,
  updatePallet,
} from '../repositories/pallet.repo';
import {
  findCell,
  findCellById,
  updateNewCellStatus,
  updateOldCellStatus,
} from '../repositories/cell.repo';
import { PalletReq } from '../models/pallet.model';
import _ from 'lodash';

class PalletService {
  static updatePallet = async (data: PalletReq, createBy: User) => {
    const cell = await findCell(data.CELL_ID, data.WAREHOUSE_CODE);

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
      throw new BadRequestError('Mã pallet không hợp lệ');
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

    if (cell.STATUS === 1) {
      throw new BadRequestError(
        `Ô ${cell.BLOCK_CODE}-${cell.TIER_ORDERED}-${cell.SLOT_ORDERED} đã chứa pallet, xin vui lòng chọn ô khác!`,
      );
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

  static getPalletByStatus = async (palletStatus: string) => {
    return await getPalletByStatus(palletStatus);
  };
}
export default PalletService;
