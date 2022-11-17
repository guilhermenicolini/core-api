import { ServerError } from '@/application/errors'

describe('ServerError', () => {
  let sut: ServerError
  const error = new Error('any_error')

  beforeEach(() => {
    sut = new ServerError(error)
  })

  test('Should return correct string message on stringify', async () => {
    const message = JSON.stringify(sut)

    expect(message).toContain('An error occurred while processing your request. Please, try again later. Inner error: any_error')
  })
})
