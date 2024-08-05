import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { getReportRevenue, whereRevenue } from '../repositories/inv-vat.repo';

class InvVatService {
  static getReportRevenue = async (whereObj: whereRevenue) => {
    if (!whereObj.fromDate || !whereObj.toDate) {
      throw new BadRequestError(`Vui lòng chọn từ ngày đến ngày!`);
    }
    return await getReportRevenue(whereObj);
  };
}
export default InvVatService;
