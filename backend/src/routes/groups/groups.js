const express         =     require('express');
const buildRoute      =     require('../groups/build');
const exploreRoute    =     require('../groups/explore');
const dashboardRoute  =     require('../groups/dashboard'); 
const discussRoute    =     require('../groups/discuss');
const groupRoute      =     require('../groups/group'); 
const router  = express.Router();

router.use(buildRoute);
router.use(exploreRoute);
router.use(dashboardRoute);
router.use(discussRoute);
router.use(groupRoute);

module.exports = router;