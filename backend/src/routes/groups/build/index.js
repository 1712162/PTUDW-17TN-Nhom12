const express = require('express');
const router = express.Router();
const Group = require('../../../models/group');
const User = require('../../../models/user');

router.get('/build', function(req, res) {
  User.findById(req.user._id).populate("groups").exec(function(err, users) {
    if (err) {
      console.log(err);
      res.render('groups/build', {'groups' : []});
    }
    else {
      ownGroups = users.groups.filter(group => group.owners.indexOf(req.user._id) >= 0);
      res.render('groups/build', {'groups' : ownGroups});
    }
  })
});

router.post('/build', function(req, res) {
  let group = req.body.group;
  group['view_mode'] = 'on' ? true : false;
  group['max_number'] = Number(group['max_number']);
  console.log(req.user);
  group['owners'] = [];
  group['owners'].push(req.user._id);
  if (group['cover_image']=='') delete group["cover_image"];
  Group.create(group, function(err, newGroup) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(newGroup);
      const groups = [...req.user.groups];
      groups.push(newGroup._id);
      User.findByIdAndUpdate(req.user._id, {groups}, function (err, user) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(user);
        }
      })
    }
  });
  res.redirect('/groups/build');
})


module.exports = router;