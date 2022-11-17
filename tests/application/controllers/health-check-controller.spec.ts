import { Controller, HealthCheckController } from '@/application/controllers'

describe('HealthCheckController', () => {
  let version: string
  let sut: HealthCheckController

  beforeEach(() => {
    version = '1.0'
    sut = new HealthCheckController(version)
  })

  test('Should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should return 200 with correct output', async () => {
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        status: 'online',
        version
      }
    })
  })
})
