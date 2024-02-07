export interface Logger {
  info: (data: any) => Promise<void>
  warning: (data: any) => Promise<void>
  error: (data: any) => Promise<void>
}
