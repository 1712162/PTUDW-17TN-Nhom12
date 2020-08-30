const express = require('express');
const router = express.Router();
const Post = require('../../../models/post');
const Group = require('../../../models/group');
const Message = require('../../../models/message');

router.get("/:groupID/ask", (req, res) => {
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
                    res.render("chat/ask.ejs",
                        {group: foundGroup, messages: messages});
                }
            )
        }
    });
})

router.post("/:id/ask", (req, res) => {
   let post = req.body.post;
   post.author_id = req.user._id;
   post.author_name = req.user.username;
   post.author_image ={... req.user.profile_image};
   Post.create(post, function(err, newPost) {
    if (err) {
        req.flash("error", "Post failed");
        res.redirect("/chat/" + req.params.id + "/ask");
    }
    else {

        Group.findById(req.params.id, function(err, foundedGroup) {
            if (err) {
                req.flash("error", "Post failed");
                res.redirect("/chat/" + req.params.id + "/ask");
            }
            else {
                foundedGroup.discuss.push(newPost._id);
                foundedGroup.save();
                res.redirect("/chat/" + req.params.id);
            }
        })
    }
   })
})
module.exports = router;