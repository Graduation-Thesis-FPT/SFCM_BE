import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import equipTypeController from '../../controllers/equip-type.controller';
import { validateEquipTypeRequest } from '../../helpers/equipmentValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateEquipTypeRequest,
  asyncHandler(equipTypeController.createAndUpdateEquipType),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(equipTypeController.deleteEquipType));
router.get('', asyncHandler(grantPermission), asyncHandler(equipTypeController.getAllEquipType));

export default router;
