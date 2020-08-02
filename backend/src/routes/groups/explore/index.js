const express = require('express');
const router = express.Router();
const Group = require('../../../models/group');
const User = require('../../../models/user');
const user = require('../../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/explore/:id', function (req, res) {
  Group.findById(req.params.id).populate("comments").exec(function (err, foundGroup) {
    if (err) {
      console.log(err);
    }
    else {
      var check = false;
      User.findById(req.user._id).exec(function (err, user) {
        if (err) {
          console.log(err);
        } else {
          user.groups.myenrollrequestgroup.forEach((group) => {
            if (group.group.toString() === req.params.id.toString()) {
              check = true;
            }
          });
          const group = {
            ...foundGroup._doc,
            cover_image: `data:${foundGroup.cover_image.mimetype};base64,${foundGroup.cover_image.data}`,
            alreadyenroll: check,
          };
          if (group.status)
            res.render('groups/group-details-user-view', { group: group });
          else
            res.render('groups/group-details-user-view', { group: [] });
        }
      });
    }
  })
});

router.get('/explore', function (req, res) {
  Group.find({ "view_mode": true }, function (err, groups) {
    if (err) {
      console.log(err);
      res.render('groups/explore', { 'groups': [] });
    }
    else {
      const newGroups = [];
      groups.forEach(group => {
        const newGroup = {
          _id: group._id,
          cover_image: `data:${group.cover_image.mimetype};base64,${group.cover_image.data}`,
          group_name: group.group_name,
          members: group.members,
          created_at: group.created_at,
          stars: group.stars,
        }
        var check = false;

        newGroup.members.forEach(memberId => {
          if (memberId.toString() == req.user._id.toString())
            check = true;
        });

        if (check === false && group.status === true)
          newGroups.push(newGroup);
      });
      res.render('groups/explore', { 'groups': newGroups });
    }
  })
});

router.post('/explore/enroll', function (req, res) {
  Group.findById(req.body.group_id_enroll).exec((err, group) => {
    if (err) {
      console.error(err);
    } else {
      var check = true;
      group.waiting_list.forEach((user) => {
        if (user.userenroll.toString() === req.user._id.toString()) {
          check = false;
        }
      });
      if (check === true)
        group.waiting_list.push({ userenroll: req.user._id });
      group.save();

      User.findById(req.user._id).exec((err, user) => {
        if (err) {
          console.log(err);
        } else {
          var check = true;
          user.groups.myenrollrequestgroup.forEach(group => {
            if (group.group.toString() === req.body.group_id_enroll.toString()) {
              check = false;
            }
          });
          if (check === true) {
            user.groups.myenrollrequestgroup.push({ group: req.body.group_id_enroll });
            user.save();
          }
          res.redirect('/groups/explore/' + req.body.group_id_enroll);
        }
      });
    };
  });
});

module.exports = router;