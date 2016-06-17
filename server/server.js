var app = require('express')();
var config = require('./config');
var fs = require('fs');
var path = require('path');
var q = require('q');
var db = require('./utils/sql');
var util = require('./utils/util');
var workDecoder = require('./work/workDecoder');
var workUploader = require('./work/workUploader');
var log4js = require('log4js');
log4js.configure(config.loggerConfig);

var t = function(){
    db.getMachine(config.machineName)
        .then(function(machine){
            if(!machine){
                db.createMachine()
                    .then(function(machine){

                    });
            }
            //run(machine);
            
        })
        .then(t)
        .catch(function(err){
            console.log(err);
        });
};
t();
var run = function (machine) {
    console.log('Searching Files in dir: ' + config.fileDirectory);
    console.log('Date: ' + new Date());
    console.log('----------------------');
    //fs.readdir(config.fileDirectory, function (err, list) {
    util.getFilesInDir(config.fileDirectory)
        .then(function(fileList){

        })
        .catch(function(err){
            console.log(err);
        });
    //     list.forEach(function (file) {
    //         if ((/[ldb]+/g).test(file)) {
    //             var filesJson = require('./files');
    //             var foundFile = util.findFile(filesJson, file);
    //             var filePath = config.fileDirectory + file;
    //             var fileInfo = util.getFileInfo(filePath);
    //
    //             if (foundFile) {
    //                 console.log('file found in files.json: ' + file);
    //                 if (Date(foundFile.mtime)) {
    //                     if (Date(fileInfo.mtime) != Date(foundFile.mtime)) {
    //                         console.log('importing changed file');
    //                         workDecoder.decode(filePath)
    //                             .then(function(workObj){
    //
    //                             });
    //                         foundFile.mtime = fileInfo.mtime;
    //                         console.log('finished importing changed file');
    //                     } else {
    //                         console.log('file has not changed');
    //                     }
    //                 }
    //
    //             } else {
    //                 console.log('found new file: ' + file);
    //                 var fileObj = {
    //                     fileName: file,
    //                     mtime: fileInfo.mtime
    //                 };
    //                 filesJson.files.push(fileObj);
    //                 console.log('importing new file');
    //                 workDecoder.decode(filePath)
    //                     .then(function(workObj){
    //
    //                     });
    //                 console.log('finished importing new file');
    //             }
    //
    //             fs.writeFile('server/files.json', JSON.stringify(filesJson), function (err) {
    //                 if (err) {
    //                     console.error('failed to write files.json');
    //                 }
    //             });
    //         }
    //     });
    //     console.log('----------------------');
    //     console.log('Finished Searching');
    //     console.log('----------------------');
    // });


    setTimeout(run, config.rateInMillis);
};

app.get('/read', function (req, res) {
    res.send('not working');
});

app.listen(config.server.port, function () {
    console.log('server started on port: ', config.server.port);
});
