require('./chart.js');

module.exports = function () {
    var self = this;
    self.ChartPlayerEventType = {
        "preMapload": {
            callback: {}
        },
        "postMapload": {
            callback: {}
        }
    };

    function getInlineJS() {
        var js = "onmessage = function(e) { postMessage(e.data)}";
        var blob = new Blob([js], {"type": "text\/plain"});
        return URL.createObjectURL(blob);
    }

    var renderWorker = new Worker(getInlineJS());

    renderWorker.onmessage = onRenderMessage;

    function onRenderMessage (e) {
        switch (e.data.type) {
            case "draw":
                self.draw(); break;
            case "redraw":
                self.redraw(tempChart); break;
            case "drawZoomOut":
                drawZoomOut(); break;
            case "drawZoomIn":
                drawZoomIn(e.data.one, e.data.two); break;
            case "redrawControl" :
                redrawControl(); break;
            case "panning" :
                panning(e.data.param); break;
        }
    };

    Date.prototype.format = function(f) {
        if (!this.valueOf()) return " ";

        var weekName = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        var d = this;

        return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
            switch ($1) {
                case "yyyy": return d.getFullYear(); case "yy": return (d.getFullYear() % 1000).zf(2); case "MM": return (d.getMonth() + 1).zf(2);
                case "dd": return d.getDate().zf(2); case "E": return weekName[d.getDay()]; case "HH": return d.getHours().zf(2); case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case "mm": return d.getMinutes().zf(2); case "ss": return d.getSeconds().zf(2); case "a/p": return d.getHours() < 12 ? "AM" : "PM";
                default: return $1;
            }
        });
    };

    String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};



    String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
    Number.prototype.zf = function(len){return this.toString().zf(len);};

    var convertDateToTimestamp = function(date) {
        if (date instanceof Date) {
            return Math.floor(date.getTime() / 1000);
        }
        return null;
    };

    var convertTimestampToDate = function(timestamp) {
        return new Date(timestamp * 1000);
    };

    self.controlContainer = [];
    var controller = (function () {
        function controller(ctx, id, config, funct) {
            this.ctx = ctx, this.id = id, this.x = config.x, this.y = config.y, this.width = config.width, this.height = config.height, this.type = config.type, this.shape = config.shape;
            this.fill = config.fill || "gray", this.stroke = config.stroke || "skyblue", this.strokewidth = config.strokewidth, this.radius = config.radius || { lt : 5, lb : 5, rt : 5, rb : 5 };
            this.text = config.text, this.textfill = config.textfill, this.font = config.font, this.icon = config.icon, this.image = config.image, this.description = config.description, this.cursor = config.cursor;
            this.highlight = config.highlight, this.onColor = config.onColor, this.hover = config.hover, this.on = config.on, this.keeping = config.keeping, this.display = config.display;
            this.funct = funct, this.series = config.series, this.time = config.time, this.valueHop = config.valueHop;
            return (this);
        }

        controller.prototype.drawShape = function () {
            if(this.display) {
                this.ctx.save();
                switch (this.shape) {
                    case "circle":
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = this.stroke;
                        this.ctx.lineWidth = this.strokewidth;
                        this.ctx.arc(this.x + (this.width/2), this.y + (this.height/2), this.width/2, 0, Math.PI*2, true);
                        this.ctx.closePath();
                        if(this.image) {
                            var srcImage = this.hover ? this.highlight : this.on ? this.onColor : this.fill;
                            this.ctx.drawImage(srcImage, this.x, this.y, this.width, this.height);
                        } else {
                            this.ctx.fillStyle = this.fill;
                            this.ctx.fill();
                        }
                        this.ctx.stroke();
                        break;
                    case "rectangle":
                        this.ctx.strokeStyle = this.hover ? this.highlight : this.on ? this.onColor : this.stroke;
                        this.ctx.lineWidth = this.strokewidth;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.x + this.radius.lt, this.y);
                        this.ctx.lineTo(this.x + this.width - this.radius.rt, this.y), this.ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius.rt);
                        this.ctx.lineTo(this.x + this.width, this.y + this.height - this.radius.rb), this.ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius.rb, this.y + this.height);
                        this.ctx.lineTo(this.x + this.radius.lb, this.y + this.height), this.ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius.lb);
                        this.ctx.lineTo(this.x, this.y + this.radius.lt), this.ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius.lt, this.y);
                        this.ctx.closePath();
                        if(this.image) {
                            var srcImage = this.hover ? this.highlight : this.on ? this.onColor : this.fill;
                            this.ctx.drawImage(srcImage, this.x, this.y, this.width, this.height);
                        } else {
                            this.ctx.fillStyle = this.fill;
                            this.ctx.fill();
                        }
                        if(this.strokewidth > 0) this.ctx.stroke();
                        break;
                }
                this.ctx.restore();
            }
        }
        controller.prototype.drawText = function () {
            if(this.display) {
                this.ctx.save();
                this.ctx.fillStyle = this.hover ? this.highlight : this.on ? this.onColor : this.textfill;
                this.ctx.textBaseline = 'bottom';
                this.ctx.textAlign = 'center';
                if(this.icon) {
                    this.ctx.font = this.font + "px FontAwesome";
                    var items = this.text.split('|')
                    for(var i in items) {
                        this.ctx.fillText(String.fromCharCode(parseInt(items[i],16)), this.x + (this.width/2), this.y + (this.height/2) + (this.font/2));
                    }
                } else {
                    var tempText = this.text;
                    this.ctx.font = this.font + "px Open Sans";
                    if(this.ctx.measureText(this.text).width > this.width) tempText = "....";
                    this.ctx.fillText(tempText, this.x + (this.width / 2), this.y + (this.height/2) + (this.font*1/2));
                }
                this.ctx.restore();
            }
        }
        controller.prototype.clear = function () {
            this.ctx.clearRect(this.x-2, this.y-2, this.width+4, this.height+4);
        }
        controller.prototype.isPointInside = function (x, y) {
            if(!this.display) return false;
            return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
        }

        return controller;
    })();

    self.pointerArr = [];
    self.originPointerArr = [];
    var isOrigin = false;
    var standard = { top : 0, bottom : 0, left : 0, right : 0 };

    var panningDrag = {
        x: 0,
        y: 0,
        state: false
    };

    var zoomDrag = {
        elem: null,
        x: 0,
        y: 0,
        state: false
    };

    var delta = {
        x: 0,
        y: 0,
        p: 0
    };

    var prevZoomOverlay = {};
    var tempChart = {};
    var zoomHistory = [];

    function panning(d) {
        if (d.direction) {
            for(var y = 0; y < d.speed; y++) {

                var rightIndex = self.renderData.chart.times.findIndex(function (d) {
                    return d == tempChart.times[tempChart.times.length - 1]
                });
                if (rightIndex != self.renderData.chart.times.length - 1) {
                    tempChart.times.push(self.renderData.chart.times[rightIndex + 1]);
                    tempChart.labels.push(self.renderData.chart.labels[rightIndex + 1]);
                    tempChart.datasets.forEach(function (d, index) {
                        d.data.push(self.renderData.chart.datasets[index].data[rightIndex + 1])
                    });
                }
                if (tempChart.times.length > 1) {
                    tempChart.times.splice(0, 1), tempChart.labels.splice(0, 1), tempChart.datasets.forEach(function (d) {
                        d.data.splice(0, 1)
                    });
                }
            }
        } else {
            for(var y = 0; y < d.speed; y++) {
                var leftIndex = self.renderData.chart.times.findIndex(function (d) {
                    return d == tempChart.times[0]
                });
                if (leftIndex != 0) {
                    tempChart.times.splice(0, 0, self.renderData.chart.times[leftIndex - 1]);
                    tempChart.labels.splice(0, 0, self.renderData.chart.labels[leftIndex - 1]);
                    tempChart.datasets.forEach(function (d, index) {
                        d.data.splice(0, 0, self.renderData.chart.datasets[index].data[leftIndex - 1])
                    });
                }
                if (tempChart.times.length > 1) {
                    tempChart.times.pop(), tempChart.labels.pop(), tempChart.datasets.forEach(function (d) {
                        d.data.pop()
                    });
                }
            }
        }
        self.redraw($.extend(true, {}, tempChart));
    }

    function drawZoomOut() {
        var historyChart = zoomHistory.pop();
        tempChart = $.parseJSON(JSON.stringify(historyChart, function(k,v) {
            if( v === undefined) { return "undefined" }; return v;
        }));
        self.redraw(historyChart);
        if(zoomHistory.length == 0) {
            var resetZoomControl = self.controlContainer.find(function(d){return d.id == "ResetZoom"});
            resetZoomControl.display = false, resetZoomControl.clear();
        }
    }

    function drawZoomIn(range, d) {
        var inner = self.pointerArr.filter(function (d) {
            return d.pointX >= range.start && d.pointX <= range.end;
        });

        var zoomChart = {labels: [], datasets: [], times : []};
        var insertArr = [];

        for (var i in inner) {
            var a = tempChart.datasets[inner[i].series];

            var series = {
                fillColor: a.fillColor,
                strokeColor: a.strokeColor,
                pointColor: a.pointColor,
                markerShape: a.markerShape,
                pointStrokeColor: a.pointStrokeColor,
                data: [],
                title: a.title,
                id: a.id,
                unit: a.unit,
                datasetFill: a.datasetFill,
                tooltip: a.tooltip,
                visible: a.visible,
                hover: a.hover,
                axis: a.axis,
                type: a.type
            };

            if (!insertArr.includes(inner[i].label)) {
                insertArr.push(inner[i].label), zoomChart.labels.push(tempChart.labels[inner[i].label]), zoomChart.times.push(tempChart.times[inner[i].label]);
            }

            var seriesIndex = zoomChart.datasets.findIndex(function (d) {
                return d.title == a.title
            });
            if (seriesIndex === -1) {
                series.data.push(a.data[inner[i].label]);
                zoomChart.datasets.push(series);
            } else {
                zoomChart.datasets[seriesIndex].data.push(a.data[inner[i].label]);
            }
        }

        if (zoomChart.labels.length > 0) {
            zoomHistory.push(tempChart);
            tempChart = $.parseJSON(JSON.stringify(zoomChart, function(k,v) {
                if( v === undefined) { return "undefined" }; return v;
            }));

            self.redraw(zoomChart);
        }
    }

    function redrawControl() {
        var vratio = self.overlay.width / self.$container.width();
        var hratio = self.overlay.height / self.$container.height();
        var vgap = self.$container.width() - self.overlay.width;
        self.overlay.width = self.$container.width();
        self.overlay.height = self.$container.height();
        for(var index in self.controlContainer) {
            if(self.controlContainer[index].type != "navi" ) {
                if(self.controlContainer[index].keeping) {
                    self.controlContainer[index].x = self.controlContainer[index].x + vgap;
                } else {
                    self.controlContainer[index].x = self.controlContainer[index].x / vratio, self.controlContainer[index].width = self.controlContainer[index].width / vratio;
                    self.controlContainer[index].y =  self.controlContainer[index].y / hratio, self.controlContainer[index].height = self.controlContainer[index].height / hratio;
                }
                self.controlContainer[index].clear(), self.controlContainer[index].drawShape(), self.controlContainer[index].drawText();
            } else {
                self.controlContainer[index].clear(), self.controlContainer[index].drawShape(), self.controlContainer[index].drawText();
            }
        }
    }

    self.options = {
        chartType: "line",
        orderType : "Object",
        storedProcedure: "default",
        objectIds : [],
        start : 0,
        end : 0,
        fake: false,
        data: undefined,
        timeRangeSync : true,
        samplingMethod: "all",
        samplingInterval : 3600,
        xAxisField: undefined,
        fixedUnit:undefined,
        timeFormat:"yyyy-MM-dd\r\nHH:mm:ss",
        yAxisFormat:2,
        yMaximum:"smart",
        yMinimum:"smart",
        useControl: true,
        usePeriodControl: true,
        useCollaboration : false,
        style: {
            theme : "WHITE",
            table: {
                background: "#292829",
                titleFontSize: "18",
                titleFontColor: "#ffffff",
                titleFontAlign:"left",
                subTitleFontSize: "12",
                subTitleFontColor: "#ffffff",
                innerLineSize: "1",
                innerLineColor: "#575457",
                innerFontSize: "11",
                innerFontColor: "#a8a0a8",
                innerFontStyle: "normal",
                innerChartOptions: {
                    canvasBackgroundColor: 'none',
                    chartLineScale: 0,
                    scaleLineWidth: 0,
                    scaleLineColor: "rgba(0,0,0,0)",
                    animation : false,
                    xAxisBottom: false,
                    yAxisLeft: false,
                    yAxisRight: false,
                    legend: false,
                    inGraphDataShow: false,
                    detectAnnotateOnFullLine : false,
                    dynamicDisplay : false,
                    annotateDisplay: true,
                    annotateLabel: '<%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>',
                    annotatePadding: "5px 5px 5px 5px",
                    annotateFontFamily: "'Open Sans'",
                    annotateFontStyle: "normal normal",
                    annotateFontColor: "rgba(0,0,0,1)",
                    annotateFontSize: 11,
                    annotateBorderRadius: "3px",
                    annotateBorder: "2px rgba(170,170,170,0.7) solid",
                    annotateBackgroundColor: 'rgba(255,255,255,0.5)',
                    annotateFunction: "mousemove",
                    annotateRelocate: true,
                    scaleShowLine: false,
                    scaleShowGridLines: false,
                    logarithmic: false,
                    logarithmic2: false,
                    extrapolateMissingData : true,
                    detectMouseOnText : false,
                    fullWidthGraph: true,
                    canvasBorders: false,
                    scaleShowLabelBackdrop: false,
                    yMaximum : "smart",
                    yMinimum : "smart",
                    yAxisFormat : 2,
                    pointHitDetectionRadius : 10,
                    spaceLeft: 20,
                    spaceRight: 20,
                    spaceTop: 20,
                    spaceBottom: 20,
                    endDrawDataFunction : function(a,b,c,d,e,f,g) {
                        var navigator = self.controlContainer.find(function(h) { return h.id == "navigator"});
                        if(navigator) {
                            navigator.clear();
                        }
                    }
                }
            },
            chart: {
                canvasBackgroundColor: '#292829',
                graphTitle: "",
                graphTitleFontFamily: "'Open Sans'",
                graphTitleFontStyle: "normal normal",
                graphTitleFontColor: "#ffffff",
                graphTitleFontSize: 18,
                graphSubTitle: "",
                graphSubTitleFontFamily: "'Open Sans'",
                graphSubTitleFontStyle: "normal normal",
                graphSubTitleFontColor: "#ffffff",
                graphSubTitleFontSize: 12,
                graphAlign : "left",
                graphPosX : 50,
                scaleFontFamily: "'Open Sans'",
                scaleFontStyle: "normal normal",
                scaleFontColor: "#a8a0a8",
                scaleFontSize: 11,
                scaleLineStyle: "solid",
                scaleLineWidth: 1,
                scaleLineColor: "#575457",
                scaleXGridLinesStep: 1000,
                scaleYGridLinesStep: 1,
                scaleShowLine: true,
                scaleShowLabels: true,
                scaleShowGridLines: true,
                scaleGridLineStyle: "shortDash",
                scaleGridLineWidth: 1,
                scaleGridLineColor: "#575457",
                yAxisUnit: "",
                yAxisUnit2: "",
                yAxisUnitFontFamily: "'Open Sans'",
                yAxisUnitFontStyle: "normal normal",
                yAxisUnitFontColor: "#a8a0a8",
                yAxisUnitFontSize: 11,
                yAxisLeft: true,
                yAxisRight: false,
                yAxisMinimumInterval: "smart",
                yAxisMinimumInterval2: "smart",
                yAxisFormat : 2,
                yMaximum : "smart",
                yMinimum : "smart",
                showXLabels: "smart",
                rotateLabels: 0,//"smart",
                legendFontFamily: "'Open Sans'",
                legendFontStyle: "normal normal",
                legendFontColor: "#ffffff",
                legendFontSize: 12,
                seriesColor : ["#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff",
                    "#55BF3B", "#8d4654", "#7798BF", "#aaeeee","#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                annotateDisplay: true,
                annotateLabel: '<%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>',
                xAxisSpaceBetweenLabels: 100,
                detectAnnotateOnFullLine : false,
                spaceLeft: 20,
                spaceRight: 20,
                spaceTop: 20,
                spaceBottom: 20,
                bezierCurve: true,
                bezierCurveTension: 0,
                reverseLegend : true,
                dynamicDisplay : false,
                pointHitDetectionRadius : 10,
                initFunction : function(a,b,c) {
                    for(var i in c.datasets) {
                        if(!c.datasets[i].visible) {
                            c.datasets[i].pointColor = "rgba(0,0,0,0)";
                            c.datasets[i].fillColor = "rgba(0,0,0,0)";
                            c.datasets[i].strokeColor = "rgba(0,0,0,0)";
                            c.datasets[i].tooltip = false;
                        }
                    }
                },
                beforeDrawFunction : function() {
                },
                endDrawDataFunction : function(a,b,c,d,e,f,g) {
                    if(g.animationValue == 1) {
                        if(self.options.chartType.toLowerCase() !== 'pie') {
                            self.pointerArr = [];
                            if(isOrigin) self.originPointerArr = [];
                            standard = { top : g.startY, bottom : g.endY, left : g.startX, right : g.endX }
                            var canvasWidth = self.canvas.width;

                            for(var i in d) {
                                var index = 0;
                                for(var j in d[i]) {
                                    var lot = d[i][j];
                                    if(typeof lot.time == "undefined") continue;
                                    var pointer = {
                                        pointX : lot.posX, pointY : lot.posY,
                                        left : lot.xPosLeft, right : lot.xPosRight, top : lot.yPosTop, bottom : lot.yPosBottom,
                                        id : lot.id, series : i,
                                        label : index, time : lot.time, valueHop : lot.valueHop
                                    };
                                    self.pointerArr.push(pointer);

                                    if(isOrigin) {
                                        var ratioPointer = $.extend(true, {}, pointer);
                                        ratioPointer.pointX = ratioPointer.pointX / canvasWidth;
                                        ratioPointer.valueHop = ratioPointer.valueHop / canvasWidth;
                                        self.originPointerArr.push(ratioPointer);
                                    }
                                    index++;
                                }
                            }

                            isOrigin = false;

                            for(var i in c.datasets) {
                                var ds = c.datasets[i];
                                b.clearRect(ds.x, ds.y, ds.w, ds.h), b.save(), b.beginPath();
                                b.font = self.options.style.chart.legendFontStyle + " " + Math.ceil(self.options.style.chart.chartTextScale * self.options.style.chart.legendFontSize).toString() + "px " + self.options.style.chart.legendFontFamily;
                                b.fillStyle = ds.visible ? self.options.style.chart.legendFontColor : "gray", b.textAlign = "left", b.textBaseline = "bottom";
                                b.fillText(ds.title, ds.x, ds.y + ds.h), b.restore(), ds.hover = false;
                            }
                            var navigator = self.controlContainer.find(function(h) { return h.id == "navigator"});
                            if(navigator) {
                                navigator.clear();
                                var leftPos = self.originPointerArr.find(function(h) { return h.time == tempChart.times[0] });
                                var rightPos = self.originPointerArr.find(function(h) { return h.time == tempChart.times[tempChart.times.length - 1] });
                                navigator.x = leftPos.pointX * canvasWidth, navigator.y = standard.bottom + 2, navigator.width = (rightPos.pointX*canvasWidth) - (leftPos.pointX*canvasWidth) + 2, navigator.time = leftPos.time, navigator.valueHop = rightPos.valueHop * canvasWidth;
                                navigator.drawShape();
                            }
                        } else {
                            var navigator = self.controlContainer.find(function(h) { return h.id == "navigator"});
                            if(navigator) {
                                navigator.clear();
                            }
                        }
                        console.log('END DRAW DATA FUNC : ' + (new Date() - self.startDraw) + 'ms');
                    }
                },
                mouseDownLeft: function(a) {
                    if(self.options.chartType.toLowerCase() !== 'pie') {
                        var controller = self.controlContainer.find(function(d) { return d.isPointInside(a.offsetX, a.offsetY) });
                        if(!zoomDrag.state && a.offsetY >= standard.top && a.offsetY <= standard.bottom && typeof controller == "undefined") {
                            zoomDrag.x = (a.offsetX <= standard.left) ? standard.left : (a.offsetX >= standard.right) ? standard.right : a.offsetX;
                            zoomDrag.y = (a.offsetY <= standard.top) ? standard.top : (a.offsetY >= standard.bottom) ? standard.bottom : a.offsetY;
                            zoomDrag.state = true;
                        }
                    }
                },
                mouseUpLeft : function(a,b,c,d,e) {
                    if(e !== null && e.type !== undefined) {
                        if(self.options.chartType.toLowerCase() !== 'pie') {
                            if(e.values[0] === "LEGEND_TEXTMOUSE") {
                                var origin = self.renderData.chart.datasets.find(function (q) {
                                    return q.title == e.values[1]
                                });
                                var temp = tempChart.datasets.find(function (d) {
                                    return d.title == e.values[1]
                                });

                                b.clearRect(origin.x, origin.y, origin.w, origin.h);
                                b.save(), b.beginPath(), b.font = c.legendFontStyle + " " + Math.ceil(c.chartTextScale * c.legendFontSize).toString() + "px " + c.legendFontFamily;
                                b.fillStyle = !origin.visible ? self.options.style.chart.legendFontColor : "gray", b.textAlign = "left", b.textBaseline = "bottom";
                                b.fillText(e.values[1], origin.x, origin.y + origin.h), b.restore();
                                temp.visible = !temp.visible;

                                if (!temp.visible) {
                                    temp.pointColor = "rgba(0,0,0,0)", temp.fillColor = "rgba(0,0,0,0)", temp.strokeColor = "rgba(0,0,0,0)", temp.tooltip = false;
                                } else {
                                    temp.pointColor = origin.pointColor, temp.fillColor = origin.fillColor, temp.strokeColor = origin.strokeColor, temp.tooltip = true;
                                }
                                var message = {
                                    type : "redraw"
                                }
                                renderWorker.postMessage(message);
                            }
                        }
                    }
                    if(zoomDrag.state) {
                        zoomDrag.state = false;
                        self.overlayCtx.clearRect(0, prevZoomOverlay.top, self.overlay.width, prevZoomOverlay.bottom);
                        if(self.options.chartType.toLowerCase() !== 'pie') {
                            var range = { start : 0, end : 0 };
                            range.start = zoomDrag.x;
                            range.end = zoomDrag.x + delta.x;
                            if(range.start != range.end) {
                                zoomDrag.x = 0, zoomDrag.y = 0, delta.x = 0, delta.y = 0;
                                if(range.end < range.start) {
                                    if(zoomHistory.length > 0) {
                                        var message = {
                                            type : "drawZoomOut"
                                        }
                                        renderWorker.postMessage(message);
                                    }
                                    return;
                                }
                                var message = {
                                    type : "drawZoomIn",
                                    one : range,
                                    two : d
                                }
                                renderWorker.postMessage(message);
                            }
                        }
                    }
                },
                mouseMove: function(e,a,b,c,d) {
                    if(d != null && d.type !== undefined) {
                        if(self.options.chartType.toLowerCase() !== 'pie') {
                            if(d.values[0] === "LEGEND_TEXTMOUSE") {
                                var target = c.datasets.find(function(q) { return q.title == d.values[1] });
                                a.clearRect(target.x, target.y, target.w, target.h), a.save(), a.beginPath(), a.fillStyle = "orange", a.textAlign = "left", a.textBaseline = "bottom";
                                a.font = b.legendFontStyle + " " + Math.ceil(b.chartTextScale * b.legendFontSize).toString() + "px " + b.legendFontFamily;
                                a.fillText(target.title, target.x, target.y + target.h), a.restore();
                                target.hover = true;
                            }
                        }
                    }
                    else
                    {
                        for(var i in c.datasets) {
                            var ds = c.datasets[i];
                            a.clearRect(ds.x, ds.y, ds.w, ds.h), a.save(), a.beginPath(), a.font = b.legendFontStyle + " " + Math.ceil(b.chartTextScale * b.legendFontSize).toString() + "px " + b.legendFontFamily;
                            a.fillStyle = ds.visible ? self.options.style.chart.legendFontColor : "gray", a.textAlign = "left", a.textBaseline = "bottom";
                            a.fillText(ds.title, ds.x, ds.y + ds.h), a.restore(), ds.hover = false;
                        }
                    }
                    if(self.options.chartType.toLowerCase() !== 'pie') {
                        if(zoomDrag.state) {
                            e.stopImmediatePropagation();
                            delta.x = ((e.offsetX <= standard.left) ? standard.left : (e.offsetX >= standard.right) ? standard.right : e.offsetX) - zoomDrag.x;
                            delta.y = ((e.offsetY <= standard.top) ? standard.top : (e.offsetY >= standard.bottom) ? standard.bottom : e.offsetY) - zoomDrag.y;

                            self.overlayCtx.clearRect(prevZoomOverlay.left, prevZoomOverlay.top, prevZoomOverlay.right, prevZoomOverlay.bottom);
                            self.overlayCtx.fillStyle = 'rgba(160, 160, 163, 0.2)';
                            self.overlayCtx.fillRect(zoomDrag.x, standard.top, delta.x, standard.bottom - standard.top);
                            prevZoomOverlay = {
                                left : zoomDrag.x,
                                top : standard.top,
                                right : delta.x,
                                bottom : standard.bottom - standard.top
                            };
                        }
                    }
                },
                endDrawScaleFunction : function(a,b,c,d,e,f,g) { },
                onAnimationComplete: function(a,b,c,d,e,f,g) { },
                mouseDownMiddle: function(a,b,c,d) {
                },
                mouseDownRight: function(e) { },
                mouseUpMiddle : function(a,b,c,d) {
                },
                mouseUpRight : function(e) { },
                mouseOut: function(e) { },
                mouseWheel: function(e,a,b,c) {
                },
                annotateFunctionIn: function(a,b,c,d,e,f,g) { },
                annotateFunctionOut: function(a,b,c,d,e,f,g,h) { },
                annotatePadding: "5px 5px 5px 5px", annotateFontFamily: "'Open Sans'", annotateFontStyle: "normal normal", annotateFontColor: "rgba(0,0,0,1)", annotateFontSize: 11, annotateBorderRadius: "3px", annotateBorder: "2px rgba(170,170,170,0.7) solid ",
                annotateBackgroundColor: 'rgba(255,255,255,0.5)', annotateFunction: "mousemove", annotateRelocate: true,
                legend: true, showSingleLegend: true, maxLegendCols: 5, legendBlockSize: 15, legendFillColor: 'rgba(255,255,255,0.00)', legendColorIndicatorStrokeWidth: 1, legendPosX: -2, legendPosY: 4, legendXPadding: 0, legendYPadding: 0,
                legendBorders: false, legendBordersWidth: 1, legendBordersStyle: "solid", legendBordersColors: "rgba(102,102,102,1)", legendBordersSpaceBefore: 5, legendBordersSpaceLeft: 5, legendBordersSpaceRight: 5, legendBordersSpaceAfter: 5,
                legendSpaceBeforeText: 5, legendSpaceLeftText: 5, legendSpaceRightText: 5, legendSpaceAfterText: 5, legendSpaceBetweenBoxAndText: 10, legendSpaceBetweenTextHorizontal: 50, legendSpaceBetweenTextVertical: 5,
                xAxisLabel: "", xAxisFontFamily: "'Open Sans'", xAxisFontSize: 11, xAxisFontStyle: "normal normal", xAxisFontColor: "rgba(160,160,163,1)", xAxisLabelSpaceBefore: 5, xAxisLabelSpaceAfter: 5, xAxisSpaceBefore: 5,
                xAxisSpaceAfter: 5, xAxisLabelBorders: false, xAxisLabelBordersColor: "white", xAxisLabelBordersXSpace: 3, xAxisLabelBordersYSpace: 3, xAxisLabelBordersWidth: 1, xAxisLabelBordersStyle: "solid", xAxisLabelBackgroundColor: "none",
                yAxisLabel: "", yAxisLabel2: "", yAxisFontFamily: "'Open Sans'", yAxisFontStyle: "normal normal", yAxisFontColor: "rgba(160,160,163,1)", yAxisFontSize: 15, yAxisLabelSpaceRight: 0, yAxisLabelSpaceLeft: 0, yAxisSpaceRight: 0,
                yAxisSpaceLeft: 0, yAxisLabelBorders: !1, yAxisLabelBordersColor: "black", yAxisLabelBordersXSpace: 0, yAxisLabelBordersYSpace: 0, yAxisLabelBordersWidth: 1, yAxisLabelBordersStyle: "solid", yAxisLabelBackgroundColor: "none",
                showYAxisMin: true, xAxisBottom: true,
                graphTitleSpaceBefore: 5, graphTitleSpaceAfter: 5, graphTitleBorders: false, graphTitleBordersXSpace: 1, graphTitleBordersYSpace: 1, graphTitleBordersWidth: 3, graphTitleBordersStyle: "solid", graphTitleBordersColor: "rgba(255,255,255,1)",
                graphSubTitleSpaceBefore: 5, graphSubTitleSpaceAfter: 5, graphSubTitleBorders: false, graphSubTitleBordersXSpace: 1, graphSubTitleBordersYSpace: 1, graphSubTitleBordersWidth: 3, graphSubTitleBordersStyle: "solid", graphSubTitleBordersColor: "rgba(255,255,255,1)",
                pointLabelFontFamily: "'Open Sans'", pointLabelFontStyle: "normal normal", pointLabelFontColor: "rgba(102,102,102,1)", pointLabelFontSize: 12,
                pointDotStrokeStyle: "solid", pointDotStrokeWidth: 0, pointDotRadius: 4, pointDot: true,
                angleShowLineOut: true, angleLineStyle: "solid", angleLineWidth: 1, angleLineColor: "rgba(0,0,0,0.1)",
                segmentShowStroke: false, segmentStrokeStyle: "solid", segmentStrokeWidth: 2, segmentStrokeColor: "rgba(255,255,255,1.00)",
                datasetStroke: true, datasetFill: false, datasetStrokeStyle: "solid", datasetStrokeWidth: 2,
                scaleTickSizeBottom: 5, scaleTickSizeTop: 20, scaleTickSizeLeft: 3, scaleTickSizeRight: 5,
                scaleBackdropColor: 'rgba(255,255,255,0.75)', scaleBackdropPaddingX: 2, scaleBackdropPaddingY: 2,
                barShowStroke: false, barBorderRadius: 0, barStrokeStyle: "solid", barStrokeWidth: 1, barValueSpacing: 0, barDatasetSpacing: 0, scaleShowLabelBackdrop: true,
                animation: false, animationStartValue: 0, animationStopValue:1, animationCount: 1, animationPauseTime: 0, animationBackward: false, animationStartWithDataset: 1,
                animationStartWithData: 1, animationLeftToRight: true, animationByDataset: false,
                logarithmic: false, logarithmic2: false, responsive: false, maintainAspectRatio: true, graphMaximized: false, multiGraph:false, percentageInnerCutout: 50,
                chartTextScale: 1, chartLineScale: 1, chartSpaceScale: 0.5, fullWidthGraph: true, firstLabelToShow: true, showYLabels: 1, firstYLabelToShow: 1
            }
        }
    };

    self.renderData = {
        chart : { labels : [], datasets : [], times : [] },

        table : "",
        pie : [],
        labels : {}
    };

    var calcDate = function (sign, num, unit) {
        var date = new Date();

        if (unit === 'y') {
            date.setYear(date.getFullYear() + parseInt(sign + num, 10));
        } else if (unit === 'M') {
            date.setMonth(date.getMonth() + parseInt(sign + num, 10));
        } else if (unit === 'd') {
            date.setDate(date.getDate() + parseInt(sign + num, 10));
        } else if (unit === 'h') {
            date.setHours(date.getHours() + parseInt(sign + num, 10));
        } else if (unit === 'm') {
            date.setMinutes(date.getMinutes() + parseInt(sign + num, 10));
        } else if (unit === 's') {
            date.setSeconds(date.getSeconds() + parseInt(sign + num, 10));
        }
        return date;
    };

    self.initialize = function(div, url, options) {
        console.log("init chart");
        self.url = url;
        self.$container = $('#' + div);
        self.$container.empty();
        self.divId = div;
        self.canvasId = div + '_' + 'canvas';
        self.overlayId= div + '_' + 'overlay';
        self.overlay = document.createElement("canvas");
        $(self.overlay).attr("id", self.overlayId).attr("width", self.$container.width()).attr("height", self.$container.height()).css("position", "absolute").css("z-index",10).css("pointer-events", "none");
        document.getElementById(self.divId).appendChild(self.overlay);
        self.overlayCtx = document.getElementById(self.overlayId).getContext("2d");

        var sSign, sTime, sUnit, eSign, eTime, eUnit;

        if (options.start !== parseInt(options.start) && options.end !== parseInt(options.end)) {
            sSign = options.start.match(/[-+]/g) == null ? "+" : options.start.match(/[-+]/g);
            sTime = options.start.replace(/[^0-9]/g, "");
            sUnit = options.start.replace(/[^A-Za-z]/g, "") == "" ? "d" : options.start.replace(/[^A-Za-z]/g, "");
            eSign = options.end.match(/[-+]/g) == null ? "+" : options.end.match(/[-+]/g);
            eTime = options.end.replace(/[^0-9]/g, "");
            eUnit = options.end.replace(/[^A-Za-z]/g, "") == "" ? "d" : options.end.replace(/[^A-Za-z]/g, "");

            options.start = convertDateToTimestamp(calcDate(sSign, sTime, sUnit));
            options.end = convertDateToTimestamp(calcDate(eSign, eTime, eUnit));
        };

        self.$container.bind("mousemove.setting", function(e) {
            var insideController = self.controlContainer.find(function(d) { return d.isPointInside(e.offsetX, e.offsetY) });
            if(typeof insideController != "undefined") {
                insideController.funct.hover(insideController, e);
            } else {
                self.controlContainer.forEach(function(d) { d.funct.hover(d, e); });
            }
            if(panningDrag.state) {
                e.stopImmediatePropagation();
                delta.x = e.offsetX - panningDrag.x;
                var navigator = self.controlContainer.find(function(h) { return h.id == "navigator"});
                var pan = Math.floor(delta.x / navigator.valueHop);
                if(pan - delta.p != 0) {
                    var speed = Math.ceil(1/navigator.valueHop);
                    var message = {
                        type : "panning",
                        param : {
                            direction : pan - delta.p > 0,
                            speed : speed
                        }
                    };
                    renderWorker.postMessage(message);
                    delta.p = pan;
                }
            }
        }).bind("click.setting", function(e) {
            var insideController = self.controlContainer.find(function(d) { return d.isPointInside(e.offsetX, e.offsetY) });
            if(typeof insideController != "undefined") {
                document.getElementById(self.divId).style.cursor = 'default';
                insideController.funct.click(insideController, self);
            }
        }).bind("mousedown.setting", function(e){
            var insideController = self.controlContainer.find(function(d) { return d.isPointInside(e.offsetX, e.offsetY) });
            if(typeof insideController != "undefined" && typeof insideController.funct.mousedown != "undefined") {
                insideController.funct.mousedown(insideController, e);
            }
        }).bind("mouseleave.setting", function(e){
            if(panningDrag.state) {
                panningDrag.state = false;
                delta.p = 0;
            }
        }).bind("mouseup.setting", function(e){
            if(panningDrag.state) {
                panningDrag.state = false;
                delta.p = 0;


            }});
        $.extend(true, self.options, options);
        self.options.style.chart.yAxisFormat = self.options.yAxisFormat, self.options.style.chart.yMaximum = self.options.yMaximum, self.options.style.chart.yMinimum = self.options.yMinimum;
        self.options.style.table.innerChartOptions.yMaximum = self.options.yMaximum, self.options.style.table.innerChartOptions.yMinimum = self.options.yMinimum;

        if(self.options.style.theme == "WHITE") {
            var selectedStyle = simpleSetting.style.theme.find(function(d){ return d.name == "WHITE";});
            self.options.style.chart.canvasBackgroundColor = selectedStyle.background, self.options.style.table.background = selectedStyle.background;
            self.options.style.chart.graphTitleFontColor = selectedStyle.header, self.options.style.chart.graphSubTitleFontColor = selectedStyle.header, self.options.style.chart.legendFontColor = selectedStyle.footer;
            self.options.style.chart.scaleFontColor = selectedStyle.body, self.options.style.chart.yAxisUnitFontColor = selectedStyle.body, self.options.style.chart.scaleLineColor = selectedStyle.line, self.options.style.chart.scaleGridLineColor = selectedStyle.line;
            self.options.style.table.titleFontColor = selectedStyle.header, self.options.style.table.subTitleFontColor  = selectedStyle.header, self.options.style.table.innerLineColor = selectedStyle.line, self.options.style.table.innerFontColor = selectedStyle.body;
        }
        simpleSetting.request.start = self.options.start, simpleSetting.request.end = self.options.end, simpleSetting.request.sampling.select = self.options.samplingMethod.toUpperCase();
        simpleSetting.chart.select = self.options.chartType.toUpperCase(), simpleSetting.style.select = self.options.style.theme.toUpperCase(), simpleSetting.request.timeRangeSync = self.options.timeRangeSync;

        AddNavigationControl();
        //initializeControl();
    };

    var initializeControl = function () {
        var settingControl = self.controlContainer.find(function(d){return d.id == "SettingMode"});
        if(!settingControl) {
            var controlSize = (self.options.style.chart.graphTitleFontSize + self.options.style.chart.graphTitleFontSize) / 2;
            AddDefaultControl(controlSize);
            AddNavigationControl();
            if(self.options.usePeriodControl) AddPeriodControl(controlSize);

        } else {
            settingControl.clear(), settingControl.drawText();
            var zoomControl = self.controlContainer.find(function(d){return d.id == "ResetZoom"});
            zoomControl.display = false, zoomControl.clear();
        }
    };

    self.resize = function () {
        var message = {
            type : "redraw"
        };
        renderWorker.postMessage(message);
        var message2 = {
            type : "redrawControl"
        };
        renderWorker.postMessage(message2);
    };

    self.load = function(guid, timestamp) {
        isOrigin = true;
        self.guid = guid;
        self._uniqueID = guid;
        this._deferred = $.Deferred();
        self.renderData = {
            chart : { labels : [], datasets : [], times : [] },
            table : [],
            pie : [],
            labels : {}
        };
        zoomHistory = [];
        self.overlay.width = self.$container.width();
        self.overlay.height = self.$container.height();
        simpleSetting.chart.type = [{name: "TABLE", unicode : "f0ce"}, {name : "LINE", unicode : "f201"}, {name : "AREA", unicode : "f1fe"}, {name : "BAR", unicode : "f080"}, {name : "PIE", unicode : "f200"}];
        simpleSetting.unit.single = [], simpleSetting.unit.multi = [];
        if(self.options.fake) {
            if(self.options.data != null && typeof self.options.data != "undefined") {
                deserializeData(self.options.data);
            }
            self.draw();
        } else {
            getMetricData();
        }
        var complete = this._deferred.promise();

        return complete;
    };

    self.setOptions = function (options) {
        $.extend(true, self.options, options);
    };

    var AddNavigationControl = function () {
        var navigatorConfig = {x : undefined,y : undefined,width : undefined,height : 6,fill : "white", type: "navi", shape : "rectangle",
            stroke : "rgba(100,120,150,0.8)" ,strokewidth : 1,radius : { lt : 2, lb : 2, rt : 2, rb : 2 },text : "",textfill : "rgba(160,160,163,0)",font : 0,
            highlight : "rgba(150,120,100,0.5)",onColor : "red",hover : false,on : false,icon : false,keeping : true,display : true};
        var navigatorControl = new controller(self.overlayCtx, "navigator", navigatorConfig, { hover : function(d,e){
            if(d.isPointInside(e.offsetX, e.offsetY)) {
                if(!d.hover) {
                    d.clear(), d.hover = true, d.drawShape(), d.drawText();
                }
            } else {
                if(d.hover && d.display) {
                    d.clear(), d.hover = false, d.drawShape(), d.drawText();
                }
            }
        }, click : function (m, e) {

        }, mousedown : function (m, e){
            panningDrag.x = e.offsetX, panningDrag.y = e.offsetY, panningDrag.state = true;
        }});

        self.controlContainer.push(navigatorControl);
    };

    var AddDefaultControl = function (controlSize) {
        var settingControlConfig = {x : standard.right - (controlSize * 2.5),y : standard.top - controlSize*2,width : controlSize,height : controlSize,fill : "rgba(255,255,255,0)", shape : "rectangle",
            stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 0, rb : 0 },text : "f013",textfill : "rgba(160,160,163,1)",font : controlSize,
            highlight : "orange",onColor : "red",hover : false,on : false,icon : true,keeping : true,display : true, description : "Setting Mode"};
        var settingControl = new controller(self.overlayCtx, "SettingMode", settingControlConfig, { hover : hoverFunction, click : settingFunction});
        var resetZoomConfig = {x : standard.right - (controlSize * 5),y : standard.top - controlSize*2,width : controlSize,height : controlSize,fill : "rgba(255,255,255,0)", shape : "rectangle",
            stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 0, rb : 0 },text : "f010",textfill : "rgba(160,160,163,1)",font : controlSize,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : true,keeping : true,display : false, description : "Reset Zoom"};
        var resetZoomControl = new controller(self.overlayCtx, "ResetZoom", resetZoomConfig, { hover : hoverFunction, click : function(m){
            m.clear(), m.display = false;
            zoomHistory = [];
            var message = {
                type : "draw"
            };
            renderWorker.postMessage(message);
        }});
        settingControl.drawText();
        self.controlContainer.push(settingControl);
        self.controlContainer.push(resetZoomControl);
    };

    var AddPeriodControl = function (controlSize) {
        var label = ["-3M", "-6M", "-1Y", "-2Y", "+-3M"];
        var periodConfig5 = {x : standard.right - (controlSize*11),y : standard.top - controlSize*2,width : controlSize*2,height : controlSize,fill : "rgba(255,255,255,0)",stroke : "rgba(160,160,163,1)", shape : "rectangle",
            strokewidth : 1,radius : { lt : 3, lb : 3, rt : 3, rb : 3 },text : label[4],textfill : "rgba(160,160,163,1)",font : 10,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : false,keeping : true,display : true};
        var periodConfig4 = {x : standard.right - (controlSize*13+6),y : standard.top - controlSize*2,width : controlSize*2,height : controlSize,fill : "rgba(255,255,255,0)",stroke : "rgba(160,160,163,1)", shape : "rectangle",
            strokewidth : 1,radius : { lt : 3, lb : 3, rt : 3, rb : 3 },text : label[3],textfill : "rgba(160,160,163,1)",font : 10,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : false,keeping : true,display : true};
        var periodConfig3 = {x : standard.right - (controlSize*15+12),y : standard.top - controlSize*2,width : controlSize*2,height : controlSize,fill : "rgba(255,255,255,0)",stroke : "rgba(160,160,163,1)", shape : "rectangle",
            strokewidth : 1,radius : { lt : 3, lb : 3, rt : 3, rb : 3 },text : label[2],textfill : "rgba(160,160,163,1)",font : 10,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : false,keeping : true,display : true};
        var periodConfig2 = {x : standard.right - (controlSize*17+18),y : standard.top - controlSize*2,width : controlSize*2,height : controlSize,fill : "rgba(255,255,255,0)",stroke : "rgba(160,160,163,1)", shape : "rectangle",
            strokewidth : 1,radius : { lt : 3, lb : 3, rt : 3, rb : 3 },text : label[1],textfill : "rgba(160,160,163,1)",font : 10,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : false,keeping : true,display : true};
        var periodConfig1 = {x : standard.right - (controlSize*19+24),y : standard.top - controlSize*2,width : controlSize*2,height : controlSize,fill : "rgba(255,255,255,0)",stroke : "rgba(160,160,163,1)", shape : "rectangle",
            strokewidth : 1,radius : { lt : 3, lb : 3, rt : 3, rb : 3 },text : label[0],textfill : "rgba(160,160,163,1)",font : 10,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : false,keeping : true,display : true};
        var periodControl5 = new controller(self.overlayCtx, "period5", periodConfig5, { hover : hoverFunction, click : function(m){
            applyPeriod(Date.now().addMonths(-3), Date.now().addMonths(3));
        }});
        var periodControl4 = new controller(self.overlayCtx, "period4", periodConfig4, { hover : hoverFunction, click : function(m){
            applyPeriod(Date.now().addMonths(-24), Date.now());
        }});
        var periodControl3 = new controller(self.overlayCtx, "period3", periodConfig3, { hover : hoverFunction, click : function(m){
            applyPeriod(Date.now().addMonths(-12), Date.now());
        }});
        var periodControl2 = new controller(self.overlayCtx, "period2", periodConfig2, { hover : hoverFunction, click : function(m){
            applyPeriod(Date.now().addMonths(-6), Date.now());
        }});
        var periodControl1 = new controller(self.overlayCtx, "period1", periodConfig1, { hover : hoverFunction, click : function(m){
            applyPeriod(Date.now().addMonths(-3), Date.now());
        }});
        periodControl5.clear(), periodControl5.drawShape(), periodControl5.drawText();
        periodControl4.clear(), periodControl4.drawShape(), periodControl4.drawText();
        periodControl3.clear(), periodControl3.drawShape(), periodControl3.drawText();
        periodControl2.clear(), periodControl2.drawShape(), periodControl2.drawText();
        periodControl1.clear(), periodControl1.drawShape(), periodControl1.drawText();
        self.controlContainer.push(periodControl5),self.controlContainer.push(periodControl4),self.controlContainer.push(periodControl3),self.controlContainer.push(periodControl2),self.controlContainer.push(periodControl1);
    };

    var applyPeriod = function(start, end) {
        self.options.start = convertDateToTimestamp(start), self.options.end = convertDateToTimestamp(end);
        self.load(self.guid);
    };

    var hoverFunction = function (d, e) {
        var annotateDIV = document.getElementById("divCursor");
        if(typeof d.cursor != "undefined" && d.isPointInside(e.offsetX, e.offsetY)) {
            annotateDIV.style.display = "", annotateDIV.innerHTML = d.description;
            var relocateX;
            var relocateY;
            annotateDIV.style.border = "2px solid rgba(255, 255, 255, 0.498039)", annotateDIV.style.backgroundColor = "rgba(255, 255, 255, 0.498039)";
            e.offsetX + annotateDIV.clientWidth> d.ctx.canvas.width ? relocateX = annotateDIV.clientWidth + 4 : relocateX = -4;
            e.offsetY + annotateDIV.clientHeight> d.ctx.canvas.height ? relocateY = annotateDIV.clientHeight + 4 : relocateY = -4;

            d.cursor.moveIt(e.pageX - relocateX, e.pageY - relocateY);
        } else {
            if(self.controlContainer.find(function(d){return d.id == "SettingMode"}).on){
                annotateDIV.style.display = "none";
            }
        }
        if(d.isPointInside(e.offsetX, e.offsetY)) {
            if(!d.hover) {
                d.clear(), d.hover = true, d.drawShape(), d.drawText();
            }
        } else {
            if(d.hover && d.display) {
                d.clear(), d.hover = false, d.drawShape(), d.drawText();
            }
        }
    };

    var settingFunction = function(d) {
        if(!d.on) {
            d.on = true, self.settingMode();
        } else {
            d.on = false;
            var tempControls = [];
            self.controlContainer.forEach(function(data, index){
                if(data.keeping) {
                    tempControls.push(data);
                } else {
                    data.clear();
                }
            });
            self.controlContainer = tempControls;
            $(self.overlay).css("pointer-events", "none");
        }
    };

    var getMetricData = function () {
        var start = new Date();
        $.ajax({
            type :'GET',
            url : self.url,
            dataType : 'json',
            contentType : 'application/json',
            //data : JSON.stringify(parameters),
            beforeSend	: function(){
            },
            success : function(d){
                console.log('Get Metric Data : ' + (new Date() - start) + 'ms');
                var aaa = new Date();
                deserializeData(d);
                console.log('deserialize : ' + (new Date() - aaa) + 'ms');
                var message = {
                    type : "draw"
                };
                renderWorker.postMessage(message);
            },
            error : function(e) {

            }
        });
    };

    function convertHex(hex,opacity){
        hex = hex.replace('#','');
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);

        var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    }

    function convertRgb(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    var deserializeData = function (data) {
        var start = convertTimestampToDate(self.options.start).format("yyyy-MM-dd");
        var end = convertTimestampToDate(self.options.end).format("yyyy-MM-dd");

        self.options.style.chart.graphSubTitle = 'Range : ' + start + " ~ " + end;
        self.tableId = self.divId + "_table";
        var _result = data;
        var objectId = self._uniqueID;
        self.options.objectIds[objectId] = {};
        var fields = _result.Fields;
        var objectInfo = self.options.objectIds[objectId];
        objectInfo["fields"] = [], objectInfo["chart"] = {};
        objectInfo["chart"]["datasets"] = [], objectInfo["chart"]["labels"] = [], objectInfo["labels"] = {}, objectInfo.labels["createdtime"] = [], objectInfo["chart"]["times"] = [], objectInfo["pie"] = [];
        objectInfo["table"] = "<div id='"+self.tableId+"' style='overflow-y:auto; height:"+ self.$container.height()+"px; width:"+ self.$container.width() +"px';'><table id='table-sparkline' style='width:100%;'><colgroup><col span='1' style='width: 5%;'><col span='1' style='width: 30%;'><col span='1' style='width: 64%;'></colgroup>";
        var headerTag = "<thead><tr id='table-title' style='pointer-events:none;'><th colspan='3'>" + objectId + "<br><div>" + self.options.style.chart.graphSubTitle + "</div></th></tr><tr id='table-columnHeader'><th><i class='fa fa-eye fa-lg'></i></th><th>Metric<i class='fa fa-sort-alpha-asc fa-fw'></i></th><th colspan='2'>Chart</th>";
        objectInfo["table"] = objectInfo["table"] + headerTag + "</thead><tbody id='tbody-sparkline'>";
        var colorIndex = 0;
        for(var fIndex = 0; fIndex < fields.length; fIndex++) {
            var field = fields[fIndex];
            if(field.Name != 'createdtime') {
                var color = convertHex(self.options.style.chart.seriesColor[colorIndex], 50);
                var series = {
                    fillColor: color,
                    strokeColor: color,
                    pointColor: color,
                    markerShape: "circle",
                    pointStrokeColor: "rgba(255,255,255,0)",
                    data: [],
                    title: field.DisplayName,
                    id: objectId + field.Name,
                    unit : typeof self.options.fixedUnit == "undefined" ? "" : self.options.fixedUnit,
                    datasetFill : true,
                    tooltip : true,
                    visible : true,
                    hover : false
                };
                var pieSeries = {
                    value: 0,
                    color: color,
                    title: field.Name,
                    id : objectId + field.Name,
                    unit : typeof self.options.fixedUnit == "undefined" ? "" : self.options.fixedUnit,
                    datasetFill : true,
                    tooltip : true,
                    visible : true,
                    hover : false
                };

                if(typeof self.options.fixedUnit == "undefined") {

                }
                objectInfo["table"] += "<tr><th><i class='fa fa-eye fa-lg'></i><th>"+ series.title +"</th><th><canvas id='" + self.divId + "_table" + colorIndex + "'/></th></tr>";

                objectInfo.chart.datasets.push(series);
                objectInfo.pie.push(pieSeries);
                colorIndex++;
            } else {
                objectInfo.labels[field.Name] = [];
            }
            objectInfo.fields.push(field);
        }
        objectInfo["table"] += "</tbody></table></div>";
        var metric = _result.Data;
        var timeIndex = objectInfo.fields.findIndex(function(c) { return c.Name == "createdtime" });
        if(self.options.timeRangeSync) {
            var interval = Math.abs(metric[metric.length-1][timeIndex] - metric[0][timeIndex])/metric.length;
            var requestRange = (self.options.end - self.options.start) / 86400;
            if(requestRange < 30 && interval < 60) {
                interval = 60;
            } else if(requestRange < 90 && interval < 300) {
                interval = 300;
            } else if(requestRange < 180 && interval < 600) {
                interval = 600;
            } else if(requestRange < 360 && interval < 1800) {
                interval = 1800;
            } else if(requestRange > 360 && interval < 3600) {
                interval = 3600;
            }
            var dataFirstTime = parseInt(metric[0][timeIndex]);
            for(var u = dataFirstTime; u > self.options.start*1000; u = u - interval) {
                if(u == dataFirstTime) continue;
                metric.splice(0,0,[u]);
            }
            metric.splice(0,0,[self.options.start*1000]);
            var dataLastTime = parseInt(metric[metric.length - 1][timeIndex]);
            for(var u2 = dataLastTime; u2 < self.options.end*1000; u2 = u2 + interval) {
                if(u2 == dataLastTime) continue;
                metric.push([u2]);
            }
            metric.push([self.options.end*1000]);
        };
        var sameCount = 1;
        var metricTime = 0;
        for(var dIndex = 0; dIndex < metric.length; dIndex++) {
            var fieldInfo = objectInfo.fields;
            for(var f = 0; f < fieldInfo.length; f++) {
                if(fieldInfo[f].Name == "createdtime") {
                    var dataTime = parseInt(metric[dIndex]["createdtime"])*1000;
                    metricTime == dataTime ? (metricTime = dataTime + sameCount, sameCount++) : (metricTime = dataTime,sameCount = 1);
                    var standardTime = new Date(metricTime).format(self.options.timeFormat);
                    objectInfo.labels["createdtime"].push(standardTime), objectInfo.chart.times.push(metricTime);

                    metricTime = dataTime;
                } else {
                    var key = fieldInfo[f].Name;
                    var chartSeries = objectInfo.chart.datasets.find(function(k) { return k.id == (objectId + key);});
                    var pieSeries = objectInfo.pie.find(function(k) { return k.id == (objectId + key);});


                    var val = parseFloat(metric[dIndex][key]);
                    if(isNaN(val)) val = undefined;
                    chartSeries.data.push(val);
                    pieSeries.value = pieSeries.value + (typeof val == "undefined" ? 0 : parseInt(val));
                }
            }
        }

        return;
    };

    self.draw = function() {
        self.startDraw = new Date();
        $('#' + self.tableId).detach();
        $('#' + self.canvasId).detach();
        self.options.style.chart.graphTitle = self.guid;
        self.renderData.pie = self.options.objectIds[self.guid].pie;
        self.renderData.table = self.options.objectIds[self.guid].table;
        self.renderData.chart = self.options.objectIds[self.guid].chart;
        self.renderData.labels = self.options.objectIds[self.guid].labels;
        self.renderData.chart.labels = self.renderData.labels[self.options.xAxisField];
        if(self.options.chartType.toLowerCase() === 'table') {
            $(self.renderData.table).appendTo(self.$container);
            for(var i = 0; i < self.renderData.chart.datasets.length; i++) {
                var innerId = self.divId + '_table' + i;
                var thContainer = $("#" + innerId);
                if(self.renderData.chart.datasets[i].id == self.options.xAxisField) {
                    thContainer.parent().parent().detach();
                } else {
                    thContainer.attr("width", thContainer.parent().width());
                    var innerChartCtx = document.getElementById(innerId).getContext("2d");
                    var innerChartObj = new Chart(innerChartCtx);
                    var tableRenderData = {
                        labels : self.renderData.chart.labels,
                        datasets : [],
                        times : self.renderData.chart.times
                    };
                    tableRenderData.datasets.push(self.renderData.chart.datasets[i]);
                    tableRenderData.datasets[0].datasetFill = true;
                    var evalText = 'innerChartObj.Line(tableRenderData, self.options.style.table.innerChartOptions); innerChartCtx.stroke();';
                    eval(evalText);
                    self.chartObj = innerChartObj;
                }
            }
            applyTableStyle(), applyTableEvent();
        } else {
            self.canvas = document.createElement("canvas");
            $(self.canvas).attr("id", self.canvasId).attr("width", self.$container.width()).attr("height", self.$container.height()).css("position", "relative");
            document.getElementById(self.divId).appendChild(self.canvas);
            self.chartCtx = document.getElementById(self.canvasId).getContext("2d");
            var chartType = 'Line';
            var chartTypeOption = self.options.chartType.toLowerCase();
            tempChart = $.extend(true, {}, self.renderData.chart);
            var xindex = tempChart.datasets.findIndex(function(d) {return d.id == self.options.xAxisField} );
            if(xindex != -1) tempChart.datasets.splice(xindex, 1);
            if (chartTypeOption  == 'line' || chartTypeOption == 'area') {
                tempChart.datasets = tempChart.datasets.filter(function(d) { return d.unit == simpleSetting.unit.select; });
                chartType = 'Line';
                tempChart.datasets.forEach(function(d) {d.datasetFill = chartTypeOption == 'area' ? true : false; d.axis = 1;});
                self.options.style.chart.yAxisRight = false;
                self.options.style.chart.yAxisUnit = simpleSetting.unit.select;
                self.options.style.chart.annotateLabel = '<%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>';
            } else if( chartTypeOption == 'pie') {
                tempChart = $.extend(true, [], self.renderData.pie);
                var pieIndex = tempChart.findIndex(function(d) {return d.id == self.options.xAxisField} );
                if(pieIndex != -1) tempChart.splice(pieIndex, 1);
                chartType = 'Pie';
                self.options.style.chart.annotateLabel = '<span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v2%> <%=unit%>';
                self.options.style.chart.yAxisRight = false;
            } else if (chartTypeOption == 'bar' || chartTypeOption == 'combination') {
                chartType = 'Bar';
                self.options.style.chart.yAxisRight = false;
                self.options.style.chart.annotateLabel = '<%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>';
                if(chartTypeOption == 'combination') {
                    self.options.style.chart.yAxisRight = true;
                    var selectedUnits = simpleSetting.unit.select.split(',');
                    var tempsets = [];
                    for(var i in selectedUnits) {
                        tempChart.datasets.forEach(function(d) {
                            if(selectedUnit == d.unit) {
                                d["axis"] = i % 2 + 1;
                                d["type"] = i % 2 == 1 ? 'Line' : 'Bar';
                                d["datasetFill"] = i % 2 == 1 ? false : true;
                                tempsets.push(d);
                            }
                        });
                        i % 2 == 1 ? self.options.style.chart.yAxisUnit2 = selectedUnits[i].trim() : self.options.style.chart.yAxisUnit = selectedUnits[i].trim();
                    }
                    tempChart.datasets = tempsets;
                } else {
                    tempChart.datasets = tempChart.datasets.filter(function(d) { return d.unit == simpleSetting.unit.select; });
                    tempChart.datasets.forEach(function(d) {d.datasetFill = true; d.axis = 1;});
                    self.options.style.chart.yAxisUnit = simpleSetting.unit.select;
                }
            };
            self.chartObj = new Chart(self.chartCtx);
            var evalText = 'self.chartObj.'+chartType+'(tempChart, self.options.style.chart); self.chartCtx.stroke();'
            eval(evalText);
        }
        self._deferred.resolve(self);
    };

    var applyTableStyle = function () {
        var lineText = "px solid ";
        var table = self.$container.find('#table-sparkline');
        table.children('thead').children('tr').css('border', self.options.style.table.innerLineSize + lineText + self.options.style.table.innerLineColor);
        table.children('tbody').children('tr').css('border', self.options.style.table.innerLineSize + lineText + self.options.style.table.innerLineColor);

        var title = self.$container.find('#table-title');
        title.css('background', self.options.style.table.background);
        title .children('th').css('font-size', self.options.style.table.titleFontSize + 'px').css('color', self.options.style.table.titleFontColor).css('text-align', self.options.style.table.titleFontAlign);
        title .children('th').children('div').css('font-size', self.options.style.table.subTitleFontSize + 'px').css('color', self.options.style.table.subTitleFontColor);

        var header = self.$container.find('#table-columnHeader');
        header.css('background', self.options.style.table.background);
        header.children('th').css('font-size', self.options.style.table.innerFontSize + 'px').css('color', self.options.style.table.innerFontColor);

        var contents = self.$container.find('#tbody-sparkline').children('tr');
        contents.css('background', self.options.style.table.background);
        contents.children('th').css('font-size', self.options.style.table.innerFontSize + 'px').css('color', self.options.style.table.innerFontColor);
    };

    var applyTableEvent = function () {
        self.$container.find('#table-columnHeader').children('th').each(function () {
            var header = $(this);
            if(header.index() < 2) {
                header.click(function () {
                    changeVisibility(this);
                });
            }
        });

        self.$container.find('#tbody-sparkline').find('tr th').each(function () {
            if ($(this).index() === 0) {
                $(this).click(function () {
                    if ($(this).children().hasClass('fa-eye')) {
                        $(this).children().removeClass('fa-eye').addClass('fa-eye-slash');
                        $($(this).parent().children()[2]).children().hide();
                    } else if ($(this).children().hasClass('fa-eye-slash')) {
                        $(this).children().removeClass('fa-eye-slash').addClass('fa-eye');
                        $($(this).parent().children()[2]).children().show();
                    }
                });
            }
        });
    };

    var changeVisibility = function (obj) {
        if (obj.innerText === 'Metric') {
            var table = $(obj).parents('table').eq(0)
            var rows = table.find('tr:gt(2)').toArray().sort(comparer($(obj).index()))
            obj.asc = !obj.asc
            if (!obj.asc) {
                rows = rows.reverse();
                $(obj).find('i').removeClass('fa-sort-alpha-asc').addClass('fa-sort-alpha-desc');
            } else {
                $(obj).find('i').removeClass('fa-sort-alpha-desc').addClass('fa-sort-alpha-asc');
            }
            for (var i = 0; i < rows.length; i++) {
                table.append(rows[i])
            }
        }

        if ($(obj).children().hasClass('fa-eye')) {
            self.$container.find('#tbody-sparkline').find('tr th').each(function () {
                if ($(this).index() === 0) {
                    $(this).children().removeClass('fa-eye').addClass('fa-eye-slash');
                    $($(this).parent().children()[2]).children().hide();
                }
            });
            $(obj).children().removeClass('fa-eye').addClass('fa-eye-slash');
        } else if ($(obj).children().hasClass('fa-eye-slash')) {
            self.$container.find('#tbody-sparkline').find('tr th').each(function () {
                if ($(this).index() === 0) {
                    $(this).children().removeClass('fa-eye-slash').addClass('fa-eye');
                    $($(this).parent().children()[2]).children().show();
                }
            });
            $(obj).children().removeClass('fa-eye-slash').addClass('fa-eye');
        }
    };

    function comparer(index) {
        return function (a, b) {
            var valA = getCellValue(a, index), valB = getCellValue(b, index)
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
        }
    };

    function getCellValue(row, index) {
        return $(row).children('th').eq(index).html()
    };

    self.reflow = function () {
        self.chartObj.reflowChart(self.chartCtx.ChartNewId);
    }

    self.redraw = function (data) {
        self.startDraw = new Date();
        if(self.canvas == undefined) return;
        self.canvas.width = self.$container.width();
        self.canvas.height = self.$container.height();
        if(self.options.chartType.toLowerCase() == "table") {
            $('#' + self.tableId).detach();
            $(self.ChartTable).appendTo(self.$container);
            for(var i = 0; i < self.renderData.chart.datasets.length; i++) {
                var innerId = div + '_table' + i;
                var thContainer = $("#" + innerId);
                thContainer.attr("width", thContainer.parent().width());
                var innerChartCtx = document.getElementById(innerId).getContext("2d");
                var innerChartObj = new Chart(innerChartCtx);
                var tableRenderData = {
                    labels : self.renderData.chart.labels,
                    datasets : [],
                    times : self.renderData.chart.times
                };
                tableRenderData.datasets.push(self.renderData.chart.datasets[i]);
                tableRenderData.datasets[0].datasetFill = true;
                var evalText = 'innerChartObj.Line(tableRenderData, self.options.style.table.innerChartOptions); innerChartCtx.stroke();';
                eval(evalText);
            }
            applyTableStyle(), applyTableEvent();
        } else {
            var type;
            switch (self.chartCtx.tpchart) {
                case "Bar":
                    type = "Bar";
                    break;
                case "Pie":
                    type = "Pie";
                    break;
                case "Doughnut":
                    type = "Doughnut";
                    break;
                case "Radar":
                    type = "Radar";
                    break;
                case "PolarArea":
                    type = "PolarArea";
                    break;
                case "HorizontalBar":
                    type = "HorizontalBar";
                    break;
                case "StackedBar":
                    type = "StackedBar";
                    break;
                case "HorizontalStackedBar":
                    type = "HorizontalStackedBar";
                    break;
                case "Line":
                    type = "Line";
            }
            $(self.canvas).detach();
            self.canvas = document.createElement("canvas");
            $(self.canvas).attr("id", self.canvasId).attr("width", self.$container.width()).attr("height", self.$container.height()).css("position", "relative");
            document.getElementById(self.divId).appendChild(self.canvas);
            self.chartCtx = document.getElementById(self.canvasId).getContext("2d");
            self.chartObj = new Chart(self.chartCtx);
            eval('self.chartObj.'+type+'(data, self.options.style.chart); self.chartCtx.stroke();');
        }
    };

    var simpleSetting = {
        chart : {
            type : [{name: "TABLE", unicode : "f0ce"}, {name : "LINE", unicode : "f201"}, {name : "AREA", unicode : "f1fe"}, {name : "BAR", unicode : "f080"}, {name : "PIE", unicode : "f200"}],
            select : ""
        },
        unit : {
            single : [],
            multi : [],
            select : ""
        },
        style :{
            theme : [{name : "BLACK", background : "#292829", header : "#ffffff", footer : "#ffffff", body : "#a8a0a8", line : "#575457"},
                {name : "WHITE", background : "#ffffff", header : "#000000", footer : "#000000", body : "#575457", line : "#a8a0a8"},
                //{name : "CUSTOM", popup : function () { styleSettingPopup(); }}
            ],
            select : ""
        },
        request : {
            start : "",
            end : "",
            sampling : {
                methods : ["ALL", "AVG", "MAX", "MIN"],
                select : ""
            },
            timeRangeSync : true
        }

    };

    self.settingMode = function () {
        simpleSetting.chart.select = self.options.chartType, simpleSetting.style.select = self.options.style.theme, simpleSetting.request.start = self.options.start, simpleSetting.request.end = self.options.end;
        simpleSetting.request.sampling.select = self.options.samplingMethod.toUpperCase(), simpleSetting.request.timeRangeSync = self.options.timeRangeSync;
        if(self.options.chartType.toLowerCase() != "combination") {
            simpleSetting.unit.select = self.options.style.chart.yAxisUnit;
        } else {
            simpleSetting.unit.select = self.options.style.chart.yAxisUnit + " , " + self.options.style.chart.yAxisUnit2;
        }

        var selectChartConfig = {x : self.overlay.width*1/8,y : self.overlay.height*1/3,width : self.overlay.width*1/16,height : self.overlay.height*1/12,fill : self.options.style.chart.graphTitleFontColor,
            stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 5, lb : 5, rt : 0, rb : 0 }, shape : "rectangle",
            text : simpleSetting.chart.type.find(function(d){ return d.name.toLowerCase() ==  self.options.chartType.toLowerCase()}).unicode,
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphTitleFontSize,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : true,keeping : false,display : true, description : "Select Chart Type", cursor : self.chartObj.getDivCursor()};

        var setChartConfig = {x : selectChartConfig.x + selectChartConfig.width + 2,y : self.overlay.height*1/3,width : selectChartConfig.width * 5/2,height : self.overlay.height*1/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 5, rb : 5 }, shape : "rectangle",
            text : self.options.chartType.toUpperCase(),textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphSubTitleFontSize,
            highlight : "orange",onColor : "red",hover : false,on : false,icon : false,keeping : false,display : true};

        var selectUnitConfig = {x : selectChartConfig.x * 3,y : self.overlay.height*1/3,width : self.overlay.width*1/16,height : self.overlay.height*1/12,fill : self.options.style.chart.graphTitleFontColor,
            stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 5, lb : 5, rt : 0, rb : 0 },text : "f03a",textfill : self.options.style.chart.canvasBackgroundColor, shape : "rectangle",
            font : self.options.style.chart.graphTitleFontSize,highlight : "orange",onColor : "red",hover : false,on : false,icon : true,keeping : false,display : true,
            description : "Select Unit", cursor : self.chartObj.getDivCursor()
        };

        var setUnitConfig = {x : (selectChartConfig.x*3) + selectChartConfig.width + 2,y : self.overlay.height*1/3,width : selectChartConfig.width * 5/2,height : self.overlay.height/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 5, rb : 5 }, shape : "rectangle",
            text : self.options.chartType.toLowerCase() == "combination" ? self.options.style.chart.yAxisUnit + " , " + self.options.style.chart.yAxisUnit2 : self.options.style.chart.yAxisUnit == "" ? "No Units" : self.options.style.chart.yAxisUnit,
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphSubTitleFontSize,highlight : "orange",onColor : "red",
            hover : false,on : false,icon : false,keeping : false,display : true};

        var selectStyleConfig = {x : (selectChartConfig.x * 5),y : self.overlay.height*1/3,width : self.overlay.width*1/16,height : self.overlay.height*1/12,fill : self.options.style.chart.graphTitleFontColor,
            stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 5, lb : 5, rt : 0, rb : 0 },text : "f044",textfill : self.options.style.chart.canvasBackgroundColor, shape : "rectangle",
            font : self.options.style.chart.graphTitleFontSize,highlight : "orange",onColor : "red",hover : false,on : false,icon : true,keeping : false,display : true,
            description : "Select Theme", cursor : self.chartObj.getDivCursor()
        };

        var setStyleConfig = {x : (selectChartConfig.x*5) + selectChartConfig.width + 2,y : self.overlay.height*1/3,width : selectChartConfig.width * 5/2,height : self.overlay.height/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 5, rb : 5 },text : self.options.style.theme,
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphSubTitleFontSize,highlight : "orange",onColor : "red", shape : "rectangle",
            hover : false,on : false,icon : false,keeping : false,display : true, description : "Set Style & Options", cursor : self.chartObj.getDivCursor()};

        var selectCalendarConfig = {x : selectChartConfig.x,y : self.overlay.height*1/2,width : selectChartConfig.width,height : self.overlay.height/12,fill : self.options.style.chart.graphTitleFontColor,
            stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 5, lb : 5, rt : 0, rb : 0 },text : "f073",textfill : self.options.style.chart.canvasBackgroundColor, shape : "rectangle",
            font : self.options.style.chart.graphTitleFontSize,highlight : "orange",onColor : "red",hover : false,on : false,icon : true,keeping : false,display : true,
            description : "Set Time Range", cursor : self.chartObj.getDivCursor()
        };

        var start = convertTimestampToDate(self.options.start).format("yyyy/MM/dd HH:mm:dd");
        var end = convertTimestampToDate(self.options.end).format("yyyy/MM/dd HH:mm:dd");
        var setCalendarConfig = {x : selectChartConfig.x + selectChartConfig.width + 2,y : self.overlay.height*1/2,width : selectChartConfig.width * (11/2) - 2,height : self.overlay.height/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 0, rb : 0 },text : start + "~" + end,
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphSubTitleFontSize,highlight : "orange",onColor : "red", shape : "rectangle",
            hover : false,on : false,icon : false,keeping : false,display : true};

        var toggleTimeSyncConfig = {x : setCalendarConfig.x + setCalendarConfig.width + 2,y : self.overlay.height*1/2,width : selectCalendarConfig.width,height : self.overlay.height/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 5, rb : 5 },text : self.options.timeRangeSync ? "f0c1" : "f127",
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphTitleFontSize,highlight : "orange",onColor : "red", shape : "rectangle",
            hover : false,on : self.options.timeRangeSync,icon : true,keeping : false,display : true, description : "Use Time Sync", cursor : self.chartObj.getDivCursor()};

        var selectSamplingConfig = {x : (selectChartConfig.x * 5),y : self.overlay.height*1/2,width : self.overlay.width*1/16,height : self.overlay.height*1/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 5, lb : 5, rt : 0, rb : 0 },text : "f1ec",
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphTitleFontSize,highlight : "orange",onColor : "red", shape : "rectangle",
            hover : false,on : false,icon : true,keeping : false,display : true, description : "Select Sampling Method", cursor : self.chartObj.getDivCursor()};

        var setSamplingConfig = {x : (selectChartConfig.x*5) + selectChartConfig.width + 2,y : self.overlay.height*1/2,width : selectChartConfig.width * 5/2,height : self.overlay.height/12,
            fill : self.options.style.chart.graphTitleFontColor,stroke : "rgba(160,160,163,0)",strokewidth : 0,radius : { lt : 0, lb : 0, rt : 5, rb : 5 },text : self.options.samplingMethod.toUpperCase(),
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphSubTitleFontSize,highlight : "orange",onColor : "red", shape : "rectangle",
            hover : false,on : false,icon : false,keeping : false,display : true};

        var applyConfig = {x : (selectChartConfig.x*5) + selectChartConfig.width + 2,y : self.overlay.height*2/3,width : selectChartConfig.width * 5/2,height : self.overlay.height/12,
            fill : self.options.style.chart.graphSubTitleFontColor,stroke : "rgba(160,160,163,1)",strokewidth : 1,radius : { lt : 5, lb : 5, rt : 5, rb : 5 },text : "APPLY",
            textfill : self.options.style.chart.canvasBackgroundColor,font : self.options.style.chart.graphSubTitleFontSize,highlight : "red",onColor : "red", shape : "rectangle",
            hover : false,on : false,icon : false,keeping : false,display : true};

        var setChartControl = new controller(self.overlayCtx, "SetChart", setChartConfig, { hover : function(d,e) {}, click : function (m) { }});
        var setUnitControl = new controller(self.overlayCtx, "SetUnit", setUnitConfig, { hover : function (d,e) {  }, click : function (m) { }});
        var setStyleControl = new controller(self.overlayCtx, "SetStyle", setStyleConfig, { hover : function(d,e) {
            if(simpleSetting.style.select == "CUSTOM") {
                hoverFunction(d,e);
            }
        }, click : function (m) {
            if(simpleSetting.style.select == "CUSTOM")
                simpleSetting.style.theme.find(function(d) {
                    return d.name == "CUSTOM";
                }).popup();
        }});
        var setCalendarControl = new controller(self.overlayCtx, "SetCalendar", setCalendarConfig, { hover : function (d,e) {  }, click : function (m) { }});
        var setSamplingControl = new controller(self.overlayCtx, "SetSampling", setSamplingConfig, { hover : function (d,e) {  }, click : function (m) { }});

        var selectChartControl = new controller(self.overlayCtx, "SelectChart", selectChartConfig, { hover : hoverFunction, click : function (m) {
            var index = simpleSetting.chart.type.findIndex(function(d) { return d.unicode == m.text });
            (index >= simpleSetting.chart.type.length - 1 || index == -1) ? index = 0 : index++;
            var selectedItem = simpleSetting.chart.type[index];
            m.text = selectedItem.unicode, setChartControl.text = selectedItem.name;
            m.clear(), setChartControl.clear(), m.drawShape(), m.drawText(), setChartControl.drawShape(), setChartControl.drawText();
            simpleSetting.chart.select = selectedItem.name;
            if(selectedItem.name == "COMBINATION") simpleSetting.unit.select = simpleSetting.unit.multi[0], setUnitControl.text = simpleSetting.unit.multi[0], setUnitControl.clear(), setUnitControl.drawShape(), setUnitControl.drawText();
            else setUnitControl.text == "No Units" ? "" : (simpleSetting.unit.select = simpleSetting.unit.single[0], setUnitControl.text = simpleSetting.unit.single[0], setUnitControl.clear(), setUnitControl.drawShape(), setUnitControl.drawText());
        }});

        var selectUnitControl = new controller(self.overlayCtx, "SelectUnit", selectUnitConfig, { hover : hoverFunction, click : function (m) {
            if(setUnitControl.text == "No Units") return;
            var items;
            if(simpleSetting.chart.select.toLowerCase() == "combination") {
                items = simpleSetting.unit.multi;
            } else {
                items = simpleSetting.unit.single;
            }
            var index = items.findIndex(function(d) { return d == simpleSetting.unit.select });
            (index >= items.length - 1 || index == -1) ? index = 0 : index++;
            var selectedItem = items[index];
            simpleSetting.unit.select = selectedItem, setUnitControl.text = selectedItem;
            setUnitControl.clear(), setUnitControl.drawShape(), setUnitControl.drawText();
        }});

        var selectStyleControl = new controller(self.overlayCtx, "SelectStyle", selectStyleConfig, { hover : hoverFunction, click : function (m) {
            var index = simpleSetting.style.theme.findIndex(function(d) { return d.name == setStyleControl.text });
            (index >= simpleSetting.style.theme.length - 1 || index == -1) ? index = 0 : index++;
            var selectedItem = simpleSetting.style.theme[index];
            setStyleControl.text = selectedItem.name;
            simpleSetting.style.select = selectedItem.name;
            setStyleControl.clear(), setStyleControl.drawShape(), setStyleControl.drawText();
        }});

        var selectCalendarControl = new controller(self.overlayCtx, "SelectCalendar", selectCalendarConfig, { hover : hoverFunction, click : function (m) {
            timeBackSetting();

        }});
        var toggleTimeSyncControl = new controller(self.overlayCtx, "ToggleTimeSync", toggleTimeSyncConfig, { hover : hoverFunction, click : function (m) {
            if(m.on) {
                m.on = false, simpleSetting.request.timeRangeSync = false;
            } else {
                m.on = true, simpleSetting.request.timeRangeSync = true;
            }
            m.text = simpleSetting.request.timeRangeSync ? "f0c1" : "f127";
            m.clear(), m.drawShape(), m.drawText();
        }});

        var selectSamplingControl = new controller(self.overlayCtx, "SelectSampling", selectSamplingConfig, { hover : hoverFunction, click : function (m) {
            var index = simpleSetting.request.sampling.methods.findIndex(function(d) { return d == simpleSetting.request.sampling.select });
            (index >= simpleSetting.request.sampling.methods.length - 1 || index == -1) ? index = 0 : index++;
            var selectedItem = simpleSetting.request.sampling.methods[index];
            setSamplingControl.text = selectedItem;
            m.clear(), setSamplingControl.clear(), m.drawShape(), m.drawText(), setSamplingControl.drawShape(), setSamplingControl.drawText();
            simpleSetting.request.sampling.select = selectedItem;
        }});

        var applyControl = new controller(self.overlayCtx, "SetSampling", applyConfig, { hover : hoverFunction, click : function (m) {
            self.options.chartType = simpleSetting.chart.select;
            var selectedStyle = simpleSetting.style.theme.find(function(d){ return d.name == simpleSetting.style.select;});
            var regen = false;
            if(simpleSetting.style.select != "CUSTOM") {
                self.options.style.chart.canvasBackgroundColor = selectedStyle.background, self.options.style.table.background = selectedStyle.background;
                self.options.style.chart.graphTitleFontColor = selectedStyle.header, self.options.style.chart.graphSubTitleFontColor = selectedStyle.header, self.options.style.chart.legendFontColor = selectedStyle.footer;
                self.options.style.chart.scaleFontColor = selectedStyle.body, self.options.style.chart.yAxisUnitFontColor = selectedStyle.body, self.options.style.chart.scaleLineColor = selectedStyle.line, self.options.style.chart.scaleGridLineColor = selectedStyle.line;
                self.options.style.table.titleFontColor = selectedStyle.header, self.options.style.table.subTitleFontColor  = selectedStyle.header, self.options.style.table.innerLineColor = selectedStyle.line, self.options.style.table.innerFontColor = selectedStyle.body;
                self.options.style.theme = selectedStyle.name;
            } else if(typeof selectedStyle.background != "undefined") {
                self.options.style.chart.canvasBackgroundColor = selectedStyle.background, self.options.style.table.background = selectedStyle.background;
                self.options.style.chart.graphTitleFontColor = selectedStyle.header, self.options.style.chart.graphSubTitleFontColor = selectedStyle.header, self.options.style.chart.legendFontColor = selectedStyle.footer;
                self.options.style.chart.scaleFontColor = selectedStyle.body, self.options.style.chart.yAxisUnitFontColor = selectedStyle.body, self.options.style.chart.scaleLineColor = selectedStyle.line, self.options.style.chart.scaleGridLineColor = selectedStyle.line;
                self.options.style.table.titleFontColor = selectedStyle.header, self.options.style.table.subTitleFontColor  = selectedStyle.header, self.options.style.table.innerLineColor = selectedStyle.line, self.options.style.table.innerFontColor = selectedStyle.body;

                self.options.style.chart.graphTitleFontSize = selectedStyle.headersize, self.options.style.chart.graphSubTitleFontSize = selectedStyle.headersize * (2/3);
                self.options.style.table.titleFontSize = selectedStyle.headersize, self.options.style.table.subTitleFontSize = selectedStyle.headersize * (2/3);
                self.options.style.chart.scaleFontSize = selectedStyle.bodysize, self.options.style.chart.yAxisFontSize = selectedStyle.bodysize;
                self.options.style.table.innerFontSize = selectedStyle.bodysize, self.options.style.chart.legendFontSize = selectedStyle.footersize;
                self.options.style.chart.graphAlign = selectedStyle.headeralign, self.options.style.chart.graphAlign == "left" ? self.options.style.chart.graphPosX = 50 :self.options.style.chart.graphPosX =  self.$container.width()/2, self.options.style.table.titleFontAlign = selectedStyle.headeralign;
                self.options.yAxisFormat = selectedStyle.ydigitformat, self.options.style.chart.yAxisFormat = selectedStyle.ydigitformat;
                self.options.yMinimum = selectedStyle.ymin, self.options.style.table.innerChartOptions.yMinimum = selectedStyle.ymin, self.options.style.chart.yMinimum = selectedStyle.ymin;
                self.options.yMaximum = selectedStyle.ymax, self.options.style.table.innerChartOptions.yMaximum = selectedStyle.ymax, self.options.style.chart.yMaximum = selectedStyle.ymax;
                self.options.xAxisField = selectedStyle.xfield;
                if(self.options.timeFormat != selectedStyle.xtimeformat) self.options.timeFormat = selectedStyle.xtimeformat, regen = true;
                if(self.options.fixedUnit != selectedStyle.yunit) self.options.fixedUnit = selectedStyle.yunit, simpleSetting.unit.select = selectedStyle.yunit, setUnitControl.clear(), setUnitControl.text = selectedStyle.yunit == '' ? 'No Units' : selectedStyle.yunit, setUnitControl.drawShape(), setUnitControl.drawText(), regen = true;

                for(var i in selectedStyle.seriesColor) {
                    var color = convertHex(selectedStyle.seriesColor[i], 50);
                    self.options.style.chart.seriesColor[i] = selectedStyle.seriesColor[i], self.renderData.chart.datasets[i].fillColor = color;
                    self.renderData.chart.datasets[i].strokeColor = color, self.renderData.chart.datasets[i].pointColor = color;
                    self.renderData.pie[i].color = color;
                }

                self.options.style.chart.seriesColor = selectedStyle.seriesColor;
                self.options.style.theme = selectedStyle.name;
            }

            if(simpleSetting.request.start != self.options.start || self.options.end != simpleSetting.request.end || self.options.samplingMethod != simpleSetting.request.sampling.select.toLowerCase() || self.options.timeRangeSync != simpleSetting.request.timeRangeSync || regen) {
                self.options.start = simpleSetting.request.start, self.options.end = simpleSetting.request.end, self.options.samplingMethod = simpleSetting.request.sampling.select.toLowerCase(), self.options.timeRangeSync = simpleSetting.request.timeRangeSync;
                self.load(self.guid);
            } else {
                var message = {
                    type : "draw"
                }
                renderWorker.postMessage(message);
            }
        }});

        setChartControl.drawShape(), setChartControl.drawText(), setUnitControl.drawShape(), setUnitControl.drawText(), setStyleControl.drawShape(), setStyleControl.drawText();
        setSamplingControl.drawShape(), setSamplingControl.drawText(), setCalendarControl.drawShape(), setCalendarControl.drawText();
        selectCalendarControl.drawShape(), selectCalendarControl.drawText(), selectSamplingControl.drawShape(), selectSamplingControl.drawText();
        selectChartControl.drawShape(), selectChartControl.drawText(), selectUnitControl.drawShape(), selectUnitControl.drawText();
        selectStyleControl.drawShape(), selectStyleControl.drawText(), applyControl.drawShape(), applyControl.drawText();
        toggleTimeSyncControl.drawShape(), toggleTimeSyncControl.drawText();

        self.controlContainer.push(selectChartControl), self.controlContainer.push(setChartControl), self.controlContainer.push(selectUnitControl), self.controlContainer.push(setUnitControl);
        self.controlContainer.push(selectStyleControl), self.controlContainer.push(setStyleControl), self.controlContainer.push(selectCalendarControl), self.controlContainer.push(setCalendarControl);
        self.controlContainer.push(selectSamplingControl), self.controlContainer.push(setSamplingControl), self.controlContainer.push(applyControl), self.controlContainer.push(toggleTimeSyncControl);

        $(self.overlay).css("pointer-events", "auto");
    };

    self.close = function() {
        self.$container.unbind(".setting");
        self.renderData = null, self.options = null, tempChart = null, self.pointerArr = null, zoomHistory = null, self.controlContainer = null;
        var annotateDIV = document.getElementById("divCursor");
        annotateDIV.style.display = "none";
        self.chartObj.dispose();

        renderWorker.terminate();
    }
};