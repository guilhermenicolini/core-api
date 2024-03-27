# **Core API**
This project maintains all API core structure

## Get Started
```
npm login
nvm use
npm install
```
This will install all dependencies and install git hooks.

## Recommended Commit Message Format
```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: Optional, can be anything specifying the scope of the commit change.
  |                          For example $location|$browser|$compile|$rootScope|ngHref|ngClick|ngView, etc.
  |                          In App Development, scope can be a page, a module or a component.
  │
  └─⫸ Commit Type: feat|fix|docs|style|refactor|test|chore|perf|ci|build|temp
```

## Development
```
npm run test:unit
```
Keep watching unit tests while coding

```
npm run test:integration
```
Keep watching integration tests while coding

## Commits and Pushes
Commits message should follow recommendations above.
On pre-commit all related tests based on staged files should be valid
On pre-push all tests should be valid

## Deploy
Change package.json version
```
npm run deploy
```
Compile the typescript project into javascript on destination folder and publish package on NPM

## Documentation

### Installation
```
npm install @guilhermenicolini/core-api@latest
```

### Usage

#### App
```
  import { App } from '@guilhermenicolini/core-api'
  import swaggerConfig from './swagger'

  const app = App(swaggerConfig)

  app.use('/test', (req, res) => {
    res.send({})
  })
```
App is an instance of express() with some pre-defined configurations:
- /health route
- /api-docs (Swagger)
- body parser middleware that transform body into JSON
- trim all body and headers string values
- content-type middleware that set content-type to JSON
- cors that enable cors to all api

#### Available Interfaces

> ##### Logger
Logger interface used on LogControllerDecorator
```
  import { Logger } from '@guilhermenicolini/core-api'

  class ConsoleLogger implements Logger {
    async log (data: any): Promise<void> {
      console.log(data)
    }
  }
```

> ##### HttpClient
Interface used on http requests

#### Adapters

> ##### Middleware
Adapt Middleware implementations into express middleware
```
  import { adaptExpressMiddleware as adapt } from '@guilhermenicolini/core-api'
  import { RequestHandler } from 'express'
  import { MyMiddleware } from './my-middleware'
  import { Router } from 'express'

  const auth = (): RequestHandler => adapt(new MyMiddleware())

  export default (router: Router): void => {
    router.get('/protected', auth(), (req, res) => {
      res.send({})
    }))
  }
```
This adapter pass the following properties to Middleware:
- body
- params
- headers
Also, this adaptar pass Middleware body response as locals to Controller

> ##### Controller
Adapt Controller implementations into express function
```
  import { adaptExpressRoute as adapt } from '@guilhermenicolini/core-api'
  import { RequestHandler } from 'express'
  import { MyController } from './my-controller'
  import { Router } from 'express'

  export default (router: Router): void => {
    router.get('/public', adapt(new MyController()))
  }
```
This adapter trim spaces of all body string properties and pass the following unified properties to Controller:
- body
- params
- headers
- locals => Middleware adapter body response

> ##### File Upload
Enable single file upload into express function
```
  import { adaptMulter as upload } from '@guilhermenicolini/core-api'
  import { RequestHandler } from 'express'
  import { Router } from 'express'

  export default (router: Router): void => {
    router.get('/public', upload)
  }
```
This adapter receives an attachment with name picture and pass data to req.locals.file containing thr following informations:
- buffer
- mimeType

#### Decorators

> ##### LogControllerDecorator
Decorate Controller with any Logger implementation
```
  import { LogControllerDecorator, Controller } from '@guilhermenicolini/core-api'
  import { MyController } from './my-controller'
  import { MyLogger } from './my-logger'

  export const makeMyController = (): Controller => {
    const decoratee = new MyController()
    const logger = new MyLogger()
    return new LogControllerDecorator(decoratee, logger, level)
  }
```
This decorator calls Logger implementation after getting decoratee perform response. The decorator receives 3 parameters:
- decoratee: The controller to be decorated
- logger: The Logger implementation
- level:
  - LOG_NONE: do not log any request/response
  - LOG_INFO: log all request/response
  - LOG_WARNING: log only http status codes >= 400
  - LOG_ERROR: log only internal errors

#### Available Classes

> ##### Middleware
Abstract class that implements a middleware
```
  import { Middleware, HttpResponse, ok, forbidden, badRequest } from '@guilhermenicolini/core-api'
  import { ValidationBuilder as Builder, Validator } from '@guilhermenicolini/core-validators'

  type HttpRequest = { userId?: string, userRoles?: string }

  export class CustomMiddeware extends Middleware {
    constructor () {
      super()
    }

    override async perform ({ userRoles }: HttpRequest): Promise<HttpResponse | Error> {
      return userRoles?.includes('admin') ? ok() : forbidden(new Error('Access denied'))
    }

    override buildValidators ({ userId }: HttpRequest): Validator[] {
      return [
        ...Builder.of({ fieldName: 'userId', value: userId }).required().build()
      ]
    }

    override defaultError (error: Error): HttpResponse {
      return badRequest(error)
    }
  }
```
To implement this class, you have to:
- override perform method with your custom rules
- can override buildValidators if you need to validate data
- default error code when validation fails is 401. You can override defaultError to return another code if necessary

> ##### Controller
Abstract class that implements a controller
```
  import { Controller, HttpResponse, ok } from '@guilhermenicolini/core-api'
  import { ValidationBuilder as Builder, Validator } from '@guilhermenicolini/core-validators'

  type HttpRequest = { userId?: string }

  export class CustomController extends Controller {
    constructor (private readonly repo: any) {
      super()
    }

    override async perform ({ userId }: HttpRequest): Promise<HttpResponse | Error> {
      const data = this.repo.load(userId)
      return ok(data)
    }
  }
```

#### Available Implementations

> ##### ConsoleLogger
Implementation of Logger interface using console.log

> ##### AxiosHttpClient
Implementation of HttpClient interface using axios

#### Available Factories
> #### makeConsoleLogControllerDecorator
Factory helper to create a LogControllerDecorator using ConsoleLog Logger
```
  import { makeConsoleLogControllerDecorator } from '@guilhermenicolini/core-api'
  import { MyController } from './my-controller'

  makeConsoleLogControllerDecorator(new MyController, 'LOG_ERROR')
```

#### Available Error Helpers

> ##### BadRequestError
Return badRequest helper

> ##### UnauthorizedError
Return unauthorized helper

> ##### ForbiddenError
Return forbidden helper

> ##### NotFoundError
Return notFound helper

> ##### ServerError
Return serverError helper

#### Available errors

> ##### BaseError
> ##### BadRequestError
> ##### UnauthorizedError
> ##### ForbiddenError
> ##### NotFoundError
> ##### ServerError

#### Available Http Helpers

> ##### handleResponse
Used to Middleware and Controller handle function. If perform returns any instance of above errors, it will return the specific HttpResponse error

> ##### ok
Return 200 and specified body

> ##### auth
Return 200 and specified body, authorization header and refresh token cookie

> ##### created
Return 201 and specified body

> ##### noContent
Return 204

> ##### badRequest
Return 400 and specified body error

> ##### unauthorized
Return 401 and specified body error

> ##### forbidden
Return 403 and specified body error

> ##### notFound
Return 404 and specified body error

> ##### serverError
Return 500 and specified body error

### Principles

* Single Responsability Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Separation of Concerns (SOC)
* Don't Repeat Yourself (DRY)
* You Aren't Gonna Need It (YAGNI)
* Keep It Simple, Silly (KISS)
* Composition Over Inheritance

> ### Design Patterns

* Composite
* Builder
* Dependency Injection

> ### Methodologies

* TDD
* Clean Architecture
* DDD

> ###Libraries and Tools

* Typescript
* Jest
* Eslint
* Husky
* Tldjs
