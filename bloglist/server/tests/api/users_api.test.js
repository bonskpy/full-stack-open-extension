const { describe, test, beforeEach, before, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../../models/user')
const app = require('../../app')
const bcrypt = require('bcrypt')
const assert = require('node:assert')


const api = supertest(app)

before( async () => {
  // database has to finish index generation for users
  // test for duplicate may fail in some cases without this step
  await User.init()
})

beforeEach( async () => {
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

describe('POST /api/users', () => {

  test('new unique user is correctly added to the database and returns transformed JSON', async () => {

    const user = {
      name: 'Natalia',
      username: 'nczak',
      password: 'piesek'
    }
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(await User.countDocuments(), 2)
    assert.strictEqual(response.body.username, 'nczak')
    assert.ok('id' in response.body, 'response should expose id property instead of _id')
    assert.ok('_id' in response.body === false, 'response must not expose _id')
    assert.ok('passwordHash' in response.body === false, 'response must not expose passwordHash')
  })

  test('password is not stored in plain text', async () => {

    const user = {
      name: 'Natalia',
      username: 'nczak',
      password: 'piesek'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newUserInDB = await User.findOne({ username: 'nczak' })
    assert.notStrictEqual(newUserInDB.passwordHash, 'piesek')
    assert.ok(await bcrypt.compare('piesek', newUserInDB.passwordHash))

  })

  test('duplicate user is not added to the database and returns 400 (Bad request)', async () => {

    const duplicate = {
      username: 'jwiewiorka',
      name: 'Jan Wiewiórka',
      password: 'testPassword',
    }
    const response = await api
      .post('/api/users')
      .send(duplicate)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body, { error: 'username has to be unique' })
    assert.strictEqual(await User.countDocuments(), 1)
  })

  test('new user is not allowed to have username with less than 3 characters', async () => {
    const shortUsername = { username: 'ab', name: 'Alan Becjusz', password: 'haslo' }
    const response = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    assert.deepStrictEqual(response.body, { error: 'username should be at least 3 characters long' })
    assert.strictEqual(await User.countDocuments(), 1)
  })

  test('new user is not allowed to have password with less than 3 characters', async () => {
    const shortPassword = { username: 'abecjusz', name: 'Alan Bbecjusz', password: 'hs' }
    const response = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)

    assert.deepStrictEqual(response.body, { error: 'password should be at least 3 characters long' })
    assert.strictEqual(await User.countDocuments(), 1)
  })

  test('new user has to have a username', async () => {
    const noUsername = { username: '', name: 'Alan Bbecjusz', password: 'hs' }
    const response = await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)

    assert.deepStrictEqual(response.body, { error: 'username and password are required' })
    assert.strictEqual(await User.countDocuments(), 1)
  })

  test('new user has to have a password', async () => {
    const noPassword = { username: 'abecjusz', name: 'Alan Bbecjusz' }
    const response = await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)

    assert.deepStrictEqual(response.body, { error: 'username and password are required' })
    assert.strictEqual(await User.countDocuments(), 1)
  })

  test('password that is not a string returns 400', async () => {
    const noPassword = { username: 'abecjusz', name: 'Alan Bbecjusz' }
    const response = await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)

    assert.deepStrictEqual(response.body, { error: 'username and password are required' })
    assert.strictEqual(await User.countDocuments(), 1)
  })

})

after( async () => {
  await mongoose.connection.close()
})
