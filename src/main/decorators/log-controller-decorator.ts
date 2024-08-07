import { Controller } from '../../application/controllers'
import { Validator } from '@guilhermenicolini/core-validators'
import { HttpResponse } from '../../application/helpers'
import { BaseError, ServerError } from '../../application/errors'
import { Logger } from '../../gateways'
export { Logger }

export class LogControllerDecorator extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly logger: Logger
  ) {
    super()
  }

  override async perform (httpRequest: any): Promise<HttpResponse | Error> {
    try {
      const httpResponse = await this.decoratee.perform(httpRequest) as HttpResponse

      if (httpResponse instanceof ServerError) {
        await this.logger.error({ httpRequest, httpResponse })
        return httpResponse
      }

      if (httpResponse instanceof BaseError) {
        await this.logger.warning({ httpRequest, httpResponse })
        return httpResponse
      }

      if (httpResponse.statusCode >= 400 && httpResponse.statusCode <= 499) {
        await this.logger.warning({ httpRequest, httpResponse })
        return httpResponse
      }

      if (httpResponse.statusCode === 500) {
        await this.logger.error({ httpRequest, httpResponse })
        return httpResponse
      }

      await this.logger.info({ httpRequest, httpResponse })
      return httpResponse
    } catch (err: any) {
      await this.logger.error({ httpRequest, httpResponse: { message: err.message, stack: err.stack } })
      throw err
    }
  }

  override buildValidators (httpRequest: any): Validator[] {
    return this.decoratee.buildValidators(httpRequest)
  }
}
