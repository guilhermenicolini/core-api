import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import {
  ServerError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
} from '@/application/errors'

const validateSpy = jest.fn()

jest.mock('@guilhermenicolini/core-validators', () => ({
  ValidationComposite: jest.fn().mockImplementation(() => {
    return {
      validate: validateSpy
    }
  })
}))

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    body: 'any_body'
  }

  async perform (httpRequest: any): Promise<HttpResponse | Error> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  test('Should return 400 if validations returns error', async () => {
    const error = new Error('validation_error')
    validateSpy.mockReturnValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
  })

  test('Should return 500 if perform throws error', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(error)
    })
    expect(httpResponse.body.innerException).toEqual(error)
  })

  test('Should return 500 with no error if perform throws not error', async () => {
    const error = 'perform_error'
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(undefined)
    })
    expect(httpResponse.body.innerException).toEqual(undefined)
  })

  test('Should return 400 if perform returns BadRequest', async () => {
    const error = new BadRequestError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
  })

  test('Should return 400 if perform returns Error', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
  })

  test('Should return 401 if perform returns UnauthorizedError', async () => {
    const error = new UnauthorizedError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: error
    })
  })
  test('Should return 403 if perform returns ForbiddenError', async () => {
    const error = new ForbiddenError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: error
    })
  })

  test('Should return 404 if perform returns NotFoundError', async () => {
    const error = new NotFoundError('perform_error')
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 404,
      body: error
    })
  })

  test('Should return 500 if perform returns ServerError', async () => {
    const error = new ServerError(new Error('perform_error'))
    jest.spyOn(sut, 'perform').mockResolvedValueOnce(error)

    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: error
    })
  })

  test('Should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
