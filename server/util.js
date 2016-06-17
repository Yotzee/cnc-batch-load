var fs = require('fs');

exports.getFileInfo = function (path) {
    return fs.statSync(path);
};

exports.findFile = function(filesJson, file) {
    for (var i = 0; i < filesJson.files.length; i++) {
        if (filesJson.files[i].fileName === file) {
            return filesJson.files[i];
        }
    }
    return filesJson.files[i];
};

exports.getString = function(data) {
    var buf = new Buffer(data);
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i] === 0) {
            count = i;
        }
    }
    return buf.toString('ascii', 0, count).replace(/\0/g, '');
};

exports.getInt32 = function(data) {
    var buf = new Buffer(data);
    return buf.readUInt32LE(0);
};

exports.getInt = function(data) {
    var buf = new Buffer(data);
    return buf.readUInt16LE(0);
};

exports.getByte = function(data) {
    var buf = new Buffer(data);
    return buf.readUInt8(0);
};

exports.sub = function (data, start, finish) {
    var d = [];
    finish = start + finish;
    for (var i = start; i < finish; i++) {
        if (finish > data.length) {
            break;
        }
        d.push(data[i]);
    }
    return d;
};