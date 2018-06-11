let express = require('express');
let router = express.Router();

let config = require('../../../auth');
let WebSocket = require('ws');

let host = config.deCONZ.ipaddress;
let port = config.deCONZ.webSocketPort;
let ws = new WebSocket('ws://' + host + ':' + port);

let deCONZfunctions = require('./deCONZfunctions');

ws.on('open', function open() {
    ws.send('something');
    console.log("Connexion ouverte")
});

ws.on('message', function(msg) {
    let data = JSON.parse(msg);
    deCONZfunctions.analyseEvent(data);
});

module.exports = router;