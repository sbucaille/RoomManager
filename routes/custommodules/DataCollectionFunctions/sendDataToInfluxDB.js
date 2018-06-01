let sensorTimeManipulation = require('../sensorTimeManipulation');
let config = require('../../../auth.json');
let influx = require('../externalConnections/influxDB');

sendDataToInfluxDB = function(type, id, sensor){

    let measurementname = config.sensorsConfig.type[type];
    let fieldtype = config.sensorsConfig.fieldtype[type];
    let value = sensor.state[measurementname];
    let originaltime = sensor.state.attributes.attributes.lastupdated;
    let time = sensorTimeManipulation.toLilleTimeStamp(originaltime);
    if(!(value)) value = sensor.state.attributes.attributes[measurementname];
    console.log("Sensor : " + measurementname + ", value : " + value + ", at : " + sensorTimeManipulation.toLilleTime(originaltime));
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

module.exports = sendDataToInfluxDB;