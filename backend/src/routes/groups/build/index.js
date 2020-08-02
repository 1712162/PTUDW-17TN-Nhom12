const express = require('express');
const multer = require('multer');
const router = express.Router();
const Group = require('../../../models/group');
const User = require('../../../models/user');
const fs = require('fs');
const { group } = require('console');
const mongoose = require('mongoose');
const { populate } = require('../../../models/group');
const ObjectId = mongoose.Types.ObjectId;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/build', function (req, res) {
  User.findById(req.user._id)
    .populate("groups.myowngroup.group")
    .exec(function (err, user) {
      if (err) {
        console.error(err);
        res.render('groups/build', { 'groups': [] });
      }
      else {
        const ownGroups = [];
        user.groups.myowngroup.forEach((group) => {
          const newGroup = {
            _id: group.group._id,
            cover_image: `data:${group.group.cover_image.mimetype};base64,${group.group.cover_image.data}`,
            group_name: group.group.group_name,
            members: group.group.members,
            created_at: group.group.created_at,
            stars: group.group.stars,
          };
          if (group.group.status === true)
            ownGroups.push(newGroup);
        });

        res.render('groups/build', { 'groups': ownGroups });
      }
    })
});

router.post('/build', upload.single('picture'), async (req, res) => {
  var groupObject;
  const owner_id = mongoose.Types.ObjectId(req.user._id);
  if (req.file) {
    const image = req.file.buffer;
    const encode_image = image.toString('base64');

    groupObject = {
      group_name: req.body.group.group_name,
      description: req.body.group.description,
      view_mode: req.body.group.view_mode === 'on' ? false : true,
      cover_image: {
        data: encode_image,
        mimetype: req.file.mimetype,
      },
      owners: [owner_id],
      members: [owner_id],
    };
  } else {
    groupObject = {
      group_name: req.body.group.group_name,
      description: req.body.group.description,
      view_mode: req.body.group.view_mode === 'on' ? true : false,
      owners: [owner_id],
      members: [owner_id],
    };
  }

  const newGroup = new Group(groupObject);
  await newGroup.save(function (err, group) {
    if (err) return console.error(err);
    else {
      User.findById(owner_id).exec((err, user) => {
        if (err) {
          console.error(err);
        } else {
          user.groups.myowngroup.push({ group: newGroup._id });
          user.save();
          return res.redirect("/groups/build");
        }
      });
    }
  });
});


router.get('/build/:id', function (req, res) {
  Group.findById(req.params.id)
    .populate('waiting_list.userenroll')
    .exec(function (err, foundGroup) {
      if (err) {
        console.error(err);
        res.redirect("/groups/build")
      }
      else {
        const group = {
          ...foundGroup._doc,
          cover_image: `data:${foundGroup.cover_image.mimetype};base64,${foundGroup.cover_image.data}`,
        };
        if (group.status === true)
          res.render('groups/group-details-admin-view', { group: group });
        else
          res.render('groups/group-details-admin-view', { group: [] });
      }
    })
});

router.post('/build/accept', function (req, res) {
  Group.findById(req.body.groupid)
    .exec(function (err, foundGroup) {
      if (err) {
        console.error(err);
        res.redirect("/groups/build/" + req.body.groupid);
      } else {
        foundGroup.members.push(ObjectId(req.body.userid));
        foundGroup.waiting_list = foundGroup.waiting_list.filter((user) => {
          return user.userenroll.toString() !== req.body.userid;
        });
        foundGroup.save();
        User.findById(req.body.userid)
          .exec(function (err, foundUser) {
            if (err) {
              console.error(err);
              res.redirect("/groups/build/" + req.body.groupid);
            } else {
              foundUser.groups.myjoingroup.push({ group: req.body.groupid });
              foundUser.groups.myenrollrequestgroup = foundUser.groups.myenrollrequestgroup.filter((group) => {
                return group.group.toString() !== req.body.groupid;
              });
              foundUser.save();
              console.log("Success");
              res.redirect("/groups/build/" + req.body.groupid);
            }
          });
      }
    });
});

router.post('/build/reject', function (req, res) {
  Group.findById(req.body.groupid)
    .exec(function (err, foundGroup) {
      if (err) {
        console.error(err);
        res.redirect("/groups/build/" + req.body.groupid);
      } else {
        foundGroup.waiting_list = foundGroup.waiting_list.filter((user) => {
          return user.userenroll.toString() !== req.body.userid;
        });
        foundGroup.save();
        User.findById(req.body.userid)
          .exec(function (err, foundUser) {
            if (err) {
              console.log(err);
              res.redirect("/groups/build/" + req.body.groupid);
            } else {
              foundUser.groups.myenrollrequestgroup = foundUser.groups.myenrollrequestgroup.filter((group) => {
                return group.group.toString() !== req.body.groupid;
              });
              foundUser.save();
              res.redirect("/groups/build/" + req.body.groupid);
            }
          })
      }
    })
});

module.exports = router;
