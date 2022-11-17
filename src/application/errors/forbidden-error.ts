import { BaseError } from './base-error'

export class ForbiddenError extends BaseError {
  constructor (message: string, code?: string) {
    super('ForbiddenError', message, code)
  }
}
