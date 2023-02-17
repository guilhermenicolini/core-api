import { Router, Express } from 'express'
import setupHealthCheckRoutes from '../routes/health-check-routes'

export default (app: Express): void => {
  const router = Router({ mergeParams: true })
  setupHealthCheckRoutes(router)
  app.use(router)
}
