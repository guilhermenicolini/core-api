import { Controller } from '../../application/controllers'
import { Validator } from '@guilhermenicolini/core-validators'
import { HttpResponse } from '../../application/helpers'
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
      if (this.enabled || ((httpResponse as HttpResponse).statusCode === 500)) {
        await this.logger.log({ httpRequest, httpResponse })
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
