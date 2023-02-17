import { serve, setup, SwaggerOptions } from 'swagger-ui-express'
import { Express } from 'express'
import { noCache, redirect } from '../middlewares'

export default (app: Express, config: SwaggerOptions = {}): void => {
  app.get('/', redirect('/api-docs'))
  app.use('/api-docs', noCache, serve, setup(config))
}
