import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import vesselController from '../../controllers/vessel.controller';
import { validateVesselRequest } from '../../middlewares/helpers/vesselValidator';

const router = Router();

router.use(authentication);

router.post('', validateVesselRequest, asyncHandler(vesselController.createAndUpdateVessel));
router.delete('', asyncHandler(vesselController.deleteVessel));
router.get('', asyncHandler(vesselController.getVessel));

export default router;
