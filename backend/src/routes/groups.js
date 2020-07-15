const express = require('express');
const Group = require('../models/group');
const router  = express.Router();

router.get('/explore', function(req, res) {
  Group.find({"view_mode" : true}, function(err, groups) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('groups/explore', {'groups' : groups});
    }
  })
});

router.get('/dashboard', function(req, res) {
  res.render('groups/dashboard');
});


router.get('/build', function(req, res) {
  Group.find({"owners" : {"$in" : [req.user._id]}}, function(err, groups) {
    if (err) {
      console.log(err);
      res.render('groups/build', {'groups' : []});
    }
    else {
      res.render('groups/build', {'groups' : groups});
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
  Group.create(group, function(err, newGroup) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(newGroup);
    }
  });
  res.redirect('/groups/build');
})

router.get('/discuss', function(req, res) {
  Group.find({$or: [{"members" : {"$in" : [req.user._id]}}, {"owners" : {"$in" : [req.user._id]}}] }, function(err, groups){
    if (err) {
      console.log(err);
    }
    else {
      res.render('groups/discuss', {'groups': groups});
    }
  })
});

module.exports = router;