import { BaseError } from './base-error'

export class PaymentRequiredError extends BaseError {
  constructor (message: string, error?: Error) {
    super('PaymentRequiredError', message, error)
  }
}
