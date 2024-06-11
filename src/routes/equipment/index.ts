import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import equipmentController from '../../controllers/equipment.controller';
import { validateEquipmentRequest } from '../../helpers/equipmentValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateEquipmentRequest,
  asyncHandler(equipmentController.createAndUpdateEquipment),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(equipmentController.deleteEquipment));
router.get('', asyncHandler(grantPermission), asyncHandler(equipmentController.getAllEquipment));

export default router;
