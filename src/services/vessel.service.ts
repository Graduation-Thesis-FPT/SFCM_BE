import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { Vessel, VesselList } from '../models/vessel.model';
import {
  createVessel,
  deleteVesselMany,
  findContainerByVoyageKey,
  findContainerByVoyageKeyy,
  findVessel,
  findVesselByCode,
  findVesselInBoundVoyage,
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
      if (insertData.length > 0) {
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

          const isDupicateInboundVoyage = await findVesselInBoundVoyage(
            vesselInfo.INBOUND_VOYAGE,
            transactionalEntityManager,
          );

          if (isDupicateInboundVoyage) {
            throw new BadRequestError(`Chuyến nhập ${vesselInfo.INBOUND_VOYAGE} đã bị trùng`);
          }

          processVesselInfo(vesselInfo);
        }
        newCreatedVessel = await createVessel(insertData, transactionalEntityManager);
      }

      if (updateData.length > 0) {
        for (const vesselInfo of updateData) {
          const vessel = await findVesselByCode(vesselInfo.VOYAGEKEY, transactionalEntityManager);
          if (!vessel) {
            throw new BadRequestError(`Mã tàu ${vesselInfo.VOYAGEKEY} không hợp lệ`);
          }

          const isValidUpdate = await findContainerByVoyageKey(
            vesselInfo.VOYAGEKEY,
            transactionalEntityManager,
          );

          if (isValidUpdate) {
            throw new BadRequestError(`không thể cập nhật tàu khi đã khai báo container`);
          }

          if (vesselInfo.CallSign === '') vesselInfo.CallSign = null;
          if (vesselInfo.IMO === '') vesselInfo.IMO = null;

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

  static deleteVessel = async (vesselCodeList: string[]) => {
    for (const vesselCode of vesselCodeList) {
      const vessel = await findVessel(vesselCode.trim());
      if (!vessel) {
        throw new BadRequestError(`Vessel with ID ${vesselCode} not exist!`);
      }

      const isValidUpdate = await findContainerByVoyageKeyy(vesselCode);
      console.log(isValidUpdate);
      if (isValidUpdate) {
        throw new BadRequestError(`không thể xóa tàu khi đã khai báo container`);
      }
    }

    return await deleteVesselMany(vesselCodeList);
  };

  static getAllVessel = async (rule: { fromDate: Date; toDate: Date }) => {
    return await getAllVessel(rule);
  };
}
export default VesselService;
