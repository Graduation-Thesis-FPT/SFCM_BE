import { Router } from 'express';
import userController from '../../controllers/user.controller';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';

const router = Router();

router.use(authentication);

router.get('/:id', asyncHandler(userController.findUserById));
router.get('', asyncHandler(userController.getAllUser));
router.post('', asyncHandler(userController.createUserAccount));
router.delete('/:id', asyncHandler(userController.deleteUserById));
router.patch('/deactive/:id', asyncHandler(userController.deactivateUser));
router.patch('/active/:id', asyncHandler(userController.activateUser));
router.patch('/:userId', asyncHandler(userController.updateUser));
router.patch('/reset-password/:userId', asyncHandler(userController.resetPasswordById));

export default router;
