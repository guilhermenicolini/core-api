import { Controller } from '../../application/controllers'
import { Validator } from '@guilhermenicolini/core-validators'
import { HttpResponse } from '../../application/helpers'
import { BaseError } from '../../application/errors'
import { Logger } from '../../gateways'
export { Logger }

export class LogControllerDecorator extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly logger: Logger,
    private readonly enabled: boolean
  ) {
    super()
  }

  override async perform (httpRequest: any): Promise<HttpResponse | Error> {
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)

      if (this.enabled) {
        await this.logger.log({ httpRequest, httpResponse })
        return httpResponse
      }

      if (httpResponse instanceof BaseError && httpResponse.innerException) {
        await this.logger.log({ httpRequest, httpResponse })
        return httpResponse
      }

      if ((httpResponse as HttpResponse).error?.innerException) {
        await this.logger.log({ httpRequest, httpResponse })
        return httpResponse
      }

      return httpResponse
    } catch (err) {
      await this.logger.log({ httpRequest, httpResponse: err })
      throw err
    }
  }

  override buildValidators (httpRequest: any): Validator[] {
    return this.decoratee.buildValidators(httpRequest)
  }
}
