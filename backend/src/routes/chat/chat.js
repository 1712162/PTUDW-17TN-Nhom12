const express = require('express');
const router = express.Router();
const discussRoute = require('./discuss')
router.use(discussRoute);
module.exports = router;