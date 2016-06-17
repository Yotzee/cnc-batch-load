var app = require('express')();
var config = require('./config');

exports.modules = function(){
    
    app.get('/read', function (req, res) {
        res.send('not working');
    });

    app.listen(config.server.port, function () {
        console.log('server started on port: ', config.server.port);
    });

}();
