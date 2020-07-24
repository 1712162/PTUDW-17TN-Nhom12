const express = require('express');
const buildRoute = require('../groups/build');
const exploreRoute = require('../groups/explore');
const dashboardRoute = require('../groups/dashboard'); 
const discussRoute = require('../groups/discuss');
const router  = express.Router();

router.use(buildRoute);
router.use(exploreRoute);
router.use(dashboardRoute);
router.use(discussRoute);

module.exports = router;