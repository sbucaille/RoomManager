<<<<<<< HEAD
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let index = require('./routes/index');
let users = require('./routes/users');
let hueDataCollection = require('./routes/DataCollection/hue');
let googleAssistantResponses = require('./routes/GoogleAssistant/googleassistant');
let ifttt = require('./routes/IFTTT/ifttt');

const https = require('https');
const fs = require('fs');
=======
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var hueDataCollection = require('./routes/DataCollection/hue');
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2

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
<<<<<<< HEAD
app.use('/googleAssistant', googleAssistantResponses);
app.use('/IFTTT', ifttt);
=======
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2

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
<<<<<<< HEAD
app.listen(8091);
https.createServer(options, app).listen(8444);
console.log("Service démarré sur le 8091");
=======
app.listen(8090);
console.log("Service démarré sur le 8090");
>>>>>>> 2c2fc5ff82bce8a38f095b2d4980e15268b036f2
