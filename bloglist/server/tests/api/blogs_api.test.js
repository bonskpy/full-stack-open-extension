const supertest = require('supertest')
const { before, beforeEach, describe, test, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const app = require('../../app')
const Blog = require('../../models/blog')
const { createTestBlogs, createTestUser } = require('../fixtures')
const bcrypt = require('bcrypt')
const User = require('../../models/user')

const api = supertest(app)
const testUser = createTestUser()
const testBlogs = createTestBlogs()

before(async () => {
  const passwordHash = await bcrypt.hash('testPassword', 10)
  testUser.passwordHash = passwordHash
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = await new User(testUser).save()

  const blogs = await Blog.insertMany(
    testBlogs.map((b) => ({ ...b, user: user._id })),
  )
  user.blogs = blogs.map((blog) => blog._id)
  await user.save()
})

describe.only('GET /api/blogs', () => {
  test('response is in JSON format', { timeout: 5000 }, async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('request returns correct number of documents', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
  })

  test('response exposes .id instead of ._id property', async () => {
    const response = await api.get('/api/blogs')
    assert(
      'id' in response.body[0] === true,
      'response should expose .id  instead of ._id property',
    )
    assert(
      '_id' in response.body[0] === false,
      'response should not expose ._id property',
    )
  })

  test('response does not expose .__v proporty', async () => {
    const response = await api.get('/api/blogs')
    assert(
      '__v' in response.body[0] === false,
      'response should not expose .__v property',
    )
  })

  test('response has populated user property with correct data', async () => {
    const response = await api.get('/api/blogs')
    assert(
      'user' in response.body[0] === true,
      'response should return user property',
    )
    assert.deepEqual(response.body[0].user, {
      username: testUser.username,
      id: testUser._id,
    })
  })
})

describe('POST /api/blogs', () => {
  test('new blog is saved in the database', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    }

    await api.post('/api/blogs').send(newBlog).expect(201)
    const blogsInDB = await Blog.find({})

    const response = await api.get('/api/blogs')
    const contents = response.body.map((r) => r.title)

    assert.strictEqual(blogsInDB.length, testBlogs.length + 1)
    assert(contents.includes('First class tests'))
  })
  test(
    'if the likes property is missing it will default to 0',
    {
      timeout: 5000,
    },
    async () => {
      const blog = {
        title: 'Shaping the future of advanced robotics',
        author: 'The Google DeepMind Robotics Team',
        url: 'https://deepmind.google/blog/shaping-the-future-of-advanced-robotics/',
      }

      await api.post('/api/blogs').send(blog).expect(201)
      const countZeroLikes = await Blog.countDocuments({ likes: 0 })
      assert.strictEqual(countZeroLikes, 1)
    },
  )
  test(
    'if the title or url properties are missing the status code is 400 (Bad Request)',
    { timeout: 5000 },
    async () => {
      const noTitle = {
        author: 'Flavio Copes',
        url: 'https://flaviocopes.com/node-builtins/',
        likes: 1,
      }
      const noUrl = {
        title: 'Node.js built-ins that replaced npm packages',
        author: 'Flavio Copes',
        likes: 1,
      }

      await api.post('/api/blogs').send(noTitle).expect(400)
      await api.post('/api/blogs').send(noUrl).expect(400)
    },
  )
})

describe('DELETE /api/blogs/:id', () => {
  test('post with correct id is removed from the database', async () => {
    const initlalBlogCount = await Blog.countDocuments({})
    const arbitraryBlog = await Blog.findOne({})

    await api.delete(`/api/blogs/${arbitraryBlog._id}`).expect(204)

    const finalBlogCount = await Blog.countDocuments({})
    assert.strictEqual(initlalBlogCount - 1, finalBlogCount)

    const blogExists = await Blog.exists({ _id: arbitraryBlog._id })
    assert.strictEqual(blogExists, null)
  })
  test(
    'when valid blog id is not present in the database the status code is 404 (Not found)',
    { timeout: 5000 },
    async () => {
      const fakeId = '6ab23727c3fdf28711111111'
      await api.delete(`/api/blogs/${fakeId}`).expect(404)
    },
  )
  test(
    'when malformed blog id is passed the status code is 400 (Bad request)',
    { timeout: 5000 },
    async () => {
      const malformedId = '1111111'
      await api.delete(`/api/blogs/${malformedId}`).expect(400)
    },
  )
})

describe('PUT /api/blogs/:id', () => {
  test(
    'updates documents in the database and returns valid JSON',
    { timeout: 5000 },
    async () => {
      const newData = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
      }

      const arbitratyBlog = await Blog.findOne({})

      const response = await api
        .put(`/api/blogs/${arbitratyBlog._id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(
        {
          title: response.body.title,
          author: response.body.author,
          url: response.body.url,
          likes: response.body.likes,
        },
        newData,
      )

      const updatedBlog = await Blog.findOne({ _id: arbitratyBlog._id })
      assert.strictEqual(updatedBlog.title, newData.title)
      assert.strictEqual(updatedBlog.author, newData.author)
      assert.strictEqual(updatedBlog.url, newData.url)
      assert.strictEqual(updatedBlog.likes, newData.likes)
    },
  )
  test(
    'valid blog id reutrns 404 (Not found) if not in the database',
    { timeout: 5000 },
    async () => {
      const newData = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      }

      const request = await api
        .put('/api/blogs/11113727c3fdf287031b1111')
        .send(newData)
        .expect(404)

      console.log(request.body)
    },
  )
  test(
    'malformed blog id returns 400 (Bad request)',
    { timeout: 5000 },
    async () => {
      const newData = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      }

      await api.put('/api/blogs/1111').send(newData).expect(400)
    },
  )
  test(
    'values are not overwritten with udenfined when request does not pass changes',
    { timeout: 5000 },
    async () => {
      const newData = { likes: 69 }
      const arbitraryBlog = await Blog.findOne({})

      const response = await api
        .put(`/api/blogs/${arbitraryBlog._id}`)
        .send(newData)
        .expect(200)

      assert.strictEqual(response.body.likes, newData.likes)
    },
  )
})

after(async () => {
  await mongoose.connection.close()
})
