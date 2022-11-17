import { Controller } from '@/application/controllers'
import { LogControllerDecorator, Logger } from '@/main/decorators'
import { RequiredValidator } from '@guilhermenicolini/core-validators'

import { mock, MockProxy } from 'jest-mock-extended'

describe('LogControllerDecorator', () => {
  let logger: MockProxy<Logger>
  let decoratee: MockProxy<Controller>
  let sut: LogControllerDecorator

  beforeAll(() => {
    logger = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 204 })
    decoratee.buildValidators.mockReturnValue([new RequiredValidator('any_field')])
  })

  beforeEach(() => {
    sut = new LogControllerDecorator(decoratee, logger, false)
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

  test('Should call Logger if log is enabled', async () => {
    sut = new LogControllerDecorator(decoratee, logger, true)
    await sut.perform({ any: 'any' })

    expect(logger.log).toHaveBeenCalledTimes(1)
    expect(logger.log).toHaveBeenCalledWith({
      httpRequest: { any: 'any' },
      httpResponse: { statusCode: 204 }
    })
  })

  test('Should call Logger if decoratee returns 500', async () => {
    const httpResponse = {
      statusCode: 500,
      body: new Error('any_error')
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

  test('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })
    expect(httpResponse).toEqual({ statusCode: 204 })
  })
})
