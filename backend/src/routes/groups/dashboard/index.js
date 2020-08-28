const express = require("express");
const router = express.Router();
const Group = require("../../../models/group");
const User = require("../../../models/user");
const Comment = require("../../../models/comment");
router.get("/dashboard/:id", function (req, res) {
  Group.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundGroup) {
      if (err) {
        console.log(err);
      } else {
        const newGroup = {
          ...foundGroup._doc,
          cover_image: `data:${foundGroup.cover_image.mimetype};base64,${foundGroup.cover_image.data}`,
        };
        if (newGroup.status === true)
          res.render("groups/group-details-member-view", { group: newGroup });
        else res.render("groups/group-details-member-view", { group: [] });
      }
    });
});

router.get("/dashboard", function (req, res) {
  const searchKey = req.query.group || "";
  User.findById(req.user._id)
    .populate("groups.myjoingroup.group")
    .exec(function (err, user) {
      if (err) {
        console.error(err);
        res.render("groups/dashboard", { groups: [] });
      } else {
        const dashboardGroup = user.groups.myjoingroup.filter((group) => {
          return group.group.status === true;
        });
        let filteredGroups = dashboardGroup.filter((group) =>
          group.group.group_name.includes(searchKey)
        );
        res.render("groups/dashboard", { groups: filteredGroups });
      }
    });
});

router.post("/dashboard/leavegroup", (req, res) => {
  User.findById(req.user._id).exec((err, foundUser) => {
    if (err) {
      res.redirect("/groups/dashboard");
    } else {
      foundUser.groups.myjoingroup = foundUser.groups.myjoingroup.filter(
        (group) => {
          return group.group.toString() !== req.body.groupid;
        }
      );
      foundUser.save();
      Group.findById(req.body.groupid).exec((err, foundGroup) => {
        if (err) {
          req.flash("error", err.message);
          res.redirect("/groups/dashboard");
        } else {
          const comment = {
            author_id : foundUser._id,
            author_name : foundUser.username,
            author_image : foundUser.profile_image,
            content : req.body.comment || "Leave without comment",
          }
          Comment.create(comment, function(err, createdComment)  {
            if (err) {
              req.flash("error", err.message);
              res.redirect("/groups/dashboard");
            }
            else {
                foundGroup.comments.push(createdComment._id);
                foundGroup.members = foundGroup.members.filter((member) => {
                return req.user._id.toString() !== member.toString();
              });
              foundGroup.save();
              req.flash("success","You have left the group");
              res.redirect("/groups/dashboard");
            }
          })
        }
      });
    }
  });
});

module.exports = router;
