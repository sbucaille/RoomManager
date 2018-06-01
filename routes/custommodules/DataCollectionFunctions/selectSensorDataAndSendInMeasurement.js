let _ = require('underscore');
let findTypeOfSensorByID = require('./findTypeOfSensorByID');
let sendDataToInfluxDB = require('./sendDataToInfluxDB');

selectSensorDataAndSendInMeasurement = function(sensors){
    console.log(_.keys(sensors));
    console.log(sensors[_.keys(sensors)[0]].id);
    for(let i=0;i<_.keys(sensors).length;i++){
        let sensor = sensors[_.keys(sensors)[i]];
        let type = sensor.type;
        let id = sensor.id;
        if(findTypeOfSensorByID(id)) sendDataToInfluxDB(type, id, sensor);
    }
};

module.exports = selectSensorDataAndSendInMeasurement;