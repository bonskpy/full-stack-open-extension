const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true },
  likes: {
    type: Number,
    default: 0 },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

blogSchema.set('toJSON', {
  transform: (document, representation) => {
    representation.id = document._id
    delete representation._id
    delete representation.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
