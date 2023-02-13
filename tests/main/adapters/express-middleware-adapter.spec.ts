import { adaptExpressMiddleware } from '@/main/adapters'
import { Middleware } from '@/application/middlewares'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('ExpressMiddleware Adapter', () => {
  let sut: RequestHandler
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>

  beforeAll(() => {
    next = getMockRes().next
    middleware = mock<Middleware>()
    middleware.handle.mockResolvedValue({
      statusCode: 200
    })
  })

  beforeEach(() => {
    res = getMockRes().res
    req = getMockReq({
      headers: {
        anyHeader: 'any_header'
      }
    })
    sut = adaptExpressMiddleware(middleware)
  })

  test('Should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({
      anyHeader: 'any_header'
    })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call handle with empty request', async () => {
    const req = getMockReq()

    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call next chain', async () => {
    await sut(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('Should return if status is not 200', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 400,
      body: new Error('any_error')
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should call __ on response error', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 400,
      body: new Error('any_error')
    })
    const i18nSpy = jest.fn()
    res.__ = i18nSpy

    await sut(req, res, next)

    expect(i18nSpy).toHaveBeenCalledWith('any_error')
  })
})
