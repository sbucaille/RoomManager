var express = require('express');
var router = express.Router();
let config = require('../auth');
let checkIdentity = require('./custommodules/externalConnections/checkIdentity');

/* GET home page. */
router.get('/', checkIdentity, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/testIFTTT', checkIdentity, function(req, res, next){
    console.log(req.body);
    res.sendStatus(200);
    res.render('index', { title: 'Express' });
});

module.exports = router;
