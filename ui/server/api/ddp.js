var http = require('http');
var DDPServer = require('nuxjs/server/DDPServer');
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './modules');
var _ = require('lodash');

module.exports = function(app, conf) {
    var server = new DDPServer({httpServer: app.server, port: conf.listen.ddpPort});
    _.each(modules, function(_apis, _name) {
        server.methods(_apis);
    });
};