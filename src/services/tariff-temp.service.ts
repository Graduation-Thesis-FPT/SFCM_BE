import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import moment from 'moment';
import { TariffTempList } from '../models/tariff-temp.model';
import {
  createTariffTemp,
  deleteTariffTemp,
  getAllTariffTemp,
} from '../repositories/tariff-temp.repo';

class TariffTempService {
  static createTariffTemplate = async (tariffTemp: TariffTempList, createBy: User) => {
    const insertData = tariffTemp.insert;

    if (insertData) {
      for (const data of insertData) {
        const from = data.FROM_DATE ? new Date(data.FROM_DATE) : null;
        const to = data.TO_DATE ? new Date(data.TO_DATE) : null;
        if (from > to) {
          throw new BadRequestError(`Ngày hiệu lực biểu cước phải nhỏ hơn ngày hết hạn`);
        }

        const fromDate = moment(new Date(data.FROM_DATE)).format('DD/MM/YYYY');
        const toDate = moment(new Date(data.TO_DATE)).format('DD/MM/YYYY');

        data.TRF_TEMP_CODE = fromDate + '-' + toDate + '-' + data.TRF_TEMP_NAME;

        const tariffTemplate = await getAllTariffTemp();
        if (tariffTemplate) {
          for (const { FROM_DATE, TO_DATE } of tariffTemplate) {
            if (from >= FROM_DATE && from <= TO_DATE) {
              throw new BadRequestError(
                `Ngày ${fromDate} không hợp lệ đã tồn tại mẫu biểu cước có thời hạn từ ${moment(FROM_DATE).format('DD/MM/YYYY')} đến ${moment(TO_DATE).format('DD/MM/YYYY')}`,
              );
            }

            if (to >= FROM_DATE && to <= TO_DATE) {
              throw new BadRequestError(
                `Ngày ${toDate} không hợp lệ đã tồn tại mẫu biểu cước có thời hạn từ ${moment(FROM_DATE).format('DD/MM/YYYY')} đến ${moment(TO_DATE).format('DD/MM/YYYY')}`,
              );
            }
          }
        }

        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        data.CREATE_DATE = new Date();
      }
    }
    return await createTariffTemp(insertData);
  };

  static deleteTariffTemp = async (tariffRowIdList: string[]) => {
    return await deleteTariffTemp(tariffRowIdList);
  };

  static getTariffTemplate = async () => {
    return await getAllTariffTemp();
  };
}
export default TariffTempService;
