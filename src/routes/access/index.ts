import { Router } from 'express';
import accessController from '../../controllers/access.controller';
import { asyncHandler } from '../../utils';

const router = Router();

router.post('/login', asyncHandler(accessController.login));



export default router;
