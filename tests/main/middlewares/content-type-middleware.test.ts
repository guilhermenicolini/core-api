import app from '@/main/config/app'

import request from 'supertest'

describe('Content Type Middleware', () => {
  test('Should return json as default content type', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('Should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
