let express = require('express');
let router = express.Router();
let config = require('../../../auth');
let WebSocket = require('ws');

let host = config.deCONZ.ipaddress;
let port = config.deCONZ.webSocketPort;
let ws = new WebSocket('ws://' + host + ':' + port);

let spotifyApi = require('../externalConnections/spotify');
let hueSyncFunctions = require('../../scriptAutoIt/hueSyncFunctions');

let findTypeOfSensorByID = require('../DataCollectionFunctions/findTypeOfSensorByID');
let sendDataToInfluxDB = require('../DataCollectionFunctions/sendDataToInfluxDB');

ws.on('open', function open() {
    ws.send('something');
    console.log("Connexion ouverte")
});

ws.on('message', function(msg) {
    let data = JSON.parse(msg);
    if(data.id === "1") console.log(data);
    analyzeEvent(data);
})

router.get('/openWebSocketConnection', function (req, res, next) {
    console.log("Connexion ouverte");
    res.sendStatus(200)
});

function analyzeEvent(data){
    let idSensor = data.id;
    let typeSensor = findTypeOfSensorByID(idSensor);
    let typeEvent = getTypeOfEvent(data, typeSensor);
    switch(typeEvent) {
        case "dataEvent" :
            sendDataToInfluxDB(idSensor, typeSensor, data.state);
            break;
        case "buttonEvent" :
            console.log(data.state.buttonevent);
            getButtonPressed(idSensor, data.state.buttonevent);
    }

}

function getTypeOfEvent(data, type){
    if(data.config){
        return "configEvent"
    }
    else if(data.state){
        if(type === "switch") return "buttonEvent";
        else return "dataEvent";
    }
}

function getButtonPressed(idSwitch, buttonID){

}

module.exports = router;