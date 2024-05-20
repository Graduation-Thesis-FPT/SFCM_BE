import { Router } from 'express';
import { asyncHandler } from '../../utils';
import permissionController from '../../controllers/permission.controller';

const router = Router();

router.post('', asyncHandler(permissionController.grantPermission));
router.get('', asyncHandler(permissionController.getAllPermission))

export default router;
