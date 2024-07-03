import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { PackageUnitInfo } from '../models/package-unit.model';
import {
  createPackageUnit,
  deletePackageUnit,
  findPackageUnitByCode,
  getPackageUnit,
  updatePackageUnit,
} from '../repositories/package-unit.repo';

class PackageUnitService {
  static createAndUpdatePackageUnit = async (
    PackageUnitListInfo: PackageUnitInfo,
    createBy: User,
  ) => {
    let insertData = PackageUnitListInfo.insert;
    let updateData = PackageUnitListInfo.update;

    let createdPackageUnit;
    let updatedPackageUnit;
    if (insertData.length) {
      for (const data of insertData) {
        const checkExist = await findPackageUnitByCode(data.PACKAGE_UNIT_CODE);

        if (checkExist) {
          throw new BadRequestError(`${data.PACKAGE_UNIT_CODE} đã tồn tại!`);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        data.CREATE_DATE = new Date();
      }
    }
    createdPackageUnit = await createPackageUnit(insertData);

    if (updateData.length) {
      for (const data of updateData) {
        const checkExist = await findPackageUnitByCode(data.PACKAGE_UNIT_CODE);

        if (!checkExist) {
          throw new BadRequestError(`${data.PACKAGE_UNIT_CODE} không tồn tại!`);
        }
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
      }
      updatedPackageUnit = await updatePackageUnit(updateData);
    }
    return {
      createdPackageUnit,
      updatedPackageUnit,
    };
  };

  static deletePackageUnit = async (PackageUnitCodeList: string[]) => {
    for (const PackageUnitCode of PackageUnitCodeList) {
      const PackageUnit = await findPackageUnitByCode(PackageUnitCode);
      if (!PackageUnit) {
        throw new BadRequestError(`${PackageUnitCode} không tồn tại!`);
      }
    }

    return await deletePackageUnit(PackageUnitCodeList);
  };

  static getAllPackageUnit = async () => {
    return await getPackageUnit();
  };
}
export default PackageUnitService;
