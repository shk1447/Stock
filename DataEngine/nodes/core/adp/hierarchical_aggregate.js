/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var urllib = require("url");
    var http = require("follow-redirects").http;
    var https = require("follow-redirects").https;

    function HANode(n) {
        var node = this;
        this.Name = n.Name;
        this.HQuery = n.HQuery;
        this.Aquery = n.Aquery;
        this.ObjectType = n.ObjectType;
        console.log(this.ObjectType);
        this.on("input",function(msg) {
            try {
                this.send(msg);
            } catch(err) {
                this.error(err,msg);
            }
        });
    }

    RED.nodes.registerType("Aggregate",HANode);

    HANode.prototype.close = function() {

    };

    RED.httpAdmin.post("/temporary/aggregate/:type", function(req,res) {
        var type = req.params.type;
        var url = encodeURI("http://" + req.body.connector.ip + ":" + req.body.connector.port
                            + "/datamanager/temporary?SiteId=" + RED.settings.siteId + "&id=" + req.body.data.id);
        var opts = urllib.parse(url);
        opts.method = type === "save" ? "POST" : "DELETE";
        try {
            var request = http.request(opts, function(response){
                (false) ? response.setEncoding('binary') : response.setEncoding('utf8');
                var msg;
                response.on('data',function(chunk) {
                    msg = chunk;
                });
                response.on('end',function() {
                    res.statusCode = 200;
                    res.send();
                });
            })
            request.on('error',function(err) {
                res.statusCode = 400;
                res.send();
            });
            if (opts.method === "POST") {
                request.write(JSON.stringify(req.body.data));
            }
            request.end();

            // res.statusCode = 200;
            // res.send("성공했다");
        } catch (err) {

        }
    });
}
