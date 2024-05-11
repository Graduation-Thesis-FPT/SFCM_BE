import { Router } from 'express';
import userController from '../../controllers/user.controller';
import { asyncHandler } from '../../utils';

const router = Router();

router.get('/:id', asyncHandler(userController.findUserById));
router.get('', asyncHandler(userController.getAllUser));
router.post('', asyncHandler(userController.createUserAccount));
router.delete('/:id', asyncHandler(userController.deleteUserById));
router.patch('/de-active/:id', asyncHandler(userController.deactivateUser));
router.patch("/:userId", asyncHandler(userController.updateUser))

export default router;
