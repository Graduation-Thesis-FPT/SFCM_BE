import { Router } from 'express';
import accessRoute from './access/index';
import userRoute from './user/index';
import roleRoute from './role/index';
import permissionRoute from './permission/index';
import menuRouter from './menu/index';
import blockRouter from './block/index';
import warehouseRouter from './warehouse/index';
import gateRouter from './gate/index';
import equipRouter from './equip-type/index';

const routes = Router();

// Authentication & Authorization
routes.use('/api/v1/auth', accessRoute);
routes.use('/api/v1/user', userRoute);
routes.use('/api/v1/role', roleRoute);
routes.use('/api/v1/permission', permissionRoute);
routes.use('/api/v1/menu', menuRouter);

// Warehouse design
routes.use('/api/v1/block', blockRouter);
routes.use('/api/v1/warehouse', warehouseRouter);

// gate
routes.use('/api/v1/gate', gateRouter);

// equipment
routes.use('/api/v1/equip-type', equipRouter);

export default routes;
