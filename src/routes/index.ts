import { Router } from 'express';
import accessRoute from './access/index'
import userRoute from './user/index'

const routes = Router()

routes.use("/api/v1/auth", accessRoute)
routes.use("/api/v1/user", userRoute)

export default routes