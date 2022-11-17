import { HealthCheckController, Controller } from '../../../../application/controllers'
import { env } from '../../../config/env'

export const makeHealthCheckController = (): Controller => {
  return new HealthCheckController(env.version)
}
