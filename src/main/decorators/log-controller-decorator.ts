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
    private readonly level: 'LOG_INFO' | 'LOG_WARNING' | 'LOG_ERROR' | 'LOG_NONE'
  ) {
    super()
  }

  override async perform (httpRequest: any): Promise<HttpResponse | Error> {
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)

      if (this.level === 'LOG_INFO') {
        await this.logger.log({ httpRequest, httpResponse })
        return httpResponse
      }

      if (this.level === 'LOG_WARNING') {
        if ((httpResponse as HttpResponse).statusCode > 399) {
          await this.logger.log({ httpRequest, httpResponse })
          return httpResponse
        }
      }

      if (this.level === 'LOG_ERROR') {
        if (httpResponse instanceof BaseError && httpResponse.innerException) {
          await this.logger.log({ httpRequest, httpResponse })
          return httpResponse
        }

        if ((httpResponse as HttpResponse).error?.innerException) {
          await this.logger.log({ httpRequest, httpResponse })
          return httpResponse
        }
      }

      return httpResponse
    } catch (err) {
      if (this.level === 'LOG_ERROR') {
        await this.logger.log({ httpRequest, httpResponse: err })
      }
      throw err
    }
  }

  override buildValidators (httpRequest: any): Validator[] {
    return this.decoratee.buildValidators(httpRequest)
  }
}
