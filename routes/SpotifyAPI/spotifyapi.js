let express = require('express');
let router = express.Router();
let config = require('../../auth');
let checkIdentity = require('../custommodules/externalConnections/checkIdentity');
let spotifyApi = require('../custommodules/externalConnections/spotify');

/* GET home page. */
router.get('/', checkIdentity, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next){
    spotifyApi.getMyCurrentPlaybackState({}).then(
        function(data){
            console.log('Now playing', data.body);
            res.send(200)
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.get('/pause', function(req, res, next){
    spotifyApi.pause().then(
        function (data){
            console.log(data)
        },
        function (err) {
            console.error(err);
        }
    )
})

router.get('/playOnRaspberry', function(req, res, next) {
    spotifyApi.play(
        {
            device_id : config.spotifyApi.raspberryID,
            uris : "spotify:track:73oamquev2r1MMkSDEjKgQ"
        }).then(
        function (data) {
            console.log(data.body);
        },
        function (err) {
            console.error(err);
        }
    )
})

router.get('/getAuthorizationCode', function(req, res, next){
    let code = "AQCfgYzWg1QqvAIgTt3hPkndXwYrQqB5csC1PKib5a258Mp52WcBsh3PW8_nCBY14ozoXV_bRoTWJ6QzrFm4pNyFYvSdX_hd7G7s33tFaO319KVEE-7IZvGw0Q_Pc2koaanlwkkKO-ZPiNzApTUAGpQ17sfKMPhPgT65RReERa46YKVi_apzoG-P8R_DToSXfT5Wt6PPvKB4HnlReyX7BskeAc60qlOACZTrv0RXdhTwoxxfT52Yc7vQseu_XOhB3tWmAodgFJyWQa97swnV_ODb898QbYh7YJW5Wd9g3xYTTmawESevpFG-5WkNsR0LxpzYUAS_SeoZ1P2Wth4KP2_eJQ14_7fjzC4QxML_mrny1iEEJ-i5rC09gK3N-gE4vU1iMnlHcUmlKih1RemRqEx0HiDmD9CdbNi-96jBwmZZushnwmLj5RE09zbBWVW9lAGQj0-RR6kFHSEzhRYIKwcUy70dZeRtnXS9861D9iti0bg6P76F5Kk8ELFeWqmUqTzC-8exOwOr4YlxAUly9CUMIz03_Y2Xxk70Y_GWPuiiQGUZhoNWq3rLmNJShlvGE_2i9_anXnjnAGtkaFqs6KjhD5kGXRDP-F9fYnhJlPO9K-XhaO0E3BADUDcmqevJXqyS3IiYYBptJnPHIqFqBXukXB2dBoJhVpou52C1Gfose0lLTfqI5HZrJ1sUQEda3XsNOp6sJcfXW1lKEIDbmnTdpbu7DzIDRgXz7hRfVbnW";
    spotifyApi.authorizationCodeGrant(code).then(
        function(data) {
            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        },
        function(err) {
            console.log('Something went wrong!', err);
        }
    );
});

module.exports = router;
