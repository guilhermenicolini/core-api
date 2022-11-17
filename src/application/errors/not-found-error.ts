import { BaseError } from './base-error'

export class NotFoundError extends BaseError {
  constructor (message: string, code?: string) {
    super('NotFoundError', message, code)
  }
}
