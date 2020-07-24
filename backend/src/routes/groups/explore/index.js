const express = require('express');
const router = express.Router();
const Group = require('../../../models/group');

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
  console.log(req.query.search);
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

module.exports = router;