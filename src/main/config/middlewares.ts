import { bodyParser, requestTrimmer, contentType, cors } from '../middlewares'

import { Express } from 'express'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(requestTrimmer)
  app.use(contentType)
  app.use(cors)
}
