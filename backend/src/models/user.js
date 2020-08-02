const mongoose = require('mongoose');
const passwordLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: String,
  fullname: String,
  password: String,
  email: String,
  location: String,
  profile_image: {
    type: String,
    default: "https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80"
  },
  state: Boolean,
  followers: [{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }],
  groups: {
    myowngroup: [{
      group: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
      }
    }],
    myjoingroup: [{
      group: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
      }
    }],
    myenrollrequestgroup: [{
      group: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
      }
    }],
  }
});
UserSchema.plugin(passwordLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
