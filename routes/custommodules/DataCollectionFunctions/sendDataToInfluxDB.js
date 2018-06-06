let sensorTimeManipulation = require('../sensorTimeManipulation');
let config = require('../../../auth.json');
let influx = require('../externalConnections/influxDB');
let _ = require('underscore');

sendDataToInfluxDB = function(id, type, sensor){

    let measurementname = getTypeFromData(type, sensor);
    let originaltime = sensor.lastupdated;
    let value = getValueFromData(type, sensor);
    let time = sensorTimeManipulation.toLilleTimeStamp(originaltime);
    for(let i=0; i<value.length; i++){
        console.log("Sensor : " + measurementname[i] + ", value : " + value[i] + ", at : " + sensorTimeManipulation.toLilleTime(originaltime));
        influx.writePoints([
            {
                measurement: measurementname[i],
                tags : {id : id},
                fields: {value: value[i]},
                timestamp : time,
            }
        ], {precision: 's'}).catch(function(e){
            console.log("Erreur écriture de données");
            console.log(e);
        })
    }
};

function getTypeFromData(typeSensor, data){
    if(typeSensor === "lightlevel") return ["lightlevel","lux","dark","daylight"];
    else return [typeSensor];
}

function getValueFromData(typeSensor, data){
    switch (typeSensor) {
        case "lightlevel" :
            return getLightLevelAndLuxFromData(data);
            break;
        case "temperature" :
            return getTemperatureValueFromData(data);
            break;
        default :
            return [data[typeSensor]];
    }
}

function getLightLevelAndLuxFromData(data){
    return [data.lightlevel, data.lux, data.dark, data.daylight];
}

function getTemperatureValueFromData(data){
    let rawValue = data.temperature;
    let realValue = rawValue / 100;
    return [realValue];
}

module.exports = sendDataToInfluxDB;