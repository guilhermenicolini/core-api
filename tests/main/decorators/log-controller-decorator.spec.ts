import { Controller } from '@/application/controllers'
import { LogControllerDecorator, Logger } from '@/main/decorators'
import { RequiredValidator } from '@guilhermenicolini/core-validators'
import { ServerError, BadRequestError } from '@/application/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('LogControllerDecorator', () => {
  let logger: MockProxy<Logger>
  let decoratee: MockProxy<Controller>
  let sut: LogControllerDecorator

  const error = new BadRequestError('any_error')

  beforeAll(() => {
    logger = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 204 })
    decoratee.buildValidators.mockReturnValue([new RequiredValidator('any_field')])
  })

  describe('Base', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger)
    })

    test('Should extend Controller', async () => {
      expect(sut).toBeInstanceOf(Controller)
    })

    test('Should execute decoratee perform', async () => {
      await sut.perform({ any: 'any' })

      expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
      expect(decoratee.perform).toHaveBeenCalledTimes(1)
    })

    test('Should execute decoratee validation', () => {
      const validators = sut.buildValidators({ any: 'any' })

      expect(decoratee.buildValidators).toHaveBeenCalledWith({ any: 'any' })
      expect(decoratee.buildValidators).toHaveBeenCalledTimes(1)
      expect(validators).toEqual([new RequiredValidator('any_field')])
    })

    test('should return same result as decoratee on success', async () => {
      const httpResponse = await sut.perform({ any: 'any' })
      expect(httpResponse).toEqual({ statusCode: 204 })
    })
  })

  describe('info', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger)
    })

    test('Should call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.info).toHaveBeenCalledTimes(1)
      expect(logger.info).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: { statusCode: 204 }
      })
    })
  })

  describe('warning', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger)
    })

    test('Should not call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.warning).not.toHaveBeenCalled()
    })

    test('Should call Logger on BaseError', async () => {
      decoratee.perform.mockResolvedValueOnce(error)
      await sut.perform({ any: 'any' })

      expect(logger.warning).toHaveBeenCalledTimes(1)
      expect(logger.warning).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: error
      })
    })

    test('Should call Logger on 4xx', async () => {
      decoratee.perform.mockResolvedValueOnce({ statusCode: 400, error })
      await sut.perform({ any: 'any' })

      expect(logger.warning).toHaveBeenCalledTimes(1)
      expect(logger.warning).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: { statusCode: 400, error }
      })
    })
  })

  describe('error', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger)
    })

    test('Should not call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.error).not.toHaveBeenCalled()
    })

    test('Should call Logger on ServerError', async () => {
      const err = new ServerError(error)
      decoratee.perform.mockResolvedValueOnce(err)
      await sut.perform({ any: 'any' })

      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: err
      })
    })

    test('Should call Logger and rethrow if decoratee throws', async () => {
      const err = new Error('decoratee_error')
      decoratee.perform.mockRejectedValueOnce(err)

      const promise = sut.perform({ any: 'any' })

      await expect(promise).rejects.toThrow(err)
      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: err
      })
    })
  })
})
