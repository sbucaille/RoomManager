let huejay = require('huejay');
let Influx = require('influx');
let config = require('../../auth.json');
let _ = require('underscore');
let sensorTimeManipulation = require('../custommodules/sensorTimeManipulation.js');

// Connexion au bridge
let client = new huejay.Client({
    host : config.bridge.adress,
    port : 80,
    username : config.bridge.username
});

let HUE_DATA_COLLECTION_INTERVAL = 60000;


let functions = {
    beginDataCollection : function(){
        setInterval(function () {
            client.sensors.getAll().then(sensors => {selectSensorDataAndSendInMeasurement(sensors)})
        },HUE_DATA_COLLECTION_INTERVAL);
    },
    selectSensorDataAndSendInMeasurement : function(sensors){
        console.log(_.keys(sensors));
        console.log(sensors[_.keys(sensors)[0]].id);
        for(let i=0;i<_.keys(sensors).length;i++){
            let sensor = sensors[_.keys(sensors)[i]];
            let type = sensor.type;
            let id = sensor.id;
            if(findTypeOfSensorByID(id)) sendDataToInfluxDB(type, id, sensor);
        }
    }
};

module.exports = functions;
