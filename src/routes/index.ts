import { Router } from 'express';
import accessRoute from './access/index'

const routes = Router()

routes.use("/api/v1/account", accessRoute)

export default routes