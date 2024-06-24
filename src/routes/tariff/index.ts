import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import tariffController from '../../controllers/tariff.controller';
import { grantPermission } from '../../middlewares';
import { validateTariffRequest } from '../../middlewares/helpers/tariffValidator';

const router = Router();

router.use(authentication);
router.get('', asyncHandler(grantPermission), asyncHandler(tariffController.getTariff));
router.get(
  '/template',
  asyncHandler(grantPermission),
  asyncHandler(tariffController.getAllTariffTemplate),
);

router.get(
  '/filter',
  asyncHandler(grantPermission),
  asyncHandler(tariffController.getTariffByTemplate),
);
router.patch(
  '',
  asyncHandler(grantPermission),
  validateTariffRequest,
  asyncHandler(tariffController.createAndUpdateTariff),
);
router.post('', validateTariffRequest, asyncHandler(tariffController.createTariff));
router.delete('', asyncHandler(grantPermission), asyncHandler(tariffController.deleteTariff));

export default router;
