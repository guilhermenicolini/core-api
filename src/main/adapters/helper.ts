import { Request } from 'express'

export const getRequest = (req: Request): any => {
  const request = {
    ...req.body,
    ...req.params,
    ...req.headers,
    ...req.locals,
    files: req.files
  }

  return request
}
