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
    var net = require('net');
    var express = require('express');
    function DataReceiverNode(n) {
        var node = this;
        this.name = n.name;
        this.port = n.port;
        this.path = n.path;
        this.app = express();
        this.app.post(this.path, function(req,res){
            var bodyStr = '';
            req.on("data", function(chunk){
                bodyStr += chunk.toString();
            });
            req.on("end", function(){
                try {
                    var json = JSON.parse(bodyStr);
                    var msg = { 
                        id : node.id,
                        data : json
                    };
                    node.send(msg);
                    res.send(json);
                } catch(err) {
                    res.statusCode = 400;
                    res.send(err);
                }
            });
        });
        
        this.server = this.app.listen(this.port, function(){
            console.log(node.name + " has started on port ", node.port);
        });
        RED.nodes.createNode(this,n);
        this.on("input",function(msg) {
            try {
                this.send(msg);
                msg = null;
            } catch(err) {
                this.error(err,msg);
            }
        });
    }

    RED.nodes.registerType("DataReceiver",DataReceiverNode);

    DataReceiverNode.prototype.close = function() {
        this.server.close();
    };
    var portInUse = function(port, callback) {
        var server = net.createServer(function(socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });

        server.listen(port);
        server.on('error', function (e) {
            callback(false);
        });
        server.on('listening', function (e) {
            server.close();
            callback(true);
        });
    };
    RED.httpAdmin.get("/datareceiver/validate", function(req,res) {
        portInUse(req.query.port, function(possible){
            if(possible) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        });
    });
}
