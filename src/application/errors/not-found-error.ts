import { BaseError } from './base-error'

export class NotFoundError extends BaseError {
  constructor (message: string, error?: Error) {
    super('NotFoundError', message, error)
  }
}
