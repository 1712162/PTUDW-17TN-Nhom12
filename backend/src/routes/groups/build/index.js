const express = require("express");
const router = express.Router();
const Group = require("../../../models/group");
const User = require("../../../models/user");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/build/:id", function (req, res) {
  Group.findById(req.params.id)
    .populate(["comments", "waiting_list.userenroll"])
    .exec(function (err, foundGroup) {
      if (err) {
        console.log(err);
      } else {
        res.render("groups/group-details-admin-view", { group: foundGroup });
      }
    });
});

router.get("/build", function (req, res) {
  const searchKey = req.query.group || "";

  User.findById(req.user._id)
    .populate("groups.myowngroup.group")
    .exec(function (err, users) {
      if (err) {
        res.render("groups/build", { groups: [] });
      } else {
        let ownGroups = users.groups.myowngroup;
        let filteredGroups = ownGroups.filter((group) =>
          group.group.group_name.includes(searchKey)
        );
        res.render("groups/build", { groups: filteredGroups });
      }
    });
});

router.post("/build", upload.single("picture"), (req, res) => {
  let group = req.body.group;
  var encode_image = "";
  if (req.file) {
    const image = req.file.buffer;
    encode_image = image.toString("base64");
  }
  if (encode_image) {
    group.cover_image = {
      data: encode_image,
      mimetype: req.file.mimetype
    }
  }
  group["view_mode"] = "on" ? 0 : 1;
  group["max_number"] = Number(group["max_number"]);
  group["owners"] = [];
  group["owners"].push(req.user._id);
  Group.create(group, function (err, newGroup) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/groups/build");
    } else {
      const groups = {
        myowngroup: [...req.user.groups.myowngroup], 
        myjoingroup: [...req.user.groups.myjoingroup],
        myenrollrequestgroup: [...req.user.groups.myenrollrequestgroup]
      };
      groups.myowngroup.push({group : newGroup._id});
      User.findByIdAndUpdate(req.user._id, { groups }, function (err, user) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/groups/build");
        } else {
          req.flash("success", "New group has been created!");
          return res.redirect("/groups/build");
        }
      });
    }
  });
});

module.exports = router;
