let express = require('express');
let router = express.Router();
let config = require('../../auth.json');
let Assistant = require('actions-on-google')
let Influx = require('influx');


// Connexion à InfluxDB
let influxRaspPI = new Influx.InfluxDB({
    host : '192.168.1.18',
    port : 8086,
    database : 'RoomState',
    username : config.influx.username,
    password : config.influx.password
})

router.get('/testGoogleAssistant', function(req, res, next){
    console.log(req.body);
    res.render('index', { title : 'Google Assistant'});
})

router.post('/getTemperature', function (req, res, next){
    console.log(req.body);

    influxRaspPI.query("Select last(value) from temperature").then(results => {
        console.log(results);
        let temp = results[0].last.toString();
        //temp = temp.replace('.',',');
        //let fulfillmentText = "Actuellement, il fait " + temp + " degrés.";
        let fulfillmentText = "Actuellement, il fait " + temp + " degrés dans la chambre de Steven, allez bisous !";
        res.json({ fulfillmentText: fulfillmentText});
    })
});

router.get('/getTemperature', function (req, res, next){
    console.log(req.body);
    
    influxRaspPI.query("Select last(value) from temperature").then(results => {
        console.log(results);
        let temp = results[0].last.toString();
        temp = temp.replace('.',',');
        let fulfillmentText = "Actuellement, il fait " + temp + " degrés dans la chambre de Steven, allez bisous !";
        res.json({ fulfillmentText: fulfillmentText});
    })
});

router.post('/getLightlevel', function (req, res, next){
    console.log(req.body);
    influxRaspPI.query("Select last(value) from lightlevel").then(results => {
        console.log(results);
        let temp = results[0].last.toString();
        //temp = temp.replace('.',',');
        //let fulfillmentText = "Actuellement, il fait " + temp + " degrés.";
        let fulfillmentText = "Currently, in the bedroom, it's " + temp + " degrees.";
        res.json({ fulfillmentText: fulfillmentText});
    })
});

router.post('/demoBedroom', function (req, res, next){

})
module.exports = router;