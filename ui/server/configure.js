/**
 * Created by shkim on 2016-06-22.
 */

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var _ = require('lodash');

module.exports = {
    config: {},
    default : {
        listen : {
            bind : 'localhost',
            port : 7001,
            ddpPort : 7002
        },
        mongo : {
            url : 'mongodb://localhost:27017/test'
        }
    },
    set: function(cmd) {
        if (cmd.conf) {
            var config_path = path.join(__dirname, cmd.conf);
            this.config = yaml.safeLoad(fs.readFileSync(config_path, 'utf8'));
            this.config = _.merge(this.default, this.config, {
                listen: {
                    bind: cmd.bind,
                    port: cmd.port,
                    ddpPort: cmd.ddpPort
                },
                mongo: {
                    url: cmd.url
                }
            });
        }
        return this;
    },
    get: function() {
        return this.config;
    }
};