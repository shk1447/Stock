/**
 * Created by shkim on 2016-06-27.
 */
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './router');
var _ = require('lodash');

module.exports = function(app) {
    _.each(modules, function(router, _name) {
        _.each(router, function(func, route) {
            if(_name == "get") {
                app.get(route, func);
            } else if (_name == "post") {
                app.post(route, func);
            }
        });
    });
};