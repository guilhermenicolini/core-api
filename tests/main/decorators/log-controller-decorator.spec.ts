import { Controller } from '@/application/controllers'
import { LogControllerDecorator, Logger } from '@/main/decorators'
import { RequiredValidator } from '@guilhermenicolini/core-validators'
import { BadRequestError } from '@/application/errors'
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
      sut = new LogControllerDecorator(decoratee, logger, 'LOG_NONE')
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

  describe('LOG_NONE', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger, 'LOG_NONE')
    })

    test('Should not call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should not call Logger on 4xx', async () => {
      decoratee.perform.mockResolvedValueOnce({ statusCode: 400 })
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should not call Logger on BaseError', async () => {
      decoratee.perform.mockResolvedValueOnce(error)
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should not call Logger on throw', async () => {
      decoratee.perform.mockRejectedValueOnce(error)
      const promise = sut.perform({ any: 'any' })

      await expect(promise).rejects.toThrowError(error)
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('LOG_INFO', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger, 'LOG_INFO')
    })

    test('Should call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: { statusCode: 204 }
      })
    })

    test('Should call Logger on 4xx', async () => {
      decoratee.perform.mockResolvedValueOnce({ statusCode: 400, error })
      await sut.perform({ any: 'any' })

      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: { statusCode: 400, error }
      })
    })

    test('Should call Logger on BaseError', async () => {
      decoratee.perform.mockResolvedValueOnce(error)
      await sut.perform({ any: 'any' })

      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: error
      })
    })

    test('Should not call Logger on throw', async () => {
      decoratee.perform.mockRejectedValueOnce(error)
      const promise = sut.perform({ any: 'any' })

      await expect(promise).rejects.toThrowError(error)
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('LOG_WARNING', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger, 'LOG_WARNING')
    })

    test('Should not call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should call Logger on 4xx', async () => {
      decoratee.perform.mockResolvedValueOnce({ statusCode: 400, error })
      await sut.perform({ any: 'any' })

      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: { statusCode: 400, error }
      })
    })

    test('Should not call Logger on BaseError', async () => {
      decoratee.perform.mockResolvedValueOnce(error)
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should not call Logger on throw', async () => {
      decoratee.perform.mockRejectedValueOnce(error)
      const promise = sut.perform({ any: 'any' })

      await expect(promise).rejects.toThrowError(error)
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('LOG_ERROR', () => {
    beforeEach(() => {
      sut = new LogControllerDecorator(decoratee, logger, 'LOG_ERROR')
    })

    test('Should not call Logger on 2xx', async () => {
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should not call Logger on 4xx', async () => {
      decoratee.perform.mockResolvedValueOnce({ statusCode: 400 })
      await sut.perform({ any: 'any' })

      expect(logger.log).not.toHaveBeenCalled()
    })

    test('Should call Logger on BaseError with innerException', async () => {
      const httpResponse = new BadRequestError('any_message', new Error('any_inner_message'))
      decoratee.perform.mockResolvedValueOnce(httpResponse)

      await sut.perform({ any: 'any' })

      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse
      })
    })

    test('Should call Logger on HttpResponse with BaseError with innerException', async () => {
      const httpResponse = {
        statusCode: 400,
        error: new BadRequestError('any_message', new Error('any_inner_message'))
      }
      decoratee.perform.mockResolvedValueOnce(httpResponse)

      await sut.perform({ any: 'any' })

      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse
      })
    })

    test('Should call Logger and rethrow if decoratee throws', async () => {
      const err = new Error('decoratee_error')
      decoratee.perform.mockRejectedValueOnce(err)

      const promise = sut.perform({ any: 'any' })

      await expect(promise).rejects.toThrow(err)
      expect(logger.log).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith({
        httpRequest: { any: 'any' },
        httpResponse: err
      })
    })
  })
})
