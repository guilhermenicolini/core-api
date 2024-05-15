import { adaptExpressRoute } from '@/main/adapters'
import { Controller } from '@/application/controllers'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { ServerError } from '@/application'

describe('ExpressRouter Adapter', () => {
  let sut: RequestHandler
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>

  beforeAll(() => {
    req = getMockReq({
      body: {
        anyBody: 'any_body',
        anyQuery: 'body_query',
        anyParam: 'body_param',
        any_signed_cookie: 'body_signed_cookie',
        anyHeader: 'body_header',
        anyLocals: 'body_locals'
      },
      query: {
        anyQuery: 'any_query',
        anyParam: 'query_param',
        any_signed_cookie: 'query_signed_cookie',
        anyHeader: 'query_header',
        anyLocals: 'query_locals'
      },
      params: {
        anyParam: 'any_param',
        any_signed_cookie: 'params_signed_cookie',
        anyHeader: 'params_header',
        anyLocals: 'params_locals'
      },
      signedCookies: {
        any_signed_cookie: 'any_signed_cookie',
        anyHeader: 'signed_cookies_header',
        anyLocals: 'signed_cookies_locals'
      },
      headers: {
        anyHeader: 'any_header',
        anyLocals: 'header_locals'
      },
      locals: {
        anyLocals: 'any_locals'
      }
    })
    next = getMockRes().next
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      body: { data: 'any_data' },
      authorization: 'any_authorization',
      refreshToken: 'any_refresh_token'
    })
  })

  beforeEach(() => {
    res = getMockRes().res
    sut = adaptExpressRoute(controller)
  })

  test('Should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({
      anyBody: 'any_body',
      anyQuery: 'any_query',
      anyParam: 'any_param',
      any_signed_cookie: 'any_signed_cookie',
      anyHeader: 'any_header',
      anyLocals: 'any_locals'
    })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('Should call handle with empty request', async () => {
    const req = getMockReq()

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('Should return 200 and valid data', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.set).toHaveBeenCalledTimes(5)
    expect(res.set).toHaveBeenNthCalledWith(1, 'Authorization', 'any_authorization')
    expect(res.set).toHaveBeenNthCalledWith(2, 'Access-Control-Expose-Headers', 'Content-Disposition, Authorization')
    expect(res.set).toHaveBeenNthCalledWith(3, 'RefreshToken', 'any_refresh_token')
    expect(res.set).toHaveBeenNthCalledWith(4, 'Access-Control-Expose-Headers', 'Content-Disposition, RefreshToken')
    expect(res.set).toHaveBeenNthCalledWith(5, 'Access-Control-Expose-Headers', 'Content-Disposition, Authorization, RefreshToken')
  })

  test('Should return 400 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      error: new Error('any_error')
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should return 500 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      error: new ServerError(new Error('any_error'))
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while processing your request. Please, try again later' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('Should call __ on response error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      error: new Error('any_error')
    })
    const i18nSpy = jest.fn()
    res.__ = i18nSpy

    await sut(req, res, next)

    expect(i18nSpy).toHaveBeenCalledWith('any_error')
  })
})
