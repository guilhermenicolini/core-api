import { Middleware } from '../../application/middlewares'
import { RequestHandler } from 'express'
import { getRequest } from './helper'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const request = getRequest(req)
  const { statusCode, error } = await middleware.handle(request)

  if (statusCode === 200) {
    next()
  } else {
    res.status(statusCode).json({ error: res.__ ? res.__(error.message) : error.message })
  }
}
