import { BadRequestError } from '../core/error.response';
import { Cell } from '../models/cell.model';
import { Pallet } from '../models/pallet.model';
import { findCellByWarehouseCode } from '../repositories/cell.repo';
import { findWarehouse } from '../repositories/warehouse.repo';
import _ from 'lodash';

class CellService {
  static suggestCell = async (palletInfo: Pallet, warehouseCode: string) => {
    const warehouse = await findWarehouse(warehouseCode);
    if (!warehouse) {
      throw new BadRequestError(`Nhà kho ${warehouseCode} không tồn tại`);
    }
    if (!palletInfo.PALLET_HEIGHT || !palletInfo.PALLET_LENGTH || !palletInfo.PALLET_WIDTH) {
      throw new BadRequestError('Pallet phải có đủ chiều dài, rộng, cao');
    }

    const cell = await findCellByWarehouseCode(warehouseCode);

    if (!cell.length) {
      throw new BadRequestError(`Không tìm thấy cell trong kho ${warehouseCode}`);
    }

    const groupCellByBlock = _.groupBy(cell, 'BLOCK_CODE');

    const newListCell = [];
    for (const block in groupCellByBlock) {
      newListCell.push(groupCellByBlock[block][0]);
    }

    const cellVolume = newListCell.map(item => {
      return {
        ...item,
        VOLUME: item.CELL_LENGTH * item.CELL_WIDTH * item.CELL_HEIGHT,
      };
    });

    const palletVolum =
      palletInfo.PALLET_LENGTH * palletInfo.PALLET_WIDTH * palletInfo.PALLET_HEIGHT;

    const cellVolumeFilter: Cell[] = cellVolume
      .filter(cell => cell.VOLUME >= palletVolum)
      .sort((a, b) => a.VOLUME - b.VOLUME);

    const match = cellVolumeFilter.length > 0 ? cellVolumeFilter[0] : null;
    console.log(match);
    if (
      palletInfo.PALLET_HEIGHT > match.CELL_HEIGHT ||
      palletInfo.PALLET_LENGTH > match.CELL_LENGTH ||
      palletInfo.PALLET_WIDTH > match.CELL_WIDTH
    ) {
      throw new BadRequestError('Kích thước pallet không phù hợp');
    }

    if (!match) {
      throw new BadRequestError('Không tìm thấy cell phù hợp');
    }

    return { matchedCell: match, listCellSuggested: cellVolume };
  };
}
export default CellService;
