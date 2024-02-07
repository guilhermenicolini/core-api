import { ConsoleLogger } from '@/infra'

describe('ConsoleLogger', () => {
  let sut: ConsoleLogger

  beforeEach(() => {
    sut = new ConsoleLogger()
  })

  describe('info', () => {
    test('Should call console.log with correct input', async () => {
      const spy = jest.spyOn(console, 'info').mockReturnValueOnce()
      await sut.info('data')
      expect(spy).toHaveBeenCalledWith('data')
    })
  })

  describe('warning', () => {
    test('Should call console.log with correct input', async () => {
      const spy = jest.spyOn(console, 'warn').mockReturnValueOnce()
      await sut.warning('data')
      expect(spy).toHaveBeenCalledWith('data')
    })
  })

  describe('error', () => {
    test('Should call console.log with correct input', async () => {
      const spy = jest.spyOn(console, 'error').mockReturnValueOnce()
      await sut.error('data')
      expect(spy).toHaveBeenCalledWith('data')
    })
  })
})
