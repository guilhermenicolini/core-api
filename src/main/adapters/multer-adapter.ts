import multer from 'multer'
import { RequestHandler } from 'express'
import { ServerError } from '@/application/errors'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('file')
  upload(req, res, error => {
    if (error !== undefined) {
      return res.status(500).json({ error: new ServerError(error).message })
    }
    if (req.file !== undefined) {
      req.locals = { ...req.locals, file: { buffer: req.file.buffer, mimeType: req.file.mimetype, name: req.file.originalname, size: req.file.size } }
    }
    next()
  })
}
