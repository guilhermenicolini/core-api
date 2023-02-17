import App from '@/main/config/app'
import request from 'supertest'
import { env } from '@/main/config/env'

const app = App()

describe('Health Check', () => {
  test('Should return 200 and correct output on success', async () => {
    await request(app)
      .get('/health')
      .expect(200, { status: 'online', version: env.version })
  })
})
