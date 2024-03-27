export type HttpMethod = 'post' | 'get' | 'put' | 'delete'

export type HttpRequest = {
  url: string
  method: HttpMethod
  body?: any
  headers?: any
  cookies?: any
}

export enum HttpStatusCode {
  unknown = -1,
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  unprocessableEntity = 422,
  serverError = 500
}

export type HttpResponse<Response = any> = {
  statusCode: HttpStatusCode
  error?: any
  body?: Response
  authorization?: string
  refreshToken?: string
}

export interface HttpClient {
  request: <Response = any>(data: HttpRequest) => Promise<HttpResponse<Response>>
}
