const express = require('express');
const router  = express.Router();

router.get('/explore', function(req, res) {
  res.render('groups/explore');
});

router.get('/dashboard', function(req, res) {
  res.render('groups/dashboard');
});


router.get('/build', function(req, res) {
  res.render('groups/build');
});

router.post('/build', function(req, res) {
  console.log(req.body.group)

})

router.get('/discuss', function(req, res) {
  res.render('groups/discuss');
});

module.exports = router;