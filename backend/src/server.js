require('dotenv').config({path : "../.env"});
const mongoose = require('mongoose');
const init = require('./routes');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is running");
  })
  .catch(err => {
    console.log(err);
  })

init.init();

// const User = require('./models/user');
// const Group = require('./models/group');

// User.findById("5f261b7ac822e3178467c517", (err, data) => {
//   data.groups.myenrollrequestgroup = data.groups.myenrollrequestgroup.filter((group) => {
//     return group.group.toString() !== "5f261b42c822e3178467c513";
//   });
//   data.save();
//   console.log(data.groups.myowngroup);
//   console.log(typeof data.groups.myowngroup);
// });
