let SpotifyWebApi = require('spotify-web-api-node');
let config = require('../../../auth');
let fs = require('fs');

let spotifyApi = new SpotifyWebApi({
    clientId : config.spotifyApi.clientID,
    clientSecret : config.spotifyApi.clientSecret,
    redirectUri : config.spotifyApi.redirectUri
});

connectSpotifyApi(spotifyApi);

function connectSpotifyApi(spotifyApi){
    let tokenData = require('../../../spotifyAccessToken');
    let accessToken = tokenData.token;
    let refreshToken = tokenData.refreshToken;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    spotifyApi.getMyDevices().then(
        function (data) {
            console.log(data.body);
            refreshSpotifyAPI(spotifyApi);
        },
        function (err) {
            console.error(err);
        })
};

refreshSpotifyAPI = function (spotifyApi){
    setInterval(function(){
        spotifyApi.refreshAccessToken().then(
            function(data) {
                console.log('The access token has been refreshed!');
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
    },150000);
};

module.exports = spotifyApi;