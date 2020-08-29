const express = require('express');
const router = express.Router();
const discussRoute = require('./discuss');
const askRoute = require('./ask');
const buddiesRoute = require('./buddies');
const fileRoute = require('./file');

const Group = require('../../models/group');
router.use("/:id", function (req, res, next) {
    Group.findById(req.params.id, function (err, foundedGroup) {
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
router.use(buddiesRoute);
router.use(fileRoute);
module.exports = router;