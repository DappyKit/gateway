import app from '../../src/app'
import supertest from 'supertest'
import { setConfigData } from '../../src/config'
import { stringToBase64 } from '../utils/data'

describe('Verify', () => {
  beforeAll(() => {
    setConfigData({
      googleClientId: '205494731540-ctvqvohakcrfu4p21e0023h6hnfcb4ch.apps.googleusercontent.com'
    })
  })

  it('should throw on incorrect data for google', async () => {
    const supertestApp = supertest(app)

    let response1 = await supertestApp.post(`/v1/verify/google`).send({data: 'test data'})
    expect(response1.status).toBe(500)
    expect(response1.body.message).toBe('Wrong number of segments in token: test data')

    response1 = await supertestApp.post(`/v1/verify/google`).send({data: 'test.my.data'})
    expect(response1.status).toBe(500)
    expect(response1.body.message).toContain('Can\'t parse token envelope')

    response1 = await supertestApp.post(`/v1/verify/google`).send({data: 'test.my.data'})
    expect(response1.status).toBe(500)
    expect(response1.body.message).toContain('Can\'t parse token envelope')
  })

  it('should verify google token', async () => {
    const supertestApp = supertest(app)
    // base64: eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMDU0OTQ3MzE1NDAtY3R2cXZvaGFrY3JmdTRwMjFlMDAyM2g2aG5mY2I0Y2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMDU0OTQ3MzE1NDAtY3R2cXZvaGFrY3JmdTRwMjFlMDAyM2g2aG5mY2I0Y2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3OTM1Njc3MTc3Mzk5Mjg1OTgiLCJlbWFpbCI6InVzZXJ0b2tlbi5wb2x5Z29uQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MDczMjE3NDksIm5hbWUiOiJVc2VyIFRva2VuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0o1T1JhQlBqQzhlRlZuUjNDZFM3YkJUVEl1Y3VLa1E1aGxGb3AwbHhTcz1zOTYtYyIsImdpdmVuX25hbWUiOiJVc2VyIiwiZmFtaWx5X25hbWUiOiJUb2tlbiIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNzA3MzIyMDQ5LCJleHAiOjE3MDczMjU2NDksImp0aSI6ImQyZjI3ZjMwYmUzYTJjZmVmYmMyYTM0ZTJlYTUwNmNmNjdkYmNlOGYifQ
    const realData = {
      'iss': 'https://accounts.google.com',
      'azp': '205494731540-ctvqvohakcrfu4p21e0023h6hnfcb4ch.apps.googleusercontent.com',
      'aud': '205494731540-ctvqvohakcrfu4p21e0023h6hnfcb4ch.apps.googleusercontent.com',
      'sub': '109793567717739928598',
      'email': 'usertoken.polygon@gmail.com',
      'email_verified': true,
      'nbf': 1707321749,
      'name': 'User Token',
      'picture': 'https://lh3.googleusercontent.com/a/ACg8ocJ5ORaBPjC8eFVnR3CdS7bBTTIucuKkQ5hlFop0lxSs=s96-c',
      'given_name': 'User',
      'family_name': 'Token',
      'locale': 'en',
      'iat': 1707322049,
      'exp': 1707325649,
      'jti': 'd2f27f30be3a2cfefbc2a34e2ea506cf67dbce8f'
    }
    const fakeData = {...realData, email: 'hello@gmail.com'}
    const tokenTemplate = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJkYzRlMTA5ODE1ZjQ2OTQ2MGU2M2QzNGNkNjg0MjE1MTQ4ZDdiNTkiLCJ0eXAiOiJKV1QifQ.{data}.OM2nJy9DZszK2_vKpJ5Csc0HGI9WCW-b0ZmKfcrmB5EtPRJO1xFGH5YolYTbJ3SM3orM52M-_V82br_2lqUqVYqcu9jijRHu8gVI1HevcvyqOPCQV0mG6KzlFtUhKD40dywDpObdErtRJtVzbWk0oUuhN_b_re-DIp4TesCzsmxVX-OlWANCJaYejiQlHS7-T-BzqZq2brzBXBFvmGo0L6xW0IhEkjrOfgMNRfRt5nPuvAjISBFwXe8WxgskGqYpDvUvDL6WCZO02n2_lUQOfrmzbmKVCLnuAI4Jxm8jYAioc5OrYfal8M5cmdZbFkKNShM6M_m-Zh5V6hErXfSEIw'

    const realToken = tokenTemplate.replace('{data}', stringToBase64(JSON.stringify(realData)))
    const fakeToken = tokenTemplate.replace('{data}', stringToBase64(JSON.stringify(fakeData)))

    let response1 = await supertestApp.post(`/v1/verify/google`).send({data: realToken})
    expect(response1.status).toBe(500)
    // the token is correct, but it's expired
    expect(response1.body.message).toContain('Token used too late')

    response1 = await supertestApp.post(`/v1/verify/google`).send({data: fakeToken})
    expect(response1.status).toBe(500)
    expect(response1.body.message).toContain('Invalid token signature')
  })
})
