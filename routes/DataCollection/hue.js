let express = require('express');
let router = express.Router();
let huejay = require('huejay');
let influx = require('../custommodules/externalConnections/influxDB');

let config = require('../../auth.json');
let sensorTimeManipulation = require('../custommodules/sensorTimeManipulation.js');
const { DateTime } = require('luxon');

let beginDataCollection = require('../custommodules/DataCollectionFunctions/beginDataCollection');

// Connexion au bridge
let client = new huejay.Client({
    host : config.bridge.adress,
    port : 80,
    username : config.bridge.username
});

//beginDataCollection();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/temperature', function (req,res,next) {
    influx.query("SELECT last(value) FROM temperature").then(results => {
        let json = parseInfluxData(results);
    }).then(result => {
        res.send(JSON.stringify(json));
    })
});

router.get('/lightlevelPI', function (req,res,next) {
    influx.query("SELECT * FROM lightlevel").then(results => {
        let json = parseInfluxData(results);
    }).then(result => {
        res.send(JSON.stringify(json));
    })
});

function parseInfluxData(results){
    console.log(results.length);
    console.log(results[0].time);
    let json = {
        "time" : [],
        "value" : []
    };
    for(let i of results){
        json.time.push(sensorTimeManipulation.fromInfluxTimeToLilleTime(i.time));
        json.value.push(i.value);
    }
    console.log(json.time.length);
    return json;
}

module.exports = router;
