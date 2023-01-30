import { Middleware } from '../../application/middlewares'
import { RequestHandler } from 'express'
import { getRequest } from './helper'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const request = getRequest(req)
  const { statusCode, body } = await middleware.handle(request)

  if (statusCode === 200) {
    next()
  } else {
    res.status(statusCode).json({ code: body.code || body.name, error: res.__ ? res.__(body.message) : body.message })
  }
}
