var express = require('express');
var router = express.Router();
var huejay = require('huejay');
var Influx = require('influx');
var config = require('../auth.json');
var _ = require('underscore');
var moment = require('moment-timezone');
var sensorTimeManipulation = require('./custommodules/sensorTimeManipulation.js');
const { DateTime } = require('luxon');

//Connexion à InfluxDB
var influx = new Influx.InfluxDB({
    host : 'localhost',
    port : 8086,
    database : 'RoomState',
    username : config.influx.username,
    password : config.influx.password
});

// Connexion au bridge
var client = new huejay.Client({
    host : config.bridge.adress,
    port : 80,
    username : config.bridge.username
});

beginDataCollection();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

function beginDataCollection(){
    var timeout = setInterval(function () { // A REMETTRE A SETINTERVAL
            client.sensors.getAll().then(sensors => {selectSensorDataAndSendInMeasurement(sensors)})
        },5000); // A REMETTRE A 5000
}

function sendDataToInfluxDB(type, id, sensor){

    let measurementname = config.sensorsConfig.type[type];
    let fieldtype = config.sensorsConfig.fieldtype[type];
    let value = sensor.state[measurementname];
    let originaltime = sensor.state.attributes.attributes.lastupdated;
    let time = sensorTimeManipulation.toLilleTimeStamp(originaltime);
    if(!(value)) value = sensor.state.attributes.attributes[measurementname];
    console.log("Sensor : " + measurementname + ", value : " + value + ", at : " + time);
    influx.writePoints([
        {
            measurement: measurementname,
            tags : {id : id},
            fields: {value: value},
            timestamp : time,
        }
    ], {precision: 's'}).catch(function(e){
        console.log("Erreur écriture de données");
        console.log(e);
    })
};

function selectSensorDataAndSendInMeasurement(sensors){
    console.log(_.keys(sensors));
    console.log(sensors[_.keys(sensors)[0]].id);
    for(var i=0;i<_.keys(sensors).length;i++){
        let sensor = sensors[_.keys(sensors)[i]];
        let type = sensor.type;
        let id = sensor.id;
        //console.log(_.values(config.sensorsID));
        if(findTypeOfSensorByID(id)) sendDataToInfluxDB(type, id, sensor)
    }
}

function findTypeOfSensorByID(id){
    let type = false;
    id = parseInt(id);
    for(let i=0;i<_.keys(config.sensorsID).length;i++){
        if(_.contains(_.values(config.sensorsID)[i],id)){
            type = _.keys(config.sensorsID)[i];
        }
    }
    return type;
}

module.exports = router;
