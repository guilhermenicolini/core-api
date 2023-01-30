import { Request, Response, NextFunction } from 'express'

const trimmer = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim()
  } else if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      data[key] = trimmer(data[key])
    })
  }
  return data
}

export const requestTrimmer = (req: Request, res: Response, next: NextFunction): void => {
  req.body = trimmer(req.body)
  const { authorization, Authorization, ...headers } = req.headers
  req.headers = trimmer(headers)
  req.headers.authorization = authorization ? authorization.trim() : (Authorization as string)?.trim()
  next()
}
