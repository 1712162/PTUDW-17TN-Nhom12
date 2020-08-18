const express = require("express");
const router = express.Router();
const Group = require("../../../models/group");
const User = require("../../../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/:id/enroll", function (req, res) {
  Group.update(
    { _id: ObjectId(req.params.id) },
    { $addToSet: { waiting_list: req.user._id } },
    function (err, updatedGroup) {
      if (err) {
        console.log(err);
      } else {
        // console.log(updatedGroup);
        res.contentType("application/json");
        var data = JSON.stringify("You've enrolled successfully");
        res.header("Content-Length", data.length);
        res.end(data);
      }
    }
  );
});

router.get("/:id/edit", function (req, res) {
  Group.findById(req.params.id, function (err, foundGroup) {
    if (err) {
      return res.redirect("/groups/build/" + req.param.id);
    } else {
      res.render("groups/settings", { group: foundGroup });
    }
  });
});

router.post("/edit/accesssetting", (req, res) => {
  Group.findById(req.body.groupid).exec((err, group) => {
    if (err) {
      console.error(err);
      return res.redirect("/groups/build/" + req.body.groupid);
    } else {
      if (req.body.accessmode === "private") {
        group.view_mode = false;
      } else {
        group.view_mode = true;
      }
      group
        .save()
        .then(() => res.redirect("/groups/build/" + req.body.groupid));
    }
  });
});

router.post("/edit/deletegroup", (req, res) => {
  Group.findById(req.body.groupid).exec((err, group) => {
    if (err) {
      console.log(err);
    } else {
      group.status = false;
      group.save().then(() => res.redirect("/groups/build/"));
    }
  });
});

router.post("/edit/changegroupinfo", upload.single("picture"), (req, res) => {
  var encode_image = "";
  console.log(req.file);
  if (req.file) {
    const image = req.file.buffer;
    encode_image = image.toString("base64");
  }

  Group.findById(req.body.groupid).exec((err, group) => {
    if (err) {
      console.error(err);
    } else {
      group.description = req.body.groupdescription;
      group.group_name = req.body.groupname;
      if (encode_image !== "") {
        group.cover_image.data = encode_image;
        group.cover_image.mimetype = req.file.mimetype;
      }
      group
        .save()
        .then(() => res.redirect("/groups/build/" + req.body.groupid));
    }
  });
});

module.exports = router;
