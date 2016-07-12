/**
 * Created by shkim on 2016-06-22.
 */
var mongoconn = require('../mongoconn.js');

module.exports = {
    'report.load': function(_param, _callback) {
        mongoconn.findDoc("Report", _param, _callback);
    },
    'report.save': function(_param, _callback) {
        mongoconn.insertDoc("Report", _param, _callback);
    },
    'temp.report.load': function(_param, _callback) {
        mongoconn.findDoc("TempReport", _param, _callback);
    },
    'temp.report.save': function(_param, _callback) {
        mongoconn.insertDoc("TempReport", _param, _callback);
    }
};