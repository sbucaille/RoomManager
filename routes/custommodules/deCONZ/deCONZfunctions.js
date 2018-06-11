const NanoTimer = require('nanotimer');

const influxDB = require('../externalConnections/influxDB');
const hueBridge = require('../externalConnections/hueBridge');
const spotifyApi = require('../externalConnections/spotify');
const config = require('../../../auth');

const findTypeOfSensorByID = require('../DataCollectionFunctions/findTypeOfSensorByID');
const sendDataToInfluxDB = require('../DataCollectionFunctions/sendDataToInfluxDB');
const hueSyncFunctions = require('../../scriptAutoIt/hueSyncFunctions');

let timer = new NanoTimer();
let timerTimeout = '300s';

const analyseEvent = (data) =>
{
    let idSensor = data.id;
    let typeSensor = findTypeOfSensorByID(idSensor);
    let typeEvent = getTypeOfEvent(data, typeSensor);
    switch(typeEvent) {
        case "dataEvent" :
            if(idSensor === "3") motionDetected(idSensor, typeSensor, data);
            //else if(idSensor === "2") ambientLightStatusChanged(idSensor, typeSensor, data);
            else sendDataToInfluxDB(idSensor, typeSensor, data.state);
            break;
        case "buttonEvent" :
            console.log(data.state.buttonevent);
            buttonPressed(idSensor, data.state.buttonevent);
    }
};

const getTypeOfEvent = (data, type) =>
{
    if(data.config){
        return "configEvent"
    }
    else if(data.state){
        if(type === "switch") return "buttonEvent";
        else return "dataEvent";
    }
};

const  motionDetected = async (idSensor, typeSensor, data) =>
{
    let presence = data.state.presence;
    let ambientLightStatus = await getAmbientLightStatus(idSensor);
    let newStatusLight = presence && !(ambientLightStatus.daylight);
    if(!(presence)){
        timer.setTimeout(function(){
            switchTheBedroomLights(newStatusLight);
            sendDataToInfluxDB(idSensor, typeSensor, data.state);
        },'',timerTimeout);
    }
    else if (presence && timer.hasTimeout()) {
        timer.clearTimeout();
        switchTheBedroomLights(newStatusLight);
    }
    else if(presence && !(timer.hasTimeout())){
        switchTheBedroomLights(newStatusLight);
        sendDataToInfluxDB(idSensor, typeSensor, data.state);
    }
};

const getAmbientLightStatus = (idSensor) =>
{
    return new Promise(resolve => {
        influxDB.query("SELECT last(value) FROM dark, daylight")
            .then(results => {
                let data = {
                    "dark" : results[0].last,
                    "daylight" : results[1].last
                };
                resolve(data);
            })
    })
};

const buttonPressed = (idSwitch, buttonID) =>
{
    if(buttonID === 1000) {
        spotifyApi.play(
            {
                device_id: config.spotifyApi.computerID,
                uris: ["spotify:track:1gev14kRQECVB6TiHN8Cwe"]
            }).then(
            function (data) {
                console.log(data.body);
            },
            function (err) {
                console.error(err);
            }
        );
        hueSyncFunctions.selectMusicMode();
        hueSyncFunctions.enableHueSync();
    }
    else if(buttonID === 2000){
        spotifyApi.pause().then(
            function (data) {
                console.log(data.body);
            },
            function (err) {
                console.error(err);
            });
        hueSyncFunctions.enableHueSync();
    }
};

const switchTheBedroomLights = (status) =>
{
    hueBridge.groups.getById(2)
        .then(group => {
            group.on = status;
            group.transitionTime = 6;
            return hueBridge.groups.save(group);
        })
        .then(group => {
            //console.log
        })
        .catch(error => {
            console.log(error.stack);
        });
};

const ambientLightStatusChanged = async (idSensor, typeSensor, data) =>
{
    let newAmbientLightStatus = {
        "dark" : data.state.dark,
        "daylight" : data.state.daylight
    };
    let previousAmbientLightStatus = await getAmbientLightStatus(idSensor);
    let newStatus = getNewLightStatus(newAmbientLightStatus, previousAmbientLightStatus);
    if(newStatus !== '') switchTheBedroomLights(newStatus);
};

const getNewLightStatus = (newAmbientLightStatus, previousAmbientLightStatus) =>
{
    let newDaylight = newAmbientLightStatus.daylight,
        newDark = newAmbientLightStatus.dark,
        previousDaylight = previousAmbientLightStatus.daylight,
        previousDark = previousAmbientLightStatus.dark;

    if((previousDaylight && !(previousDark)) && (!(newDaylight) && newDark)) return true;
    else if((previousDaylight && !(previousDark)) && (newDaylight && !(newDark))) return false;
    else if((!(previousDaylight) && !(previousDark)) && (!(newDaylight) && !(newDark))) return false;
    else if((!(previousDaylight) && previousDark) && (newDaylight && !(newDark))) return false;
    else return '';
};

module.exports = {
    analyseEvent,
    getTypeOfEvent,
    motionDetected,
    buttonPressed,
    getAmbientLightStatus,
    switchTheBedroomLights,
    ambientLightStatusChanged,
    getNewLightStatus
};