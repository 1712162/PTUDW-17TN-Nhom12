const express = require('express');
const router = express.Router();
const discussRoute = require('./discuss');
const askRoute = require('./ask');
const Group = require('../../models/group');
router.use("/:id", function(req, res, next) {
    Group.findById(req.params.id, function(err, foundedGroup) {
        if (err) {
            req.flash("error", err.message);
            next();
        }
        else {
            res.locals.group = foundedGroup;
            next();
        }
    })
})
router.use(askRoute);
router.use(discussRoute);
module.exports = router;