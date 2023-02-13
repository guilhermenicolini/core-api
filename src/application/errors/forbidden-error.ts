import { BaseError } from './base-error'

export class ForbiddenError extends BaseError {
  constructor (message: string, error?: Error) {
    super('ForbiddenError', message, error)
  }
}
