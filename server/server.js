var routes = require('./routes');
var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var db = require('./utils/sql');
var util = require('./utils/util');
var workDecoder = require('./work/workDecoder');
var workUploader = require('./work/workUploader');
var sql = require('./utils/sql');
var log4js = require('log4js');
log4js.configure(config.loggerConfig);

var main = function () {
    sql.getMachine(config.machineName)
        .then(function (machine) {
            console.log('Searching Files in dir: ' + config.fileDirectory);
            console.log('Date: ' + new Date());
            console.log('----------------------');
            util.getFilesInDir(config.fileDirectory)
                .then(function (list) {
                    list.forEach(function (file) {
                        if ((/[ldb]+/g).test(file)) {
                            var filesJson = {};
                            try{
                                filesJson = require('./files');
                            }catch(err){
                                filesJson = {files:[]};
                            }

                            var foundFile = util.findFile(filesJson, file);
                            var filePath = config.fileDirectory + file;
                            var fileInfo = util.getFileInfo(filePath);

                            if (foundFile) {
                                console.log('file found in files.json: ' + file);
                                if (Date(foundFile.mtime)) {
                                    if (Date(fileInfo.mtime) != Date(foundFile.mtime)) {
                                        console.log('importing changed file');
                                        var workObjs = workDecoder.decode(filePath);
                                        for (var i = 0; i < workObjs.length; i++) {
                                            workUploader.upload(workObjs[i], machine);
                                        }
                                        foundFile.mtime = fileInfo.mtime;
                                        console.log('finished importing changed file');
                                    } else {
                                        console.log('file has not changed');
                                    }
                                }

                            } else {
                                console.log('found new file: ' + file);
                                var fileObj = {
                                    fileName: file,
                                    mtime: fileInfo.mtime
                                };
                                filesJson.files.push(fileObj);
                                console.log('importing new file');
                                var workObjs = workDecoder.decode(filePath);
                                for (var i = 0; i < workObjs.length; i++) {
                                    workUploader.upload(workObjs[i], machine);
                                }
                                console.log('finished importing new file');
                            }

                            fs.writeFile('server/files.json', JSON.stringify(filesJson), function (err) {
                                if (err) {
                                    console.error('failed to write files.json');
                                }
                            });
                        }
                    });
                });

            console.log('----------------------');
            console.log('Finished Searching');
            console.log('----------------------');

        })
        .catch(function (err) {
            console.log(err);
        });

    setTimeout(main,config.rateInMillis);
};

main(); // start app
