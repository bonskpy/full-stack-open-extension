const express = require('express')
const path = require('node:path')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { MONGODB_URI } = require('./utils/config')
const { errorHandler, tokenExtractor } = require('./middleware')
const morgan = require('morgan')

const app = express()

mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to mongo', MONGODB_URI)
  })
  .catch((err) => {
    console.log('error', err.message)
  })

app.get('/api/ping', (req, res) => {
  res.json({ message: 'ping', time: new Date().toISOString() })
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('combined'))
app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'testing') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '..client/dist/index.html'))
  })
}

app.use(errorHandler)

module.exports = app
