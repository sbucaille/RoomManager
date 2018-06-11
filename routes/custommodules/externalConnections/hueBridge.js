let huejay = require('huejay');
let config = require('../../../auth');

let client = new huejay.Client({
    host : config.bridge.adress,
    port : 80,
    username : config.bridge.username
});

module.exports = client;