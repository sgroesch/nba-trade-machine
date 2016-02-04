var express = require('express');
var router = express.Router();
var Model = require('../models/Trade');


router.get('/', function(req, res, next) {
  Model.find( { public: true }, function(error, trades){
    if (error) console.log(error);
    res.render('public', { user: req.user, pageHeader: 'Public Trades', data: trades });
  });
});

router.get('/mytrades', function(req, res, next) {
  Model.find( { userId: req.user._id }, function(error, trades){
    if (error) console.log(error);
    res.render('mytrades', { user: req.user, pageHeader: 'My Trades', data: trades });
  });
});

router.post('/', function(req, res, next) {
  Model.create(req.body, function(error, trade){
    if (error) console.log(error);
    res.redirect('/trades');
  });
});

router.delete('/:id', function(req, res, next){
  Model.findByIdAndRemove(req.params.id, req.body, function(error,trade){
    if(error) console.log(error);
    res.redirect('/trades');
  });
});

module.exports = router;
