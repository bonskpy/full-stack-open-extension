const jwt = require('jsonwebtoken')
const { SECRET } = require('./utils/config')
const User = require('./models/user')

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {

  if (error.name === 'ValidationError'){
    return response.status(400).json({ 'error': 'ValidationError', message: error.message })
  }

  else if (error.name === 'CastError'){
    return response.status(400).json({ 'error': 'CastError', message: 'Missing or malformed user id' })
  }

  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(409).json({ error: 'username has to be unique' })
  }

  else if (error.name === 'TokenExpiredError'){
    return response.status(401).json({ error: 'TokenExpiredError', message: 'Token is expired' })
  }

  else if (error.name === 'JsonWebTokenError'){
    return response.status(401).json({ error: 'JsonWebTokenError', message: error.message })
  }

  return response.status(500).json({ 'error': 'Inernal server error', message: 'Something went wrong' })
}


const tokenExtractor = (request, response, next) => {
  const authorizationHeader  = request.get('Authorization')
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')){
    request.token = authorizationHeader.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, SECRET)
  if (!decodedToken.id){
    return response.status(401).json({ error: 'token is invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user){
    return response.status(401).json({ error: 'user not found' })
  }
  request.user = user
  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor }
