const express = require('express')
const router  = express.Router()
const Group   = require('../../../models/group')
const ObjectId = require('mongoose').Types.ObjectId;
router.post("/:id/enroll", function(req, res) {
  Group.update({"_id" : ObjectId(req.params.id)}, {$addToSet : {"waiting_list" : req.user._id}}, function(err, updatedGroup) {
    if (err) {
      console.log(err);
    }
    else {
     // console.log(updatedGroup);
      res.contentType('application/json');
      var data = JSON.stringify("You've enrolled successfully")
      res.header('Content-Length', data.length);
      res.end(data);
    }
  })
})

router.get("/:id/edit", function(req, res) {
  Group.findById(req.params.id, function(err, foundGroup) {
    if (err) {
      return res.redirect("/groups/build/" + req.param.id);
    }
    else {
      res.render("groups/settings", {group : foundGroup});
    }
  })
})

module.exports = router;