const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (username === '' || username === undefined) {
    return response.status(401).json({
      error: 'InvalidLogin',
      message: 'username or password is incorrect',
    })
  }

  if (
    password === '' ||
    password === undefined ||
    typeof password !== 'string'
  ) {
    return response.status(401).json({
      error: 'InvalidLogin',
      message: 'username or password is incorrect',
    })
  }

  const user = await User.findOne({ username })
  if (!user) {
    return response.status(401).json({
      error: 'InvalidLogin',
      message: 'username or password is incorrect',
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'InvalidLogin',
      message: 'username or password is incorrect',
    })
  }

  const tokenData = {
    username: user.username,
    name: user.name,
    id: user._id,
  }
  const token = jwt.sign(tokenData, SECRET, { expiresIn: 60 * 60 })
  const payload = {
    ...tokenData,
    token,
  }
  return response.status(200).json(payload)
})

module.exports = loginRouter
