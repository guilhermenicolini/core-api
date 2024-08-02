export { default as app } from './main/config/app'

export {
  Controller,
  BaseError,
  BadRequestError,
  UnauthorizedError,
  PaymentRequiredError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  Middleware,
  ok,
  auth,
  created,
  noContent,
  badRequest,
  unauthorized,
  paymentRequired,
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
