export interface Logger {
  log: (data: any) => Promise<void>
}
