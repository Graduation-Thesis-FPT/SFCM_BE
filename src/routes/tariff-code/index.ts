import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import tariffController from '../../controllers/tariff.controller';
import { validateTariffCodeRequest } from '../../middlewares/helpers/tariffCodeValidator';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);
router.get('', asyncHandler(grantPermission), asyncHandler(tariffController.getTariffCode));
router.post(
  '',
  asyncHandler(grantPermission),
  validateTariffCodeRequest,
  asyncHandler(tariffController.createTariffCode),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(tariffController.deleteTariffCode));

export default router;
