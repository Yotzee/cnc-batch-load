var sql = require('mssql');
var config = {
    user: 'nodeuser',
    password: 'Node1234',
    server: 'ec2-52-41-26-66.us-west-2.compute.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'cnc'
};

exports.createMachine = function (machineName) {
    return new Promise(function (resolve, reject) {
        sql.connect(config).then(function () {
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
    return new Promise(function (resolve, reject) {
        sql.connect(config).then(function () {
            new sql.Request()
                .query('select * from machines where machineName =\'' + machineName + '\';')
                .then(function (machine) {
                    resolve(machine[0]);
                })
                .catch(function (err) {
                    reject(err);
                });
        });

    });
};

exports.getMachines = function () {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then(function () {
                new sql.Request()
                    .query('select * from machines;')
                    .then(function (machines) {
                        resolve(machines);
                    })
                    .catch(function (err) {
                        reject(err);
                    });

            })
    });
};

exports.saveWorkRow = function (workObj, machine) {
    return new Promise(function (resolve, reject) {
        sql.connect(config).then(function () {
            new sql.Request()
                .query('insert into Work (machineId) values (\'' + machine.id + '\');')
                .then(function (results) {
                    resolve(results);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    });
};
