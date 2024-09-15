import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import express, { Express } from 'express'

export type AppConfig = {
  swaggerConfig?: any
  healthCheck?: boolean
}

export default ({ swaggerConfig, healthCheck }: AppConfig = {}): Express => {
  const app = express()
  setupSwagger(app, swaggerConfig)
  setupMiddlewares(app)
  setupRoutes(app, healthCheck)
  return app
}
