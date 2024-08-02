import { HttpResponse } from './http-helpers'
import {
  BadRequestError,
  PaymentRequiredError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError
} from '../errors'

export const handleResponse = (data: HttpResponse | Error): HttpResponse => {
  if (data instanceof BadRequestError) return { statusCode: 400, error: data }
  if (data instanceof PaymentRequiredError) return { statusCode: 402, error: data }
  if (data instanceof UnauthorizedError) return { statusCode: 401, error: data }
  if (data instanceof ForbiddenError) return { statusCode: 403, error: data }
  if (data instanceof NotFoundError) return { statusCode: 404, error: data }
  if (data instanceof ServerError) return { statusCode: 500, error: data }
  if (data instanceof Error) return { statusCode: 400, error: data }
  return data
}
