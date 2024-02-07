import { Logger } from '../../gateways'

export class ConsoleLogger implements Logger {
  async info (data: any): Promise<void> {
    console.info(data)
  }

  async warning (data: any): Promise<void> {
    console.warn(data)
  }

  async error (data: any): Promise<void> {
    console.error(data)
  }
}
