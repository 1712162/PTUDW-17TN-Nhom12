const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  group_name : {
    type: String,
    required: true
  },
  description : String,
  cover_image : {
    type : String,
    default : ""
  },
  view_mode : {
    type : Boolean,
    default : false
  },
  stars : {
    type : Number,
    default : 0
  },
  owners : [{
    type : mongoose.Types.ObjectId,
    ref : "User"
  }],
   status : {
     type : Boolean,
     default : true
   },
   created_at : {
     type : Date,
     default : Date.now()
   },
   members : [{
     type : mongoose.Types.ObjectId,
     ref : "User"
   }],
   comments : [{
     type : mongoose.Types.ObjectId,
     ref : "Comment"
   }],
   files : [{
     type : mongoose.Types.ObjectId,
     ref : "File"
   }],
   discuss : [{
     type : mongoose.Types.ObjectId,
     ref : "Post"
   }],
   announcements : [{
    type : mongoose.Types.ObjectId,
    ref : "Post"
  }],
  waiting_list : [{
    type : mongoose.Types.ObjectId,
    ref : "User"
  }],
  chat : [{
    type : mongoose.Types.ObjectId,
    ref : "Chat"
  }]      
})

module.exports = mongoose.model("Group", GroupSchema);