const express = require('express');
const router = express.Router();
const Post = require('../../../models/post')
router.get("/:id/ask", (req, res) => {
    res.render("chat/ask.ejs");
})
router.post("/:id/ask", (req, res) => {
   console.log(req.body.post);
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
        res.redirect("/chat/" + req.params.id);
    }
   })
})
module.exports = router;