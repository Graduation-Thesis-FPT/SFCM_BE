import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import userController from '../../controllers/user.controller';

const router = Router();

router.post('', asyncHandler(userController.createUserAccount));
router.get('/:id', asyncHandler(userController.findUserById));
router.delete('/:id', asyncHandler(userController.deleteUserById));
router.patch('/:id', asyncHandler(userController.updateUserStatus));
router.get('', asyncHandler(userController.getAllUser));

export default router;
