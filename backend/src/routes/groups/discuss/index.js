const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
const user = require("../../../models/user");
router.get("/discuss", function (req, res) {
  const searchKey = req.query.group || "";
  User.findById(req.user._id)
    .populate("groups.myjoingroup.group")
    .populate("groups.myowngroup.group")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        res.render("groups/discuss", { groups: [] });
      } else {
        const newGroups = [];

        user.groups.myowngroup.forEach((group) => {
          const newGroup = {
            ...group.group._doc,
            cover_image: `data:${group.group.cover_image.mimetype};base64,${group.group.cover_image.data}`,
          };
          if (newGroup.status === true) newGroups.push(newGroup);
        });

        user.groups.myjoingroup.forEach((group) => {
          const newGroup = {
            ...group.group._doc,
            cover_image: `data:${group.group.cover_image.mimetype};base64,${group.group.cover_image.data}`,
          };
          if (newGroup.status === true) newGroups.push(newGroup);
        });
        let filteredGroups = newGroups.filter((group) =>
          group.group_name.includes(searchKey) && group.status
        );
        res.render("groups/discuss", { groups: filteredGroups });
      }
    });
});

module.exports = router;
