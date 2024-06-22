import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import tariffCodeController from '../../controllers/tariff-code.controller';
import { validateTariffCodeRequest } from '../../middlewares/helpers/tariffCodeValidator';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);
router.get('', asyncHandler(grantPermission), asyncHandler(tariffCodeController.getTariffCode));
router.post(
  '',
  asyncHandler(grantPermission),
  validateTariffCodeRequest,
  asyncHandler(tariffCodeController.createTariffCode),
);
router.delete(
  '',
  asyncHandler(grantPermission),
  asyncHandler(tariffCodeController.deleteTariffCode),
);

export default router;
