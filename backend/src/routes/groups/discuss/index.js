const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
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