import { ValidationComposite, Validator } from '@guilhermenicolini/core-validators'
import { unauthorized, serverError, HttpResponse, handleResponse } from '../helpers'

export abstract class Middleware {
  abstract perform (httpRequest: any): Promise<HttpResponse | Error>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  defaultError (error: Error): HttpResponse {
    return unauthorized(error)
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) return this.defaultError(error)
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
