var util = require('.././utils/util');
var sql = require('.././utils/sql');

exports.upload = function (workObj, machine) {
    sql.saveWorkRow(workObj,machine)
        .then(function(results){
            console.log(results);
        })
        .catch(function(err){
            console.log(err);
        });
};