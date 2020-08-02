const express = require('express');
const buildRoute = require('./build');
const exploreRoute = require('./explore');
const dashboardRoute = require('./dashboard');
const discussRoute = require('./discuss');
const groupRoute = require('./group');
const router = express.Router();

router.use(buildRoute);
router.use(exploreRoute);
router.use(dashboardRoute);
router.use(discussRoute);
router.use(groupRoute);

module.exports = router;