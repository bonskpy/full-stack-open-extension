const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../middleware')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user._id,
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1 })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogToBeDeleted = await Blog.findById(request.params.id)
  if (!blogToBeDeleted) {
    return response.status(404).json({
      error: 'NotFound',
      message: 'blog not found',
    })
  }

  const currentUser = await request.user
  if (!blogToBeDeleted.user.equals(currentUser._id)) {
    return response.status(403).json({
      error: 'Forbidden',
      message: 'you can only remove entries you own',
    })
  }

  await Blog.deleteOne({ _id: request.params.id })
  currentUser.blogs = currentUser.blogs.filter(
    (b) => b.toString() !== blogToBeDeleted._id.toString(),
  )
  await currentUser.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  jwt.verify(request.token, SECRET)

  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { returnDocument: 'after', runValidators: true },
  ).populate('user', { username: 1 })

  return updated ? response.json(updated) : response.status(404).end()
})

module.exports = blogsRouter

/*
POST /api/blogs (blogs.js:20-24): if a user is deleted after their token was issued, user is null and user._id throws.
DELETE /api/blogs/:id (blogs.js:36-39): if the blog doesn't exist, blogToBeDeleted.user throws. Verify the token first, then return 404 when the blog is missing. When the user isn't the owner, return 403, not 401: the user is logged in but not allowed to delete it.
*/
