const express = require('express');
const router = express.Router();
router.get("/:id/ask", (req, res) => {
    res.render("chat/ask.ejs");
})
module.exports = router;