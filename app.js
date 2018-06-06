let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// Routes
let index = require('./routes/index');
let users = require('./routes/users');
let hueDataCollection = require('./routes/DataCollection/hue');
let googleAssistantResponses = require('./routes/GoogleAssistant/googleassistant');
let ifttt = require('./routes/IFTTT/ifttt');
let hueApi = require('./routes/HueAPI/hueapi');
let spotifyApi = require('./routes/SpotifyAPI/spotifyapi');
let scriptAutoIt = require('./routes/scriptAutoIt/scriptAutoIt');
let googleAssistantAPI = require('./routes/GoogleAssistant/broadcastassistant');
let deCONZ = require('./routes/custommodules/deCONZ/deCONZ');

const https = require('https');
const fs = require('fs');

let app = express();

app.use(express.static('static'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set up express server here
const options = {
    cert: fs.readFileSync('./sslcert2/fullchain.pem'),
    key: fs.readFileSync('./sslcert2/privkey.pem')
};

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/dataCollection', hueDataCollection);
app.use('/googleAssistant', googleAssistantResponses);
app.use('/IFTTT', ifttt);
app.use('/hueAPI', hueApi);
app.use('/spotifyApi', spotifyApi);
app.use('/scriptAutoIt', scriptAutoIt);
//app.use('/broadcastAssistant', googleAssistantAPI);
app.use('/deCONZ', deCONZ);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
app.listen(8091);
https.createServer(options, app).listen(8444);
console.log("Service démarré sur le 8091");
