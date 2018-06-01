let express = require('express');
let router = express.Router();
let huejay = require('huejay');
let Influx = require('influx');
let config = require('../../auth.json');
<<<<<<< HEAD
=======
let _ = require('underscore');
let moment = require('moment-timezone');
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2
let sensorTimeManipulation = require('../custommodules/sensorTimeManipulation.js');
const { DateTime } = require('luxon');

let beginDataCollection = require('../custommodules/DataCollectionFunctions/beginDataCollection');


//Connexion à InfluxDB
let influx = new Influx.InfluxDB({
    host : 'localhost',
    port : 8086,
    database : 'RoomState',
    username : config.influx.username,
    password : config.influx.password
});

let influxRaspPI = new Influx.InfluxDB({
    host : '192.168.1.18',
    port : 8086,
    database : 'RoomState',
    username : config.influx.username,
    password : config.influx.password
})
// Connexion au bridge
let client = new huejay.Client({
    host : config.bridge.adress,
    port : 80,
    username : config.bridge.username
});

<<<<<<< HEAD
//beginDataCollection();
=======
beginDataCollection();
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/temperature', function (req,res,next) {
<<<<<<< HEAD
    influx.query("SELECT last(value) FROM temperature").then(results => {
=======
    influx.query("SELECT * FROM temperature").then(results => {
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2
        json = parseInfluxData(results);
    }).then(result => {
        res.send(JSON.stringify(json));
    })
});

router.get('/lightlevelPI', function (req,res,next) {
    influxRaspPI.query("SELECT * FROM lightlevel").then(results => {
        json = parseInfluxData(results);
    }).then(result => {
        res.send(JSON.stringify(json));
    })
});

function parseInfluxData(results){
    console.log(results.length);
    console.log(results[0].time);
<<<<<<< HEAD
    let json = {
=======
    json = {
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2
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
