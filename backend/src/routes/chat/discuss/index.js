const express = require('express');
const router = express.Router();
router.get("/:groupID", (req, res) => {
    console.log(req.params)
    res.render("chat/chat.ejs", {groupName: req.params.groupID});
})
module.exports = router;