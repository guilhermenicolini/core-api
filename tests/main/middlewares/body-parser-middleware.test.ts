import app from '@/main/config/app'
import request from 'supertest'

describe('BodyParser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test-body-parser')
      .send({ name: 'test' })
      .expect({ name: 'test' })
  })
})
