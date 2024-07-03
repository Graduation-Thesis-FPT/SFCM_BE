import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import discountTariffController from '../../controllers/discount-tariff.controller';
import { validateDiscountTariffRequest } from '../../middlewares/helpers/discountTariffValidator';

const router = Router();

router.use(authentication);
router.get(
  '',
  asyncHandler(grantPermission),
  asyncHandler(discountTariffController.getDiscountTariff),
);
// router.get(
//   '/template',
//   asyncHandler(grantPermission),
//   asyncHandler(discountTariffController.getAllTariffTemplate),
// );

router.get(
  '/filter',
  asyncHandler(grantPermission),
  asyncHandler(discountTariffController.getDiscountTariffByTemplate),
);
router.post(
  '',
  asyncHandler(grantPermission),
  validateDiscountTariffRequest,
  asyncHandler(discountTariffController.createAndUpdateDiscountTariff),
);
router.delete(
  '',
  asyncHandler(grantPermission),
  asyncHandler(discountTariffController.deleteDiscountTariff),
);

export default router;
