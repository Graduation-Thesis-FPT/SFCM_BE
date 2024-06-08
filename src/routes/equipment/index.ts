import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
// import { validateEquipTypeRequest } from '../../helpers/equipmentValidator';
import equipmentController from '../../controllers/equipment.controller';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  // validateEquipTypeRequest,
  asyncHandler(equipmentController.createAndUpdateEquipment),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(equipmentController.deleteEquipment));
router.get('', asyncHandler(grantPermission), asyncHandler(equipmentController.getAllEquipment));

export default router;
