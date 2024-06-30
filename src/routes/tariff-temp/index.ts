import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import tariffTempCodeController from '../../controllers/tariff-temp.controller.';
import { grantPermission } from '../../middlewares';
import { validateTariffTempRequest } from '../../middlewares/helpers/tariffTempValidator';

const router = Router();

router.use(authentication);
router.get(
  '',
  asyncHandler(grantPermission),
  asyncHandler(tariffTempCodeController.getAllTariffTemplate),
);
router.post(
  '',
  asyncHandler(grantPermission),
  validateTariffTempRequest,
  asyncHandler(tariffTempCodeController.createTariffTemp),
);
router.delete(
  '',
  asyncHandler(grantPermission),
  asyncHandler(tariffTempCodeController.deleteTariffTemp),
);

export default router;
