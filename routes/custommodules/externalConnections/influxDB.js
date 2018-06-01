let Influx = require('influx');
let config = require('../../../auth.json');

//Connexion à InfluxDB
let influx = new Influx.InfluxDB({
    host : 'localhost',
    port : 8086,
    database : 'RoomState',
    username : config.influx.username,
    password : config.influx.password
});

module.exports = influx;