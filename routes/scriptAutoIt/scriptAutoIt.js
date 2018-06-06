let express = require('express');
let router = express.Router();
let config = require('../../auth');
let hueSyncFunctions = require('./hueSyncFunctions');
let computerActivityFunctions = require('./computerActivityFunctions');
let influx = require('../custommodules/externalConnections/influxDB');

router.get('/enableHueSync', function (req, res, next){
    console.log("Lancement de HueSync");
    hueSyncFunctions.enableHueSync();
    res.sendStatus(200)
});

// Mouse Activity

router.get('/mouseActivity', function (req, res, next) {
    console.log("Récupération des coordonnées");
    console.log(computerActivityFunctions.getMouseActivity());
    res.sendStatus(200)
})
    .post('/mouseActivity', function (req, res, next){
    console.log(req.body);
    influx.writePoints()
    res.sendStatus(200);
});

module.exports = router;