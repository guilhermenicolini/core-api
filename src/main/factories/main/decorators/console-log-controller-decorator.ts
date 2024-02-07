import { Controller } from '../../../../application/controllers'
import { LogControllerDecorator } from '../../../decorators'
import { ConsoleLogger } from '../../../../infra'

export const makeConsoleLogControllerDecorator = (decoratee: Controller): Controller => {
  return new LogControllerDecorator(decoratee, new ConsoleLogger())
}
