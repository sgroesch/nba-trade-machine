var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { user: req.user, pageHeader: 'NBA Trade Checker' });
});

module.exports = router;
