const Group = require("../../../models/group");
const User = require("../../../models/user");

const express = require('express');
const router = express.Router();
router.get("/:groupID", (req, res) => {
    Group.findById(req.params.groupID, function (err, foundGroup) {
        if (err) {
            return res.redirect("/");
        } else {
            res.render("chat/chat.ejs", {group: foundGroup});
        }
    });

})
module.exports = router;