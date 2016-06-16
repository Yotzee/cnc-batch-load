var app = require('express')();
var config = require('./config');
var fs = require('fs');
var path = require('path');
//var fileName = 'server/20160321.lbd';
var log4js = require('log4js');


log4js.configure({
    appenders: [
        {type: 'console'}
    ],
    replaceConsole: true
});

run();
function run() {
    console.log('Searching Files in dir: ' +  config.fileDirectory);
    console.log('Date: ' +  new Date());
    console.log('----------------------');
    fs.readdir(config.fileDirectory, function (err, list) {
        list.forEach(function (file) {
            if ((/[ldb]+/g).test(file)) {
                var filesJson = require('./files');
                var foundFile = findFile(filesJson, file);
                var filePath = config.fileDirectory + file;
                var fileInfo = getFileInfo(filePath);

                if (foundFile) {
                    console.log('file found in files.json: ' + file);
                    console.log(Date(foundFile.mtime));
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
}

function getFileInfo(path) {
    return fs.statSync(path);
}
function findFile(filesJson, file) {
    for (var i = 0; i < filesJson.files.length; i++) {
        if (filesJson.files[i].fileName === file) {
            return filesJson.files[i];
        }
    }
    return filesJson.files[i];
}


function getString(data) {
    var buf = new Buffer(data);
    return buf.toString('utf8');
}
function getInt32(data) {
    var buf = new Buffer(data);
    return buf.readUInt32LE(0);
}

function getInt(data) {
    var buf = new Buffer(data);
    return buf.readUInt16LE(0);
}

function getByte(data) {
    var buf = new Buffer(data);
    return buf.readUInt8(0);
}

function decode(fileName) {
    var rs = fs.createReadStream(fileName);
    var count = 2;
    rs.on('data', function (chunk) {
        //console.log(chunk);
        for (var i = 0; i < chunk.length; i += 128) {
            var temp = sub(chunk, i, 128);
            var obj =
            {
                SPDL_FB1: getInt(sub(temp, 0x00, 2)),
                SPDL_FB2: getInt(sub(temp, 0x02, 2)),
                SPDL_FB3: getInt(sub(temp, 0x04, 2)),
                SPDL_FB4: getInt(sub(temp, 0x06, 2)),
                ATMD_ALARM: getByte(sub(temp, 0x08, 1)),
                MNMD_NA: getByte(sub(temp, 0x09, 1)),
                SGNL_SGLB: getByte(sub(temp, 0x0B, 1)),
                SGNL_CUT: getByte(sub(temp, 0x0A, 1)),
                SPDL_ROT1: getInt(sub(temp, 0x0C, 2)),
                unknown1: getInt(sub(temp, 0x0E, 2)),
                SPDL_ROT2: getInt(sub(temp, 0x10, 2)),
                unknown2: getInt32(sub(temp, 0x12, 4)), //4 bytes in word not sure why ???
                SPDL_ROT3: getInt(sub(temp, 0x16, 2)),
                SPDL_ROT4: getInt(sub(temp, 0x18, 2)),
                PARTS_CNT: getInt32(sub(temp, 0x1A, 4)),
                SPDL_OVRD1: getInt(sub(temp, 0x1E, 2)),
                SPDL_OVRD2: getInt(sub(temp, 0x20, 2)),
                SPDL_OVRD3: getInt(sub(temp, 0x22, 2)),
                SPDL_OVRD4: getInt(sub(temp, 0x24, 2)),
                FEED_OVRD: getByte(sub(temp, 0x26, 1)),
                RAPID_OVRD: getByte(sub(temp, 0x27, 2)),
                WNO_NO: getString(sub(temp, 0x28, 32)),
                unknown3: getByte(sub(temp, 0x48, 1)),
                WNO_ATRB: getByte(sub(temp, 0x49, 1)),
                unknown: getString(sub(temp, 0x4A, 18)),
                ALARM_ATRB: getInt(sub(temp, 0x5C, 2)),
                ALARM_NO: getInt(sub(temp, 0, 2)),
                ALARM_CODE1: getInt(sub(temp, 0, 2)),
                ALARM_CODE2: getInt(sub(temp, 0, 2)),
                LARM_CODE3: getInt(sub(temp, 0, 2))
            };

            count++;
        }
    });
}

function sub(data, start, finish) {
    var d = [];
    finish = start + finish;
    for (var i = start; i < finish; i++) {
        if (finish > data.length) {
            break;
        }
        d.push(data[i]);
    }
    return d;
}

app.get('/read', function (req, res) {
    res.send('not working');
});

app.listen(config.server.port, function () {
    console.log('server started on port: ', config.server.port);
});
