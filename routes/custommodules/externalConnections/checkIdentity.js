let config = require('../../../auth');
checkIdentity = function(req, res, next){
    console.log(req);
    if((req.body.login === config.serverConnection.login) && (req.body.password === config.serverConnection.password)) return next();
    else res.sendStatus(403);
};

module.exports = checkIdentity;