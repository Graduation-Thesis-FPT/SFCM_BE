import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import palletController from '../../controllers/pallet.controller';
import { grantPermission } from '../../middlewares';
import { validateTariffRequest } from '../../middlewares/helpers/tariffValidator';

const router = Router();

router.use(authentication);
router.get('', asyncHandler(grantPermission), asyncHandler(palletController.getPalletByStatus));

router.get(
  '/cell-position',
  asyncHandler(grantPermission),
  asyncHandler(palletController.getAllPalletPosition),
);

router.patch(
  '',
  asyncHandler(grantPermission),
  validateTariffRequest,
  asyncHandler(palletController.updatePallet),
);

router.patch(
  '/change-position',
  asyncHandler(grantPermission),
  validateTariffRequest,
  asyncHandler(palletController.changePalletPosition),
);

export default router;
