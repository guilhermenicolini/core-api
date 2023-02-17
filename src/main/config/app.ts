import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import express, { Express } from 'express'

export default (swaggerConfig?: any): Express => {
  const app = express()
  setupSwagger(app, swaggerConfig)
  setupMiddlewares(app)
  setupRoutes(app)
  return app
}
