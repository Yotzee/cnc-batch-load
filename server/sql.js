var sql = require('mssql');
var Q = require('q');
var config = {
    user: 'nodeuser',
    password: 'Node1234',
    server: 'ec2-52-41-26-66.us-west-2.compute.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'cnc'
};

exports.createMachine = function (machineName) {

};

exports.getMachine = function (machineName, callback) {
    sql.connect(config).then(function() {

        new sql.Request()
            .query('select * from machines where machineName =\'' + machineName +'\';')
            .then(function (machine) {
                callback(machine);
            })
            .catch(function (err) {
                callback(err);
            });
    });
};

exports.getMachines = function () {
    sql.connect(config).then(function() {
        new sql.Request()
            .query('select * from machines;')
            .then(function (machines) {
                console.dir(machines);
                return machines
            })
            .catch(function (err) {
                console.dir(err);
            });

    });
};

exports.saveWorkRow = function (machineName, jsonObj) {


};
