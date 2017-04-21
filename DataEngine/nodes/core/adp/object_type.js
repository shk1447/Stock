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
    function ObjectTypeNode(n) {
        var node = this;
        var connectorNode = RED.nodes.getNode(n.adp_connector);
        this.active = n.active;
        this.ObjectType = n.ObjectType;
        this.adp_connector = connectorNode;
        this.ObjectId = n.ObjectId;
        this.TimeField = n.TimeField;
        this.Interval = n.Interval;
        this.Query = n.Query;
        this.Collector = n.Collector;
        this.statusby = n.StatusBy;
        this.ColorRange = n.ColorRange;
        this.Children = n.Children;
        this.Metrics = n.Metrics;
        var url = encodeURI("http://" + this.adp_connector.ip + ":" + this.adp_connector.port + "/datamanager/temporary/deploy?SiteId="
                             + RED.settings.siteId + "&id=" + this.id);
        var opts = urllib.parse(url);
        opts.method = "GET";
        try {
            var request = http.request(opts, function(response){
                (false) ? response.setEncoding('binary') : response.setEncoding('utf8');
                var msg;
                response.on('data',function(chunk) {
                    msg = chunk;
                });
                response.on('end',function() {
                                  
                });
            });
            request.on('error',function(err) {
                
            });
            if (opts.method === "POST") {
                request.write("nothing");
            }
            request.end();
        } catch (err) {
            res.statusCode = 500;
            res.send("Fail");
        }
        RED.nodes.createNode(this,n);

        this.on("input",function(msg) {
            try {
                this.send(msg);
            } catch(err) {
                this.error(err,msg);
            }
        });
    }

    RED.nodes.registerType("ObjectType",ObjectTypeNode);

    function AdpConnectorNode(n) {
        var node = this;
        this.ip = n.ip;
        this.port = n.port;
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
    RED.nodes.registerType("adp_connector",AdpConnectorNode);

    function RuleNode(n) {
        var node = this;
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
    RED.nodes.registerType("rule",RuleNode);

    ObjectTypeNode.prototype.close = function() {

    };

    RED.httpAdmin.get("/collectors", function(req,res){
        var url = encodeURI("http://" + req.query.ip + ":" + req.query.port + "/datamanager/collector");
        var opts = urllib.parse(url);
        opts.method = "GET";
        try {
            var request = http.request(opts, function(response){
                (false) ? response.setEncoding('binary') : response.setEncoding('utf8');
                var msg;
                response.on('data',function(chunk) {
                    msg = chunk;
                });
                response.on('end',function() {
                    res.statusCode = response.statusCode;
                    if(msg !== undefined) {
                        res.send(JSON.parse(msg));
                    }
                });
            })
            request.on('error',function(err) {
                // 실패여야 하지만 Sample로 데이터 전달되도록 작업 진행...
                var msg = ["Collector01","Collector02"];
                res.send(msg);
            });
            if (opts.method === "POST") {
                request.write("nothing");
            }
            request.end();
        } catch (err) {
            res.statusCode = 500;
            res.send("Fail");
        }
    });

    RED.httpAdmin.get("/schema", function(req,res) {
        // Collector 선택시에 호출되는 api
        // 해당 컬렉터에 정의되어진 외부 데이터에 대한 스키마 정보를 받아온다.
        var url = encodeURI("http://" + req.query.ip + ":" + req.query.port + "/datamanager/schema?collector="+ req.query.collector);
        var opts = urllib.parse(url);
        opts.method = "GET";
        try {
            var request = http.request(opts, function(response){
                (false) ? response.setEncoding('binary') : response.setEncoding('utf8');
                var msg;
                response.on('data',function(chunk) {
                    msg = chunk;
                });
                response.on('end',function() {
                    res.statusCode = response.statusCode;
                    if(msg !== undefined) {
                        res.send(JSON.parse(msg));
                    }
                });
            })
            request.on('error',function(err) {
                // 실패여야 하지만 Sample로 데이터 전달되도록 작업 진행...
                var msg = ["maria","mongo", "mssql"];
                res.send(msg);
            });
            if (opts.method === "POST") {
                request.write("nothing");
            }
            request.end();
        } catch (err) {
            res.statusCode = 500;
            res.send("Fail");
        }
    });

    RED.httpAdmin.get("/metrics", function(req,res){
        // Color Define or Metric Rule Tab 이동시 호출되는 api
        // ADP쪽으로 node_id를 보내서 해당 ObjectType에 대한 Metric정보를 받아온다.
        var url = encodeURI("http://" + req.query.ip + ":" + req.query.port + "/datamanager/temporary/metrics?Siteid="
                             + RED.settings.siteId + "&id=" + req.query.id);
        var opts = urllib.parse(url);
        opts.method = "GET";
        try {
            var request = http.request(opts, function(response){
                (false) ? response.setEncoding('binary') : response.setEncoding('utf8');
                var msg;
                response.on('data',function(chunk) {
                    msg = chunk;
                });
                response.on('end',function() {
                    res.statusCode = response.statusCode;
                    if(msg !== undefined) {
                        res.send(JSON.parse(msg));   
                    }                    
                });
            })
            request.on('error',function(err) {
                // 실패여야 하지만 Sample로 데이터 전달되도록 작업 진행...
                var msg = ["metric01","metric02"];
                res.send(msg);
            });
            if (opts.method === "POST") {
                request.write("nothing");
            }
            request.end();
        } catch (err) {
            res.statusCode = 500;
            res.send("Fail");
        }
    });

    RED.httpAdmin.post("/temporary/objecttype/:type", function(req,res){
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
                // ui 작업을 위해 200 전송
                res.statusCode = 400;
                res.send();
            });
            if (opts.method === "POST") {
                request.write(JSON.stringify(req.body.data));
            }
            request.end();
        } catch (err) {

        }
    });

    RED.httpAdmin.post("/execute/:id/:state", function(req,res) {
        var node = RED.nodes.getNode(req.params.id);
        node.status({fill:"red",shape:"ring",text:req.params.state});
        if (node != null) {
            try {
                var url = encodeURI("http://" + req.body.connector.ip + ":" + req.body.connector.port
                            + "/datamanager/collector/"+ req.params.state +"?SiteId=" + RED.settings.siteId + "&id=" + req.body.data.id + "&Collector=" + req.body.data.Collector);
                var opts = urllib.parse(url);
                opts.method = "POST";
                opts.contentType = "application/json";
                var request = http.request(opts, function(response){
                    (false) ? response.setEncoding('binary') : response.setEncoding('utf8');
                    var msg;
                    response.on('data',function(chunk) {
                        msg = chunk;
                    });
                    response.on('end',function() {
                        console.log(msg);
                        res.statusCode = 200;
                        res.send("성공했다");
                    });
                });
                request.on('error',function(err) {
                    console.log(error);
                    res.statusCode = 400;
                    res.send("실패했다");
                });
                if (opts.method === "POST") {
                    request.write(JSON.stringify(req.body.data));
                }
                request.end();
            } catch(err) {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
