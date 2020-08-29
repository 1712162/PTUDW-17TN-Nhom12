const express = require('express');
const router = express.Router();
const Post = require('../../../models/post');
const Group = require('../../../models/group');

router.get("/:id/buddies", (req, res) => {
  const str = req.originalUrl;
  const groupId = str.slice(str.indexOf("/", 1) + 1, str.lastIndexOf("/"));

  Group.findById(groupId)
    .populate("members")
    .populate("owners")
    .exec(function (err, foundGroup) {
      if (err) {
        console.log(err)
        return;
      }
      const members = [];
      foundGroup.members.forEach((item) => {
        members.push(item);
      });
      foundGroup.owners.forEach((item) => {
        members.push(item);
      });
      res.render("chat/buddies.ejs", { groupMembers: members });
    });
});


module.exports = router;