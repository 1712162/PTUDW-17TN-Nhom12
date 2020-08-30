const Group = require("../../../models/group");
const Message = require("../../../models/message");

const express = require('express');
const router = express.Router();
router.get("/:groupID", (req, res) => {
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
                    res.render("chat/chat.ejs",
                        {group: foundGroup, messages: messages});
                }
            )
        }
    });

})
module.exports = router;