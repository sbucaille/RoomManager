var { DateTime } = require('luxon');
var moment = require('moment-timezone');

var functions = {
    toLilleTime : function(time){
        var dateformated = DateTime.fromISO(time);
        var newtime = DateTime.utc(dateformated.utc);
        var localtime = newtime.setZone("Europe/Paris");
        console.log("toLilleTime : " + localtime);

        return localtime.toLocaleString(DateTime.DATETIME_MED);
    },
    toLilleTimeStamp : function(time){
        var dateformated = DateTime.fromISO(time);
        var newtime = DateTime.utc(dateformated.utc);
        var localtime = newtime.setZone("Europe/Paris");
        var localtimestamp = moment(localtime.toString()).format('X');
        console.log("toLilleTimeStamp : " + localtimestamp);

        return localtimestamp;
    },
    fromTimestampToTime : function(time) {
        console.log(typeof time);
        var returntime = moment(time.toString()).format("dddd, MMMM Do YYYY, h:mm:ss a");
        console.log("fromTimestampToTime " + returntime);
        return returntime;
    },
    fromInfluxTimeToLilleTime : function(time){
        let lilleTime = DateTime.fromISO(time._nanoISO).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
        return lilleTime;
    }
};

module.exports = functions;