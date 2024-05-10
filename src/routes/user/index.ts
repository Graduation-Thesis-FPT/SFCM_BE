import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import userController from '../../controllers/user.controller';

const router = Router();

router.post('', asyncHandler(userController.createUserAccount));

export default router;
