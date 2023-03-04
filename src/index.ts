export { default as app } from './main/config/app'

export {
  Controller,
  BaseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  Middleware,
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  handleResponse
} from './application'

export { adaptExpressMiddleware, adaptExpressRoute, adaptMulter } from './main/adapters'
export { HttpClient, HttpMethod, HttpRequest, HttpResponse, HttpStatusCode, Logger } from './gateways'
export { LogControllerDecorator } from './main/decorators'

export { ConsoleLogger, AxiosHttpClient } from './infra'

export { makeConsoleLogControllerDecorator } from './main/factories'
