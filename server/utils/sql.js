var sql = require('mssql');
var q = require('q');
var config = {
    user: 'nodeuser',
    password: 'Node1234',
    server: 'ec2-52-41-26-66.us-west-2.compute.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'cnc'
};

exports.createMachine = function (machineName) {
    return new Promise(function(resolve,reject){
        sql.connect(config).then(function() {
            new sql.Request()
                .query('insert into machines (machineName) values (\'' + machineName + '\');')
                .then(function (machine) {
                    resolve(machine);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    });
};

exports.getMachine = function (machineName) {
    return new Promise(function(resolve,reject){
        sql.connect(config).then(function() {
            new sql.Request()
                .query('select * from machines where machineName =\'' + machineName +'\';')
                .then(function (machine) {
                    resolve(machine);
                })
                .catch(function (err) {
                    reject(err);
                });
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
