import App from '@/main/config/app'
import request from 'supertest'
import { env } from '@/main/config/env'

describe('Health Check', () => {
  test('Should return 200 and correct output on success', async () => {
    const app = App()
    await request(app)
      .get('/health')
      .expect(200, { status: 'online', version: env.version })
  })

  test('Should return 404 on disabled health check', async () => {
    const app = App({ healthCheck: false })
    await request(app)
      .get('/health')
      .expect(404)
  })
})
