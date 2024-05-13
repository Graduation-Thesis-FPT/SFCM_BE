import { Router } from 'express';
import accessRoute from './access/index';
import userRoute from './user/index';
import roleRoute from './role/index';

const routes = Router();

routes.use('/api/v1/auth', accessRoute);
routes.use('/api/v1/user', userRoute);
routes.use('/api/v1/role', roleRoute);

export default routes;
