import { Controller } from '../../../../application/controllers'
import { LogControllerDecorator } from '../../../decorators'
import { ConsoleLogger } from '../../../../infra'

export const makeConsoleLogControllerDecorator = (decoratee: Controller, enabled: boolean): Controller => {
  return new LogControllerDecorator(decoratee, new ConsoleLogger(), enabled)
}
