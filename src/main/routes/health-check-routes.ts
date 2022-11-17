import { adaptExpressRoute as adapt } from '../adapters'
import { makeHealthCheckController } from '../factories'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/health', adapt(makeHealthCheckController()))
}
