var { DateTime } = require('luxon');
var moment = require('moment-timezone');

var functions = {
    toLilleTime : function(time){
        var dateformated = DateTime.fromISO(time);
        var newtime = DateTime.utc(dateformated.utc);
        var localtime = newtime.setZone("Europe/Paris");

        return localtime.toLocaleString(DateTime.DATETIME_MED);
    },
    toLilleTimeStamp : function(time){
        var dateformated = DateTime.fromISO(time);
        var newtime = DateTime.utc(dateformated.utc);
        var localtime = newtime.setZone("Europe/Paris");
        var localtimestamp = moment(localtime.toString()).format('x');

        return localtimestamp;
    },
    fromTimestampToTime : function(time) {
        return moment(parseInt(time)).format("dddd, MMMM Do YYYY, h:mm:ss a");
    }
};

module.exports = functions;