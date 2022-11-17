import { BaseError } from './base-error'

export class BadRequestError extends BaseError {
  constructor (message: string, code?: string) {
    super('BadRequestError', message, code)
  }
}
