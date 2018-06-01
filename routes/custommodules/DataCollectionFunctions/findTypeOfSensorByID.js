let _ = require('underscore');
let config = require('../../../auth.json');

findTypeOfSensorByID = function(id){
    let type = false;
    id = parseInt(id);
    for(let i=0;i<_.keys(config.sensorsID).length;i++){
        if(_.contains(_.values(config.sensorsID)[i],id)){
            type = _.keys(config.sensorsID)[i];
        }
    }
    return type;
};

module.exports = findTypeOfSensorByID;