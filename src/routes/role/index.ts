import { Router } from 'express';
import { asyncHandler } from '../../utils';
import roleController from '../../controllers/role.controller';

const router = Router();

router.get('', asyncHandler(roleController.getAllRole));

export default router;
