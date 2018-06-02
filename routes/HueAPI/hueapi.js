var express = require('express');
var router = express.Router();
let config = require('../../auth');
let checkIdentity = require('../custommodules/externalConnections/checkIdentity');

/* GET home page. */
router.get('/', checkIdentity, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.put('/testHue', function(req, res, next){
    console.log(req.body);
    console.log("Bouton appuyé");
    res.sendStatus(200);
});

module.exports = router;
