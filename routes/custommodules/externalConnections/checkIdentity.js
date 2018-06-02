let config = require('../../../auth');
checkIdentity = function(req, res, next){
    console.log("Authentication in progress");
    if((req.body.login === config.serverConnection.login) && (req.body.password === config.serverConnection.password)) return next();
    else res.sendStatus(403);
};

module.exports = checkIdentity;