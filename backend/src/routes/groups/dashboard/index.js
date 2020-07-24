const express = require('express');
const router = express.Router();
const Group = require('../../../models/group');
const User = require('../../../models/user');

router.get('/dashboard/:id', function(req, res) {
  Group.findById(req.params.id).populate("comments").exec(function (err, foundGroup) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('groups/group-details-member-view',{group : foundGroup});
    }
  })
});

router.get('/dashboard', function(req, res) {
  User.findById(req.user._id).populate("groups").exec(function(err, users) {
    if (err) {
      console.log(err);
      res.render('groups/dashboard', {'groups' : []});
    }
    else {
      attendedGroups = users.groups.filter(group => group.owners.indexOf(req.user._id) < 0);
      res.render('groups/dashboard', {'groups' : attendedGroups});
    }
  })
});


module.exports = router;