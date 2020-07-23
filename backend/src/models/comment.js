const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author_id: {
    type : mongoose.Types.ObjectId,
    ref : "User"
  },
  author_name: {
    type : String
  },
  author_image: {
    type: String
  },
  content: {
    type : String
  },
  created_at: {
    type : Date,
    default : Date.now()
  }
})

module.exports = mongoose.model("Comment", CommentSchema);