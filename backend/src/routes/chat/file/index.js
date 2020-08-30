const express = require('express');
const router = express.Router();
const Post = require('../../../models/post');
const Group = require('../../../models/group');
const Message = require('../../../models/message');

router.get("/:groupID/file", (req, res) => {
  // const str = req.originalUrl;
  // const groupId = str.slice(str.indexOf("/", 1) + 1, str.lastIndexOf("/"));

  // Group.findById(groupId)
  //   .populate("members")
  //   .populate("owners")
  //   .exec(function (err, foundGroup) {
  //     if (err) {
  //       console.log(err)
  //       return;
  //     }
  //     const members = [];
  //     foundGroup.members.forEach((item) => {
  //       members.push(item);
  //     });
  //     foundGroup.owners.forEach((item) => {
  //       members.push(item);
  //     });
  //     res.render("chat/buddies.ejs", { groupMembers: members });
  //   });
  Group.findById(req.params.groupID, function (err, foundGroup) {
    if (err) {
        console.log(err);
    } else {
        let groupName = foundGroup.group_name;
        Message.find(
            {group_name: groupName},"author message date profile_image",
            (err, messages) => {
                messages.sort(function(a, b) {
                    let msgA = new Date(a.date);
                    let msgB = new Date(b.date);
                    if (msgA < msgB) return -1;
                    if (msgA > msgB) return 1;
                    return 0;
                });
                res.render("chat/file.ejs",
                    {group: foundGroup, messages: messages});
            }
        )
    }
  });
});


module.exports = router;