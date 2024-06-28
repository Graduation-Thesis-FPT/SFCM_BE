import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { Order } from '../models/order.model';
import {
  createfakeOrderData,
  findOrder,
  findMaxOrderNo,
  findMaxDraftNo,
  getContList,
  checkContStatus,
  getManifestPackage,
} from '../repositories/order.repo';

class OrderService {
  static getContList = async (VOYAGEKEY: string, BILLOFLADING: string) => {
    if (!VOYAGEKEY || !BILLOFLADING) {
      throw new BadRequestError(`Mã tàu ${VOYAGEKEY} hoặc số vận đơn không được rỗng!`);
    }
    return getContList(VOYAGEKEY, BILLOFLADING);
  };

  static getManifestPackage = async (VOYAGEKEY: string, CNTRNO: string) => {
    if (!VOYAGEKEY || !CNTRNO) {
      throw new BadRequestError(`Mã tàu hoặc số Container không được rỗng!`);
    }
    const checkStatus = checkContStatus(VOYAGEKEY, CNTRNO);
    if (!checkStatus) {
      throw new BadRequestError(`Số cont ${CNTRNO} đã làm lệnh!`);
    }

    return getManifestPackage(VOYAGEKEY, CNTRNO);
  };
}
export default OrderService;
