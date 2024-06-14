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
import blockRouter from './block/index';
import itemTypeRouter from './item-type/index';
import unitRouter from './unit/index';
import customerTypeRouter from './customer-type/index';
import customerRouter from './customer/index';
import vesselRouter from './vessel/index';
import containerRouter from './container/index';

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
routes.use('/api/v1/block', blockRouter);

//item-type
routes.use('/api/v1/item-type', itemTypeRouter);

//unit
routes.use('/api/v1/unit', unitRouter);

// customer
routes.use('/api/v1/customer-type', customerTypeRouter);
routes.use('/api/v1/customer', customerRouter);

// vessel
routes.use('/api/v1/vessel', vesselRouter);

// container
routes.use('/api/v1/container', containerRouter);
export default routes;
