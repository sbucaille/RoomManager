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
            console.log('Now playing', data.body)
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.get('/pause', checkIdentity, function(req, res, next){
    spotifyApi.pause().then(
        function (data){
            console.log(data)
        },
        function (err) {
            console.error(err);
        }
    )
})

router.get('/playOnRaspberry', checkIdentity, function(req, res, next) {
    spotifyApi.play(
        {
            device_id : config.spotifyApi.raspberryID,
            context_uri : "spotify:album:7tdV8Iup7GJM2SSDTfrzBt"
        }).then(
        function (data) {
            console.log(data.body);
        },
        function (err) {
            console.error(err);
        }
    )
})

router.get('/getAuthorizationCode', checkIdentity, function(req, res, next){
    console.log(req.query.code);
    let code = req.query.code;
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
