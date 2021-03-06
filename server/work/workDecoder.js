var util = require('.././utils/util');
var fs = require('fs');

var createWorkObj = function (temp) {
    return {
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
        unknown2: util.getInt32(util.sub(temp, 0x12, 4)),
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
};

exports.decode = function (fileName) {
    var fd = fs.openSync(fileName, 'r');
    var workObjs = [];

    if (fd) {
        var stats = fs.fstatSync(fd);
        var buffer = new Buffer(stats.size);
        var bytesRead = fs.readSync(fd, buffer, 0, stats.size, 0);
        for (var i = 0; i < bytesRead; i += 128) {
            var workObj = createWorkObj(util.sub(buffer, i, 128));
            workObjs.push(workObj);
        }
    }

    fs.close(fd);

    return workObjs;
};