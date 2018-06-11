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
            res.sendStatus(200)
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
    let code = "AQCrQIG4lnSHyUe3xHlsVp-TMxoydAKdLlvaWicLvUJYQ0NiO7zPR3OLAl97il-g3HE6nzRH3hOS7lxJy0VgtbY_VB0GxvQf9isvMLn14cdaZB_xAkxc1-LYrsp47JbeG0yhyk0kJBeTmYM_u4LSJN-G0_aiddrcZAa1Iz1PZx8UV5HTrEIchQYYPrNLxTfHXfuFUn5teXuZcVPQU6DGy_MSj81uKgaeYvBIcQ7zhD9FWDhENbzleA9NvwjM2DQ5rpvc8N0QvQKOTZahWiU88MdpLI1W8j6D720aCzds9EbW6PyFHs8ffHte0jGGZqZ4h8fAbyy4nBKnEfxV6KIEAgwl7eoWwKLjIvojjrkT5yngatdYrxbrCcHRvFf9kUDUstcOpod6j-OA5XSp2IAeJV73gqe0072D7e7myc7OthiVH4VJ6bBVD-fHax52cHeCgpp8mG4NVcvUjTOqSn9BQ3Zg78FA5Fg0Pjpj9QL2erw-4KjiN1830pu6vdm2mgBn5iV5QrRCUPNWv1r-dypNP91AU9RaBUZx5WqACU0tOpGibce6OxXY4qXl25TXZC5vHHIFG94Ua8JawZd-wOLUbsD3sV300JDRAvGJ1IZJNDrNKntFyuP23xyX_Z19-xEDoJiqEMLlSjtxaiuhKdKwgu8QNpHaWDNp35gqTyGbT070JKZHtQvLGk2mIkpy0mPhxHu0AcDSDNMmzGyOm3A9JFwYDb_0xCfTaB3cn1zUS4Gg4A";
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
