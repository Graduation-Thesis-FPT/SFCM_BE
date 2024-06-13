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

class VesselService {
  static createAndUpdateVessel = async (vesselInfo: VesselList, createBy: User) => {
    const insertData = vesselInfo.insert;
    const updateData = vesselInfo.update;

    let newCreatedVessel: Vessel[] = [];
    let newUpdatedVessel;
    await manager.transaction(async transactionalEntityManager => {
      if (insertData) {
        for (const vesselInfo of insertData) {
          const vessel = await findVesselByCode(vesselInfo.VOYAGEKEY, transactionalEntityManager);
          if (vessel) {
            throw new BadRequestError(`Mã tàu ${vessel.VOYAGEKEY} đã tồn tại`);
          }

          vesselInfo.CREATE_BY = createBy.ROWGUID;
          vesselInfo.UPDATE_BY = createBy.ROWGUID;
          vesselInfo.UPDATE_DATE = new Date();
        }

        newCreatedVessel = await createVessel(insertData, transactionalEntityManager);
      }

      if (updateData) {
        for (const vesselInfo of updateData) {
          const vessel = await findVesselByCode(vesselInfo.VOYAGEKEY, transactionalEntityManager);
          if (!vessel) {
            throw new BadRequestError(`Mã tàu ${vesselInfo.VOYAGEKEY} không hợp lệ`);
          }

          vesselInfo.CREATE_BY = createBy.ROWGUID;
          vesselInfo.UPDATE_BY = createBy.ROWGUID;
          vesselInfo.UPDATE_DATE = new Date();
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

  static getAllVessel = async () => {
    return await getAllVessel();
  };
}
export default VesselService;
