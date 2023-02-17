import App from '@/main/config/app'
import request from 'supertest'

const app = App({})

describe('Swagger Middleware', () => {
  test('Should load swagger', async () => {
    await request(app)
      .get('/api-docs/')
      .expect(200)
      .then(({ text }) => expect(text).toContain('Swagger UI'))
  })
})
