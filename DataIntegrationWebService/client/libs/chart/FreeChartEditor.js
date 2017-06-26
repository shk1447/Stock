var d3 = require('d3');
var connector = require('../connector/WebSocketClient.js')
var editor = (function () {
    var gridSize = 20;
    var space_width = 5000;
    var space_height = 5000;
    var outer, vis;
    var lasso = null;
    var mouse_position = null;
    var data_callback = null;
    var tabInfo = null;
    var panning = false;
    var isSpace = false;

    $(window).on('keydown', function(e){
        if(e.which === 32) {
            outer.style("cursor", "move");
            isSpace = true;
        }
    }).on('keyup', function(e) {
        if(e.which === 32) {
            outer.style("cursor", "crosshair");
            isSpace = false;
        }
    });

    var canvasContextMenu = function() {
        d3.event.preventdefault();
    };
    var canvasMouseUp = function() {        
        if(lasso) {
            if(panning) {
                panning = false;
                lasso.remove();
                lasso = null;
                return;
            }
            var action = {
                name : 'addCluster'
            }
            var x = parseInt(lasso.attr("x"));
            var y = parseInt(lasso.attr("y"));
            var w = parseInt(lasso.attr("width"));
            var h = parseInt(lasso.attr("height"));
            data_callback(action).then(function(result){
                if(result.action != 'cancel') {
                    let conditions = [];
                    var sort = {"field":"","method":"ASC",limit:""};
                    _.each(result.data, function(value,key){
                        if(key.includes("sort_field")) sort["field"] = value;
                        if(key.includes("sort_method")) sort["method"] = value;
                        if(key.includes("sort_limit")) sort["limit"] = value;
                        if(value !== "" && key !== "name" && !key.includes("sort_")) {
                            var field = tabInfo.view_data.fields.find(function(d){return d.value == key;});
                            var condition = '';
                            if(field && field.type == 'Text' && !value.includes('<') && !value.includes('>') && !value.includes('=')) {
                                condition = 'data.' + key + '.includes("' + value + '")'
                            } else {
                                condition = 'data.' + key + value;
                            }
                            conditions.push(condition);
                        }
                    });

                    tabInfo.clusters.push({
                        name:result.data.name,
                        x:x,
                        y:y,
                        w:w,
                        h:h,
                        conditions : conditions,
                        sort : sort
                    });
                    redraw();
                }
                lasso.remove();
                lasso = null;
            })
        }
    };
    var canvasMouseDown = function() {
        if(isSpace) {
            panning = true;
        }
        var point = d3.mouse(this);
        lasso = vis.append("rect")
                .attr("ox", point[0])
                .attr("oy", point[1])
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("x", point[0])
                .attr("y", point[1])
                .attr("width", 0)
                .attr("height", 0)
                .attr("class", "lasso");
    };
    var canvasMouseMove = function() {
        var selector = d3.select(this);
        if (lasso) {
            var ox = parseInt(lasso.attr("ox"));
            var oy = parseInt(lasso.attr("oy"));
            var x = parseInt(lasso.attr("x"));
            var y = parseInt(lasso.attr("y"));
            var w, h;
            mouse_position = d3.touches(this)[0] || d3.mouse(this);
            var left = true;
            var up = true;
            if (mouse_position[0] < ox) {
                x = mouse_position[0];
                w = ox - x;
            } else {
                w = mouse_position[0] - x;
                left = false;
            }
            if (mouse_position[1] < oy) {
                y = mouse_position[1];
                h = oy - y;
            } else {
                h = mouse_position[1] - y;
                up = false;
            }
            if(panning) {
                var pos = vis.node().transform.baseVal[0].matrix;
                var curr = {
                    x : pos.e,
                    y : pos.f
                }
                var mx = left ? curr.x-w : curr.x+w;
                var my = up ? curr.y-h : curr.y+h;
                if((curr.x <= 0 && mx > 0)||(curr.y <= 0 && my > 0) || (curr.y >= 5000 && my < 5000)||(curr.x >= 5000 && mx <  0)) {
                    return;
                }
                selector.attr("transform", "translate("+mx+","+my+")")
            } else {
                lasso.attr("x", x).attr("y", y).attr("width", w).attr("height", h);
            }
        }
    };
    var canvasDoubleClick = function() {
        console.log("double click!!")
    };

    var getInnerData = function(d) {
        var innerData = _.cloneDeep(tabInfo.view_data.data.filter(function(data){
            let condition = '';
            _.each(d.conditions,function(row,i){
                condition += row + " && ";
            });
            condition += "true";
            return eval(condition);
        }));
        if(d.sort.field !== "") {
            innerData.sort(function(a,b){
                let compare01 = a[d.sort.field];
                let compare02 = b[d.sort.field];
                if(parseFloat(compare01)) {
                    compare01 = parseFloat(compare01);
                    compare02 = parseFloat(compare02);
                }
                return compare01 < compare02 ? (d.sort.method === "ASC" ? -1 : 1)
                                                : compare01 > compare02 ? (d.sort.method === "ASC" ? 1 : -1) : 0;
            });
        }
        if(d.sort.limit !== "") {
            innerData = innerData.splice(0, parseInt(d.sort.limit));;
        }
        return innerData;
    }

    var calculateLayout = function(d, innerData) {
        var width, height, row, col;
        var ratio = d.w / d.h;
        var prev;
        for(var i = innerData.length; i > 0; i--) {
            let dynamic_row = Math.ceil(innerData.length / i);
            let dynamic_w = d.w / i;
            let dynamic_h = d.h / dynamic_row;
            let dynamic_ratio = dynamic_w/dynamic_h;
            let gap = Math.abs(dynamic_ratio - ratio);
            if(prev === undefined) {
                prev = gap;
            } else {
                if(prev > gap) {
                    prev = gap;
                    width = dynamic_w;
                    height = dynamic_h;
                    col = i;
                    row = dynamic_row;
                }
            }
        }
        return {
            width:width,
            height:height,
            row:row,
            col:col
        };
    }

    var redrawInner = function(d, node) {
        var margin_x = 10;
        var margin_y = 10;
        var innerData = getInnerData(d);
        var layout = calculateLayout(d, innerData);

        var inner_node = node.selectAll(".innergroup").data(innerData);
        // 내부 노드 삭제
        inner_node.exit().remove();
        // 내부 노드 갱신
        inner_node.each(function(d,i){
            var node = d3.select(this);
            var offset_x = (i % layout.col);
            var offset_y = Math.floor(i / layout.col);
            let x = (offset_x * layout.width) + margin_x;
            let y = (offset_y * layout.height) + margin_y;
            node.attr("id", d.name + "_" + d.category)
                .attr("transform", "translate(" + x + "," + y + ")");

            node.select('text').attr("class", "node_label")
                .attr("x", (layout.width - (margin_x*2))/2).attr("y",(layout.height - (margin_y*2))/2)
                .attr("dy", ".35em").attr("text-anchor", "middle").text(d.category);
            
            node.select('rect')
                .attr("width", layout.width - (margin_x*2))
                .attr("height", layout.height - (margin_y*2))
        });
        // 내부 노드 추가
        inner_node.enter().insert("svg:g").attr("class", "node innergroup").each(function(d,i){
            var node = d3.select(this);
            var offset_x = (i % layout.col);
            var offset_y = Math.floor(i / layout.col);
            let x = (offset_x * layout.width) + margin_x;
            let y = (offset_y * layout.height) + margin_y;
            node.attr("id", d.name + "_" + d.category)
                .attr("transform", "translate(" + x + "," + y + ")");

            node.append("svg:text").attr("class", "node_label")
                .attr("x", (layout.width - (margin_x*2))/2).attr("y",(layout.height - (margin_y*2))/2)
                .attr("dy", ".35em").attr("text-anchor", "middle").text(d.category);

            node.append("rect")
                .attr("width", layout.width - (margin_x*2))
                .attr("height", layout.height - (margin_y*2))
                .attr("class", "inode")
                .on("mouseover", function(d, i) {
                    outer.style("cursor", "hand");
                    var node = d3.select(this);
                    node.classed("inode_hovered", true);
                })
                .on("mouseout", function(d, i) {
                    outer.style("cursor", "crosshair");
                    var node = d3.select(this);
                    node.classed("inode_hovered", false);
                })
                .on("mouseup", function(d, i){
                    d3.event.stopPropagation();
                })
                .on("mousedown", function(d, i){
                    d3.event.stopPropagation();
                })
                .on("dblclick", function(d, i) {
                    var action = {
                        name : 'showInfoPanel',
                        data : d
                    }
                    data_callback(action).then(function(result){
                        console.log('info panel callback')
                    });
                })
                .on("click",function(d,i){
                    var node = d3.select(this);
                    d3.selectAll('.inode').classed("active", false);
                    node.classed("active", true);
                    var action = {
                        name : 'clickInfo',
                        data : d
                    }
                    data_callback(action).then(function(result){
                        console.log('info panel callback')
                    });
                })
        })
    }

    var redraw = function() {
        var position = vis.node().transform.baseVal[0].matrix;
        var curr = {
            x: position.e,
            y: position.f
        }
        vis.attr("transform", "translate("+curr.x+","+curr.y+")");
        var cluster_node = vis.selectAll(".nodegroup").data(tabInfo.clusters);
        // remove
        cluster_node.exit().remove();
        // update
        cluster_node.each(function(d,i){
            var node = d3.select(this);

            node.attr("id", d.name)
                .attr("transform", "translate(" + d.x + "," + d.y + ")");
            node.select("text").text(d.name);
            node.select("rect").attr("width", d.w).attr("height", d.h);

            redrawInner(d, node);
        });
        // add
        cluster_node.enter().insert("svg:g").each(function(d,i){
            var node = d3.select(this);
            node.attr("id", d.name)
                .attr("class", "node nodegroup")
                .attr("transform", "translate(" + d.x + "," + d.y + ")");
            node.append("svg:text").attr("class", "node_label").attr("y",-10).attr("x", 10).attr("dy", ".35em").attr("text-anchor", "left").text(d.name);
            node.append("rect").attr("width", d.w).attr("height", d.h)
                .attr("class", "lasso")
                .on("mouseover", function(d, i) {
                    outer.style("cursor", "hand");
                    var node = d3.select(this);
                    node.classed("lasso_hovered", true);
                })
                .on("mouseout", function(d, i) {
                    outer.style("cursor", "crosshair");
                    var node = d3.select(this);
                    node.classed("lasso_hovered", false);
                })
                .on("mouseup", function(d, i){
                    d3.event.stopPropagation();
                })
                .on("mousedown", function(d, i){
                    d3.event.stopPropagation();
                })
                .on("dblclick",function(d, i) {
                    var action = {
                        name : 'showPlaybackPanel'
                    }
                    data_callback(action).then(function(result){
                        console.log('playback panel callback')
                    });
                });

            redrawInner(d, node);
        });
    }

    var instance = {
        initialize : function(id, callback) {
            data_callback = callback;
            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", space_width)
                        .attr("height", space_height)
                        .attr("pointer-events", "all")
                        .style("cursor", "crosshair");
            vis = outer.append("svg:g")
                       .append("svg:g")
                       .attr("transform", "translate(-"+space_width/2+",-"+space_height/2+")")
                       .on("dblclick", canvasDoubleClick)
                       .on("mousemove", canvasMouseMove)
                       .on("mousedown", canvasMouseDown)
                       .on("mouseup", canvasMouseUp)
                       .on("contextmenu", canvasContextMenu);
            var outer_background = vis.append("svg:rect")
                                   .attr("width", space_width)
                                   .attr("height", space_height)
                                   .attr("fill", "#fff");

            var gridScale = d3.scaleLinear().range([0, space_width]).domain([0, space_width]);
            var grid = vis.append("g");

            grid.selectAll("line.horizontal").data(gridScale.ticks(space_width / gridSize)).enter()
                .append("line").attr("class", "horizontal")
                .attr("x1",0).attr("x2",space_width)
                .attr("y1", function(d) { return gridScale(d); })
                .attr("y2", function(d) { return gridScale(d); })
                .attr("fill", "none").attr("shape-rendering", "crispEdges")
                .attr("stroke", "#eee").attr("stroke-width", "1px");

            grid.selectAll("line.vertical").data(gridScale.ticks(space_width / gridSize)).enter()
                .append("line").attr("class", "vertical")
                .attr("y1", 0).attr("y2", space_width)
                .attr("x1", function(d) { return gridScale(d) })
                .attr("x2", function(d) { return gridScale(d) })
                .attr("fill", "none").attr("shape-rendering", "crispEdges")
                .attr("stroke", "#eee").attr("stroke-width", "1px");
        },
        setTab : function(tab){
            tabInfo = tab;
            redraw();
        },
        getTab : function() {
            return tabInfo;
        },
        setData : function(data) {
            tabInfo['view_data'] = data;
            redraw();
        }
    };
    return instance;
})();

module.exports = editor;