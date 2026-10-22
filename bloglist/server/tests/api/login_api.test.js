const supertest = require('supertest')
const mongoose = require('mongoose')
const { describe, test, after, before } = require('node:test')
const assert = require('node:assert')
const app = require('../../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const { SECRET } = require('../../utils/config')

const api = supertest(app)

before( async () => {
  await User.deleteMany({})
  const testUser = {
    username: 'jwiewiorka',
    name: 'Jan Wiewiórka',
    passwordHash: await bcrypt.hash('testPassword', 10),
    blogs: [],
    _id: '6ab575147730c2996bd2eae3',
    __v: 0
  }
  await new User(testUser).save()
})

describe('Login tests', () => {

  test('valid login returns a token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username:'jwiewiorka', password: 'testPassword' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const decoded = jwt.verify(response.body.token, SECRET)
    assert.strictEqual(decoded.id, '6ab575147730c2996bd2eae3')
    assert.strictEqual(decoded.username, 'jwiewiorka')
  })

  test('unknown username returns 401', async () => {
    const response = await api
      .post('/api/login')
      .send({ username:'tuser', password: 'testPassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body,
      { error: 'InvalidLogin', message: 'username or password is incorrect' }
    )
  })

  test('wrong password returns 401 Unauthorized status code', async () => {
    const response = await api
      .post('/api/login')
      .send({ username:'jwiewiorka', password: 'wrongPassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body,
      { error: 'InvalidLogin', message: 'username or password is incorrect' }
    )})

  test('empty request body returns 401 Unauthorized status code', async () => {
    const response = await api
      .post('/api/login')
      .send({})
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body,
      { error: 'InvalidLogin', message: 'username or password is incorrect' }
    )})
})

after( async () => {
  await mongoose.connection.close()
})
