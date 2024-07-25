import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import palletController from '../../controllers/pallet.controller';
import { grantPermission } from '../../middlewares';
import { validateTariffRequest } from '../../middlewares/helpers/tariffValidator';

const router = Router();

router.use(authentication);
router.get(
  '/list-import-job',
  asyncHandler(grantPermission),
  asyncHandler(palletController.getListJobImport),
);

router.get(
  '/cell-position',
  asyncHandler(grantPermission),
  asyncHandler(palletController.getAllPalletPosition),
);

router.patch(
  '',
  asyncHandler(grantPermission),
  validateTariffRequest,
  asyncHandler(palletController.placePalletIntoCell),
);

router.patch(
  '/change-position',
  asyncHandler(grantPermission),
  validateTariffRequest,
  asyncHandler(palletController.changePalletPosition),
);

router.get(
  '/list-export-job',
  asyncHandler(grantPermission),
  asyncHandler(palletController.getListJobExport),
);

router.patch('/export', asyncHandler(grantPermission), asyncHandler(palletController.exportPallet));

export default router;
