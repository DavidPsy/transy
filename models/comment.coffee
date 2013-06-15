###
Article Comment Model
###

mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

Comment = new Schema
  _id: ObjectId
  user: { Type: ObjectId, ref: 'User' }
  article: { Type: ObjectId, ref: 'Article' }
  content: String
  time: Date

module.exports = mongoose.model('Comment', User)