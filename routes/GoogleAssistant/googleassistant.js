let express = require('express');
let router = express.Router();
let config = require('../../auth');
let Assistant = require('actions-on-google');
let influx = require('../custommodules/externalConnections/influxDB');
let spotifyApi = require('../custommodules/externalConnections/spotify');
let hueSyncFunctions = require('../scriptAutoIt/hueSyncFunctions');

router.get('/testGoogleAssistant', function(req, res, next){
    console.log(req.body);
    res.render('index', { title : 'Google Assistant'});
});

router.get('/getTemperature', function (req, res, next){
    console.log(req.body);
    
    influx.query("Select last(value) from temperature").then(results => {
        console.log(results);
        let temp = results[0].last.toString();
        temp = temp.replace('.',',');
        let fulfillmentText = "Actuellement, il fait " + temp + " degrés dans la chambre de Steven, allez bisous !";
        res.json({ fulfillmentText: fulfillmentText});
    })
});

router.post('/getLightlevel', function (req, res, next){
    console.log(req.body);
    influx.query("Select last(value) from lightlevel").then(results => {
        console.log(results);
        let temp = results[0].last.toString();
        //temp = temp.replace('.',',');
        //let fulfillmentText = "Actuellement, il fait " + temp + " degrés.";
        let fulfillmentText = "Currently, in the bedroom, it's " + temp + " degrees.";
        res.json({ fulfillmentText: fulfillmentText});
    })
});

router.post('/', function (req, res, next){
    console.log(req.body);
    console.log(req.body.queryResult.parameters);
    getIntent(req, res);
});

router.get('/', function(req, res, next){
    console.log(req.body);
    res.sendStatus(200)
});

function getIntent(req, res){
    let intent = req.body.queryResult.intent.displayName;
    switch (intent){
        case 'Demonstration':
            demonstrationIntent(req, res);
            break;
        case 'Get Temperature' :
            returnTemperatureIntent(req, res);
            break;
    }
}

function returnTemperatureIntent(req, res){
    influx.query("Select last(value) from temperature").then(results => {
        console.log(results);
        let temp = results[0].last.toString();
        temp = temp.replace('.',',');
        //let fulfillmentText = "Actuellement, il fait " + temp + " degrés.";
        let fulfillmentText = "Actuellement, il fait " + temp + " degrés dans la chambre de Steven, allez bisous !";
        res.json({ fulfillmentText: fulfillmentText});
    })
}

function demonstrationIntent(req, res){
    spotifyApi.play(
        {
            device_id : config.spotifyApi.computerID,
            uris : ["spotify:track:70X9TAIp62fA6FbkwRG4M6"]
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
    res.json({ fulfillmentText : "Ok, c'est parti pour une petite démonstration !"})
}

module.exports = router;