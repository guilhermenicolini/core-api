import { Validator, ValidationComposite } from '@guilhermenicolini/core-validators'
import { badRequest, serverError, HttpResponse, handleResponse } from '../helpers'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse | Error>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) return badRequest(error)
    try {
      const result = await this.perform(httpRequest)
      return handleResponse(result)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
