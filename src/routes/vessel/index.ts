import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import vesselController from '../../controllers/vessel.controller';
import { validateVesselRequest } from '../../middlewares/helpers/vesselValidator';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateVesselRequest,
  asyncHandler(vesselController.createAndUpdateVessel),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(vesselController.deleteVessel));
router.get('', asyncHandler(grantPermission), asyncHandler(vesselController.getVessel));

export default router;
