const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
    cast: '{VALUE} should be a string' },
  name: String,
  passwordHash: {
    type: String,
    required: true },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Blog' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
