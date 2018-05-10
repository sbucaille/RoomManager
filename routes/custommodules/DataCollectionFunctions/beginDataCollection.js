let huejay = require('huejay');
let HUE_DATA_COLLECTION_INTERVAL = 5000;
let selectSensorDataAndSendInMeasurement = require('./selectSensorDataAndSendInMeasurement');
let config = require('../../../auth');

// Connexion au bridge
let client = new huejay.Client({
    host : config.bridge.adress,
    port : 80,
    username : config.bridge.username
});

beginDataCollection = function(){
    setInterval(function () {
        client.sensors.getAll().then(sensors => {selectSensorDataAndSendInMeasurement(sensors)})
    },HUE_DATA_COLLECTION_INTERVAL);
}

module.exports = beginDataCollection;