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

    var canvasContextMenu = function() {
        d3.event.preventdefault();
    };
    var canvasMouseUp = function() {
        var x = parseInt(lasso.attr("x"));
        var y = parseInt(lasso.attr("y"));
        var w = parseInt(lasso.attr("width"));
        var h = parseInt(lasso.attr("height"));
        data_callback(lasso).then(function(result){
            if(result.action != 'cancel') {
                tabInfo.clusters.push({
                    name:result.data.name,
                    x:x,
                    y:y,
                    w:w,
                    h:h,
                });
                redraw();
            }
            lasso.remove();
            lasso = null;
        })
    };
    var canvasMouseDown = function() {
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
            lasso
            .attr("x", x)
            .attr("y", y)
            .attr("width", w)
            .attr("height", h);
        }
    };
    var canvasDoubleClick = function() {
        console.log("double click!!")
    };

    var redraw = function() {
        var cluster_node = vis.selectAll(".nodegroup").data(tabInfo.clusters, function(d){
            return d.name;
        });
        cluster_node.exit().remove();
        var clusterEnter = cluster_node.enter().insert("svg:g")
                            .attr("class", "node nodegroup");
        clusterEnter.each(function(d,i){
            var node = d3.select(this);
            node.attr("id", d.name)
                .attr("transform", "translate(" + d.x + "," + d.y + ")");
            node.append("svg:text").attr("class", "node_label").attr("y",-10).attr("x", 10).attr("dy", ".35em").attr("text-anchor", "left").text(d.name);
            node.append("rect")
                .attr("width", d.w)
                .attr("height", d.h)
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
        })
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
        }
    };
    return instance;
})();

module.exports = editor;