var express = require('express');
var router = express.Router();
let config = require('../../auth');
let fs = require('fs');
let checkIdentity = require('../custommodules/externalConnections/checkIdentity');
let SpotifyWebApi = require('spotify-web-api-node');
let moment = require('moment-timezone');

let spotifyApi = new SpotifyWebApi({
    clientId : config.spotifyApi.clientID,
    clientSecret : config.spotifyApi.clientSecret,
    redirectUri : config.spotifyApi.redirectUri
    //accessToken : config.spotifyApi.accessToken,
    //refreshAccessToken : config.spotifyApi.refreshToken
});

function connectSpotifyApi(){
    let tokenData = require('../../spotifyAccessToken');
    let accessToken = tokenData.token;
    let refreshToken = tokenData.refreshToken;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
}

connectSpotifyApi();
// Connexion à Spotify

let scopes = ["user-modify-playback-state","user-read-currently-playing","user-read-playback-state"];
let state = "some-state";

let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state, true);
console.log(authorizeURL);

/* GET home page. */
router.get('/', function(req, res, next) {
    refreshSpotifyAPI(spotifyApi);
    res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next){
    refreshSpotifyAPI(spotifyApi);
    spotifyApi.getMyCurrentPlaybackState({}).then(
        function(data){
            console.log('Now playing', data.body)
        }, function(err) {
            console.log('Something went wrong!', err);
        });
});

router.get('/pause', function(req, res, next){
    refreshSpotifyAPI(spotifyApi);
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
    refreshSpotifyAPI(spotifyApi);
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

function refreshSpotifyAPI(spotifyApi){
    setInterval(function(){
            spotifyApi.refreshAccessToken().then(
                function(data) {
                    console.log('The access token has been refreshed at ' + moment.locale().toLocaleLowerCase() + '!');
                    console.log(data.body['access_token']);
                    // Save the access token so that it's used in future calls
                    spotifyApi.setAccessToken(data.body['access_token']);
                    let updatedTokenData = {
                        "token" : spotifyApi.getAccessToken(),
                        "refreshToken" : spotifyApi.getRefreshToken()
                    };
                    fs.writeFile('./spotifyAccessToken.json', JSON.stringify(updatedTokenData), function (err) {
                        if (err) console.error(err);
                    })
                },
                function(err) {
                    console.log('Could not refresh access token', err);
                })
        },180000);
}

router.get('/getAuthorizationCode', function(req, res, next){
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

router.get('/getAllDevices', function (req, res, next) {
    spotifyApi.getMyDevices().then(
        function (data) {
            console.log(data.body);
        },
        function (err) {
            console.error(err);
        }
    )
})


module.exports = router;
