import App from '@/main/config/app'
import request from 'supertest'

const app = App()

describe('RequestTrimmer Middleware', () => {
  test('Should trim body object string', async () => {
    app.post('/request-trimmer', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/request-trimmer')
      .send({
        data: '   any_data   '
      })
      .expect({
        data: 'any_data'
      })
  })

  test('Should trim body child object string', async () => {
    app.post('/request-trimmer', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/request-trimmer')
      .send({
        data: {
          child: {
            data: '   any_child   '
          }
        }
      })
      .expect({
        data: {
          child: {
            data: 'any_child'
          }
        }
      })
  })

  test('Should trim header Authorization string', async () => {
    app.get('/request-trimmer-header', (req, res) => {
      res.send(req.headers)
    })
    await request(app)
      .get('/request-trimmer-header')
      .set('Authorization', '   any_token   ')
      .then(({ body }) => {
        expect(body.authorization).toBe('any_token')
      })
  })

  test('Should trim header authorization string', async () => {
    app.get('/request-trimmer-header', (req, res) => {
      res.send(req.headers)
    })
    await request(app)
      .get('/request-trimmer-header')
      .set('authorization', '   any_token   ')
      .then(({ body }) => {
        expect(body.authorization).toBe('any_token')
      })
  })
})
