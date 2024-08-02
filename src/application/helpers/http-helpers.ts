import { ServerError } from '../errors'
import { HttpResponse } from '../../gateways'
export { HttpResponse }

export const ok = (data?: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const auth = (authorization: string, refreshToken?: string, data?: any): HttpResponse => ({
  statusCode: 200,
  body: data,
  authorization,
  refreshToken
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  error
})

export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  error
})

export const paymentRequired = (error: Error): HttpResponse => ({
  statusCode: 402,
  error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  error
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  error
})

export const serverError = (error: unknown): HttpResponse => ({
  statusCode: 500,
  error: new ServerError(error instanceof Error ? error : undefined)
})
