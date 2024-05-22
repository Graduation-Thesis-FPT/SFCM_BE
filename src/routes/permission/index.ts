import { Router } from 'express';
import { asyncHandler } from '../../utils';
import permissionController from '../../controllers/permission.controller';
import { authentication } from '../../auth/authUtils';

const router = Router();

router.use(authentication);

router.patch('', asyncHandler(permissionController.updatePermission));
router.get('', asyncHandler(permissionController.getAllPermission));

export default router;
