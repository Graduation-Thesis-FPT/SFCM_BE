import { Router } from 'express';
import accessRoute from './access/index';
import userRoute from './user/index';
import roleRoute from './role/index';
import permissionRoute from './permission/index';
import menuRouter from './menu/index';
// import cellRouter from './cell/index';
import warehouseRouter from './warehouse/index';
import gateRouter from './gate/index';
import equipmentTypeRouter from './equipment-type/index';
import equipmentRouter from './equipment/index';
import methodRouter from './method/index';
import blockRouter from './block/index'

const routes = Router();

// Authentication & Authorization
routes.use('/api/v1/auth', accessRoute);
routes.use('/api/v1/user', userRoute);
routes.use('/api/v1/role', roleRoute);
routes.use('/api/v1/permission', permissionRoute);
routes.use('/api/v1/menu', menuRouter);

// Warehouse design
// routes.use('/api/v1/block', cellRouter);
routes.use('/api/v1/warehouse', warehouseRouter);

// gate
routes.use('/api/v1/gate', gateRouter);

// equipment
routes.use('/api/v1/equipment-type', equipmentTypeRouter);
routes.use('/api/v1/equipment', equipmentRouter);

// method
routes.use('/api/v1/method', methodRouter);

//block
routes.use('/api/v1/block', blockRouter)
export default routes;
