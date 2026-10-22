const app = require('../../app')
const supertest = require('supertest')
const { describe, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const User = require('../../models/user')
const Blog = require('../../models/blog')

const api = supertest(app)

describe('testingRouter /reset', () => {
  test('empty post request clears the database', async () => {
    await api.post('/api/testing/reset').expect(204)

    assert.strictEqual(await User.countDocuments(), 0)
    assert.strictEqual(await Blog.countDocuments(), 0)
  })
})

after( () => {
  mongoose.connection.close()
})
