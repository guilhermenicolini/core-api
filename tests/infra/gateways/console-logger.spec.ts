import { ConsoleLogger } from '@/infra'

describe('ConsoleLogger', () => {
  let sut: ConsoleLogger

  beforeEach(() => {
    sut = new ConsoleLogger()
  })

  test('Should call console.log with correct input', async () => {
    const spy = jest.spyOn(console, 'log').mockReturnValueOnce()
    await sut.log('data')
    expect(spy).toHaveBeenCalledWith('data')
  })

  test('Should not throw if console.log throws', async () => {
    jest.spyOn(console, 'log').mockImplementationOnce(() => { throw new Error('any_error') })
    const result = await sut.log('data')
    expect(result).toBeUndefined()
  })
})
