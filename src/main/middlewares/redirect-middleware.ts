import { Request, Response } from 'express'

export const redirect = (url: string) => {
  return (req: Request, res: Response): void => {
    res.redirect(url)
  }
}
