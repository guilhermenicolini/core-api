import { Controller } from '../../application/controllers'
import { RequestHandler } from 'express'
import { getRequest } from './helper'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const request = getRequest(req)
  const { statusCode, body, error } = await controller.handle(request)

  let data: any
  if (statusCode >= 200 && statusCode <= 299) {
    data = body
  } else {
    data = { error: res.__ ? res.__(error.message) : error.message }
  }

  res.status(statusCode).json(data)
}
