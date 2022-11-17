import { HttpResponse } from './http-helpers'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError
} from '../errors'

export const handleResponse = (data: HttpResponse | Error): HttpResponse => {
  if (data instanceof BadRequestError) return { statusCode: 400, body: data }
  if (data instanceof UnauthorizedError) return { statusCode: 401, body: data }
  if (data instanceof ForbiddenError) return { statusCode: 403, body: data }
  if (data instanceof NotFoundError) return { statusCode: 404, body: data }
  if (data instanceof ServerError) return { statusCode: 500, body: data }
  if (data instanceof Error) return { statusCode: 400, body: data }
  return data
}
