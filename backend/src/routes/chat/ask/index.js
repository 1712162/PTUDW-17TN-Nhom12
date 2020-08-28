const express = require('express');
const router = express.Router();
const Post = require('../../../models/post');
const Group = require('../../../models/group');
router.get("/:id/ask", (req, res) => {
    res.render("chat/ask.ejs");
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