import app from '../../src/app'
import supertest from 'supertest'

describe('App', () => {
  it('test', async () => {
    const supertestApp = supertest(app)
    const data = (await supertestApp.get(`/v1/app/test`)).body
    expect(data).toEqual({ status: 'ok', value: 'hello world' })
  })
})
