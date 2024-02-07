import { Logger } from '../../gateways'

export class ConsoleLogger implements Logger {
  async info (data: any): Promise<void> {
    console.info(JSON.stringify(data))
  }

  async warning (data: any): Promise<void> {
    console.warn(JSON.stringify(data))
  }

  async error (data: any): Promise<void> {
    console.error(JSON.stringify(data))
  }
}
