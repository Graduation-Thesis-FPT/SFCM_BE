import { Router } from 'express';
import accessController from '../../controllers/access.controller';
import { asyncHandler } from '../../utils';

const router = Router();

router.post('/login', asyncHandler(accessController.login));
router.post('/refresh-token', asyncHandler(accessController.refreshToken));
router.patch(
  '/change-default-password/:userId',
  asyncHandler(accessController.changeDefaultPassword),
);

export default router;
