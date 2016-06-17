var app = require('express')();
var config = require('./config');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var db = require('./sql');
var util = require('./util');
var log4js = require('log4js');
log4js.configure(config.loggerConfig);

db.getMachine(config.machineName, function(machine){
    console.log('here');
});

var run = function () {
    console.log('Searching Files in dir: ' + config.fileDirectory);
    console.log('Date: ' + new Date());
    console.log('----------------------');
    fs.readdir(config.fileDirectory, function (err, list) {
        list.forEach(function (file) {
            if ((/[ldb]+/g).test(file)) {
                var filesJson = require('./files');
                var foundFile = util.findFile(filesJson, file);
                var filePath = config.fileDirectory + file;
                var fileInfo = util.getFileInfo(filePath);

                if (foundFile) {
                    console.log('file found in files.json: ' + file);
                    if (Date(foundFile.mtime)) {
                        if (Date(fileInfo.mtime) != Date(foundFile.mtime)) {
                            console.log('importing changed file');
                            decode(filePath);
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
                    decode(filePath);
                    console.log('finished importing new file');
                }

                fs.writeFile('server/files.json', JSON.stringify(filesJson), function (err) {
                    if (err) {
                        console.error('failed to write files.json');
                    }
                });
            }
        });
        console.log('----------------------');
        console.log('Finished Searching');
        console.log('----------------------');
    });


    setTimeout(run, config.rateInMillis);
};

// run();

function decode(fileName) {
    var rs = fs.createReadStream(fileName);
    var count = 2;
    rs.on('data', function (chunk) {
        //console.log(chunk);
        for (var i = 0; i < chunk.length; i += 128) {
            var temp = util.sub(chunk, i, 128);
            var obj =
            {
                SPDL_FB1: util.getInt(util.sub(temp, 0x00, 2)),
                SPDL_FB2: util.getInt(util.sub(temp, 0x02, 2)),
                SPDL_FB3: util.getInt(util.sub(temp, 0x04, 2)),
                SPDL_FB4: util.getInt(util.sub(temp, 0x06, 2)),
                ATMD_ALARM: util.getByte(util.sub(temp, 0x08, 1)),
                MNMD_NA: util.getByte(util.sub(temp, 0x09, 1)),
                SGNL_SGLB: util.getByte(util.sub(temp, 0x0B, 1)),
                SGNL_CUT: util.getByte(util.sub(temp, 0x0A, 1)),
                SPDL_ROT1: util.getInt(util.sub(temp, 0x0C, 2)),
                unknown1: util.getInt(util.sub(temp, 0x0E, 2)),
                SPDL_ROT2: util.getInt(util.sub(temp, 0x10, 2)),
                unknown2: util.getInt32(util.sub(temp, 0x12, 4)), //4 bytes in word not sure why ???
                SPDL_ROT3: util.getInt(util.sub(temp, 0x16, 2)),
                SPDL_ROT4: util.getInt(util.sub(temp, 0x18, 2)),
                PARTS_CNT: util.getInt32(util.sub(temp, 0x1A, 4)),
                SPDL_OVRD1: util.getInt(util.sub(temp, 0x1E, 2)),
                SPDL_OVRD2: util.getInt(util.sub(temp, 0x20, 2)),
                SPDL_OVRD3: util.getInt(util.sub(temp, 0x22, 2)),
                SPDL_OVRD4: util.getInt(util.sub(temp, 0x24, 2)),
                FEED_OVRD: util.getByte(util.sub(temp, 0x26, 1)),
                RAPID_OVRD: util.getByte(util.sub(temp, 0x27, 2)),
                WNO_NO: util.getString(util.sub(temp, 0x28, 32)),
                unknown3: util.getByte(util.sub(temp, 0x48, 1)),
                WNO_ATRB: util.getByte(util.sub(temp, 0x49, 1)),
                unknown: util.getString(util.sub(temp, 0x4A, 18)),
                ALARM_ATRB: util.getInt(util.sub(temp, 0x5C, 2)),
                ALARM_NO: util.getInt(util.sub(temp, 0, 2)),
                ALARM_CODE1: util.getInt(util.sub(temp, 0, 2)),
                ALARM_CODE2: util.getInt(util.sub(temp, 0, 2)),
                LARM_CODE3: util.getInt(util.sub(temp, 0, 2))
            };
            db.saveWorkRow(config.machineName, obj);
            if (count == 4187) {
                console.log(obj);
            }
            count++;
        }
    });
}


app.get('/read', function (req, res) {
    res.send('not working');
});

app.listen(config.server.port, function () {
    console.log('server started on port: ', config.server.port);
});
