import { Middleware } from '@/application/middlewares'
import { HttpResponse, badRequest } from '@/application/helpers'
import {
  ServerError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  PaymentRequiredError
} from '@/application/errors'

const validateSpy = jest.fn()

jest.mock('@guilhermenicolini/core-validators', () => ({
  ValidationComposite: jest.fn().mockImplementation(() => {
    return {
      validate: validateSpy
    }
  })
}))

class MiddlewareStub extends Middleware {
  result: HttpResponse = {
    statusCode: 200,
    body: 'any_body'
  }

  async perform (httpRequest: any): Promise<HttpResponse | Error> {
    return this.result
  }
}

describe('Middleware', () => {
  let sut: MiddlewareStub

  beforeEach(() => {
    sut = new MiddlewareStub()
  })

  test('Should return 401 if validations returns error', async () => {
    const error = new Error('validation_error')
    validateSpy.mockReturnValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 401,
      error
    })
  })

  test('Should return 400 if validations returns error when overrided', async () => {
    const error = new Error('validation_error')
    validateSpy.mockReturnValueOnce(error)

    jest.spyOn(sut, 'defaultError').mockReturnValueOnce(badRequest(error))

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 400,
      error
    })
  })

  test('Should return 500 if perform throws error', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      error: new ServerError(error)
    })
    expect(httpResponse.error.innerException).toEqual(error)
  })

  test('Should return 500 with no error if perform throws not error', async () => {
    const error = 'perform_error'
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      error: new ServerError(undefined)
    })
    expect(httpResponse.error.innerException).toEqual(undefined)
  })

  test('Should return 400 if perform returns BadRequest', async () => {
    const error = new BadRequestError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 400,
      error
    })
  })

  test('Should return 400 if perform returns Error', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 400,
      error
    })
  })

  test('Should return 401 if perform returns UnauthorizedError', async () => {
    const error = new UnauthorizedError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 401,
      error
    })
  })

  test('Should return 401 if perform returns PaymentRequiredError', async () => {
    const error = new PaymentRequiredError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 402,
      error
    })
  })

  test('Should return 403 if perform returns ForbiddenError', async () => {
    const error = new ForbiddenError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 403,
      error
    })
  })

  test('Should return 404 if perform returns NotFoundError', async () => {
    const error = new NotFoundError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 404,
      error
    })
  })

  test('Should return 500 if perform returns ServerError', async () => {
    const error = new ServerError(new Error('perform_error'))
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      error
    })
  })

  test('Should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
