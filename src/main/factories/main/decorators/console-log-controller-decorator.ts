import { Controller } from '../../../../application/controllers'
import { LogControllerDecorator } from '../../../decorators'
import { ConsoleLogger } from '../../../../infra'

export const makeConsoleLogControllerDecorator = (decoratee: Controller, level: 'LOG_NONE' | 'LOG_INFO' | 'LOG_WARNING' | 'LOG_ERROR'): Controller => {
  return new LogControllerDecorator(decoratee, new ConsoleLogger(), level)
}
