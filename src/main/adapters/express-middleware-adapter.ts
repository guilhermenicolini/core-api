import { Middleware } from '../../application/middlewares'
import { RequestHandler } from 'express'
import { getRequest } from './helper'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const request = getRequest(req)
  const { statusCode, error, body } = await middleware.handle(request)

  if (statusCode === 200) {
    const validEntries = Object.entries(body).filter(([, value]) => value)
    req.locals = { ...req.locals, ...Object.fromEntries(validEntries) }
    next()
  } else {
    res.status(statusCode).json({ error: res.__ ? res.__(error.message) : error.message })
  }
}
