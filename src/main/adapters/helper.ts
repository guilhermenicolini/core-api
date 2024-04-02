import { Request } from 'express'

export const getRequest = (req: Request): any => {
  const request = {
    ...req.body,
    ...req.params,
    ...req.signedCookies,
    ...req.headers,
    ...req.locals
  }

  return request
}
