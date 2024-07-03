import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { Vessel, VesselList } from '../models/vessel.model';
import {
  createVessel,
  deleteVesselMany,
  findVessel,
  findVesselByCode,
  getAllVessel,
  updateVessel,
} from '../repositories/vessel.repo';
import { generateKeyVessel } from '../utils';

class VesselService {
  static createAndUpdateVessel = async (vesselInfo: VesselList, createBy: User) => {
    const insertData = vesselInfo.insert;
    const updateData = vesselInfo.update;

    let newCreatedVessel: Vessel[] = [];
    let newUpdatedVessel;

    const processVesselInfo = (vesselInfo: Vessel) => {
      if (vesselInfo.CallSign === '') vesselInfo.CallSign = null;
      if (vesselInfo.IMO === '') vesselInfo.IMO = null;

      vesselInfo.CREATE_BY = createBy.ROWGUID;
      vesselInfo.UPDATE_BY = createBy.ROWGUID;
      vesselInfo.UPDATE_DATE = new Date();
    };

    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const vesselInfo of insertData) {
          vesselInfo.VOYAGEKEY = generateKeyVessel(
            vesselInfo.VESSEL_NAME,
            vesselInfo.INBOUND_VOYAGE,
            vesselInfo.ETA,
          );
          const vessel = await findVesselByCode(vesselInfo.VOYAGEKEY, transactionalEntityManager);
          if (vessel) {
            throw new BadRequestError(`Mã tàu ${vessel.VOYAGEKEY} đã tồn tại`);
          }

          processVesselInfo(vesselInfo);
        }
        newCreatedVessel = await createVessel(insertData, transactionalEntityManager);
      }

      if (updateData) {
        for (const vesselInfo of updateData) {
          const vessel = await findVesselByCode(vesselInfo.VOYAGEKEY, transactionalEntityManager);
          if (!vessel) {
            throw new BadRequestError(`Mã tàu ${vesselInfo.VOYAGEKEY} không hợp lệ`);
          }

          processVesselInfo(vesselInfo);
        }

        newUpdatedVessel = await updateVessel(updateData, transactionalEntityManager);
      }
    });

    return {
      newCreatedVessel,
      newUpdatedVessel,
    };
  };

  static deleteVessel = async (customerCodeList: string[]) => {
    for (const customerCode of customerCodeList) {
      const customer = await findVessel(customerCode.trim());
      if (!customer) {
        throw new BadRequestError(`EquipType with ID ${customerCode} not exist!`);
      }
    }

    return await deleteVesselMany(customerCodeList);
  };

  static getAllVessel = async (rule: { fromDate: Date; toDate: Date }) => {
    return await getAllVessel(rule);
  };
}
export default VesselService;
