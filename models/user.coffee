###
User Model
###

mongoose = require('mongoose')
Schema = mongoose.Schema

User = new Schema
  name: { type: String, index: true }
  email: { type: String, unique: true }
  pwd: String
  url: String
  avatarUrl: String
  location: String
  signature: String
  createTime: Date
  articleCount: { Type: Number, default: 0 }
  isActive: Boolean

module.exports = mongoose.model('User', User)