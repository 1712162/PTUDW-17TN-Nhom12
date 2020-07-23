const express = require('express');
const Group = require('../../models/group');
const User = require('../../models/user');
const router  = express.Router();

router.get('/explore/:id', function(req, res) {
  Group.findById(req.params.id).populate("comments").exec(function (err, foundGroup) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('groups/group-details-user-view',{group : foundGroup});
    }
  })
});

router.get('/explore', function(req, res) {
  Group.find({"view_mode" : true}, function(err, groups) {
    if (err) {
      console.log(err);
    }
    else {
      newGroups = groups.filter(group => group.owners.indexOf(req.user._id) < 0);
      res.render('groups/explore', {'groups' : newGroups});
    }
  })
});

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

router.get('/build/:id', function(req, res) {
  Group.findById(req.params.id).populate("comments").exec(function (err, foundGroup) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('groups/group-details-admin-view',{group : foundGroup});
    }
  })
});


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

router.get('/discuss', function(req, res) {
  User.findById(req.user._id).populate("groups").exec(function(err, users) {
    if (err) {
      console.log(err);
      res.render('groups/discuss', {'groups' : []});
    }
    else {
      res.render('groups/discuss', {'groups' : users.groups});
    }
  })
});

module.exports = router;