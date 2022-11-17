import {
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError
} from '@/application/helpers'
import { ServerError } from '@/application/errors'

describe('Http Helpers', () => {
  const error = new Error('any_error')

  test('Should return 200', () => {
    const httpResponse = ok('data')
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: 'data'
    })
  })

  test('Should return 201', () => {
    const httpResponse = created('data')
    expect(httpResponse).toEqual({
      statusCode: 201,
      body: 'data'
    })
  })

  test('Should return 204', () => {
    const httpResponse = noContent()
    expect(httpResponse).toEqual({
      statusCode: 204
    })
  })

  test('Should return 400', () => {
    const httpResponse = badRequest(error)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
  })

  test('Should return 401', () => {
    const httpResponse = unauthorized(error)
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: error
    })
  })

  test('Should return 403', () => {
    const httpResponse = forbidden(error)
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: error
    })
  })

  test('Should return 404', () => {
    const httpResponse = notFound(error)
    expect(httpResponse).toEqual({
      statusCode: 404,
      body: error
    })
  })

  test('Should return 500', () => {
    const httpResponse = serverError(error)
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(error)
    })
  })
})
