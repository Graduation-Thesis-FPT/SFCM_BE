import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import tariffController from '../../controllers/tariff.controller';
import { grantPermission } from '../../middlewares';
import { validateTariffRequest } from '../../middlewares/helpers/tariffValidator';

const router = Router();

router.use(authentication);
router.get('', asyncHandler(tariffController.getTariff));

router.get('/filter', asyncHandler(tariffController.getTariffByTemplate));
router.patch(
  '',
  asyncHandler(grantPermission),
  validateTariffRequest,
  asyncHandler(tariffController.createAndUpdateTariff),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(tariffController.deleteTariff));

export default router;
