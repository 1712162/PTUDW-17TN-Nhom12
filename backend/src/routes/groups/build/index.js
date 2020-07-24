const express = require('express');
const router = express.Router();
const Group = require('../../../models/group');
const User = require('../../../models/user');

router.get('/build', function(req, res) {
  User.findById(req.user._id).populate("groups").exec(function(err, users) {
    if (err) {
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
      req.flash("error", err.message);
      return res.redirect("/groups/build");
    }
    else {
      const groups = [...req.user.groups];
      groups.push(newGroup._id);
      User.findByIdAndUpdate(req.user._id, {groups}, function (err, user) {
        if (err) {
          req.flash("error", err.message);
          console.log(req.flash("error"));
          return res.redirect("/groups/build");
        }
        else {
          req.flash("success", "New group has been created!");
          return res.redirect("/groups/build")
        }
      })
    }
  });
})


router.get('/build/:id', function(req, res) {
  Group.findById(req.params.id).populate(["comments","waiting_list"]).exec(function (err, foundGroup) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('groups/group-details-admin-view',{group : foundGroup});
    }
  })
});

module.exports = router;