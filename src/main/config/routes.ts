import { Router, Express } from 'express'
import setupHealthCheckRoutes from '../routes/health-check-routes'

export default (app: Express, healthCheck: boolean = true): void => {
  const router = Router({ mergeParams: true })
  if (healthCheck) setupHealthCheckRoutes(router)
  app.use(router)
}
