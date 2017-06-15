var d3 = require('d3');
var editor = (function () {
    var gridSize = 20;
    var space_width = 5000;
    var space_height = 5000;
    var outer, vis;
    var instance = {
        initialize : function(id) {
            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", space_width)
                        .attr("height", space_height)
                        .attr("pointer-events", "all")
                        .style("cursor", "crosshair");
            vis = outer.append("svg:g")
                       .append("svg:g")
                       .on("mousemove", function(e) {})
                       .on("mousedown", function(e) {})
                       .on("mouseup", function(e) {})
                       .on("contextmenu", function(e) {});
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
        }
    };
    return instance;
})();

module.exports = editor;