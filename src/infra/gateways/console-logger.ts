import { Logger } from '../../gateways'

export class ConsoleLogger implements Logger {
  async log (data: any): Promise<void> {
    try {
      console.log(data)
    } catch {
      return undefined
    }
  }
}
