var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/public', function(req, res, next) {
  res.render('public', { user: req.user });
});

router.get('/data', function(req, res, next) {
  res.render('data', { user: req.user });
});

module.exports = router;
