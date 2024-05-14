import { Controller } from '../../application/controllers'
import { RequestHandler } from 'express'
import { getRequest } from './helper'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const request = getRequest(req)
  const { statusCode, body, error, authorization, refreshToken } = await controller.handle(request)

  let data: any
  if (statusCode >= 200 && statusCode <= 299) {
    if (authorization) {
      res.set('Authorization', authorization)
      res.set('Access-Control-Expose-Headers', 'Authorization')
    }
    if (refreshToken) {
      res.set('RefreshToken', refreshToken)
      res.set('Access-Control-Expose-Headers', 'RefreshToken')
    }

    data = body
  } else {
    data = { error: res.__ ? res.__(error.message) : error.message }
  }

  res.status(statusCode).json(data)
}
