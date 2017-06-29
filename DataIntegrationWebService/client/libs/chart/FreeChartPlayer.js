require('./chart.js');

module.exports = function () {
    var self = this;
    
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
            return Math.floor(date.getTime());
        }
        return null;
    };

    var convertTimestampToDate = function(timestamp) {
        return new Date(timestamp);
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
                        let dataset = self.renderData.chart.datasets.find(function(a){return a.id == d.id})
                        d.data.push(dataset.data[rightIndex + 1])
                    });
                } else {
                    continue;
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
                        let dataset = self.renderData.chart.datasets.find(function(a){return a.id == d.id})
                        d.data.splice(0, 0, dataset.data[leftIndex - 1])
                    });
                } else {
                    continue;
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
        predict: false,
        title:"",
        chartType: "area",
        start : 0,
        end : 0,
        fake: false,
        data: undefined,
        timeRangeSync : false,
        samplingMethod: "all",
        samplingInterval : 3600,
        xAxisField: "unixtime",
        fixedUnit:"",
        timeFormat:"yyyy-MM-dd HH:mm:ss",
        yAxisFormat:2,
        yMaximum:"smart",
        yMinimum:"smart",
        useControl: true,
        usePeriodControl: false,
        useCollaboration : false,
        style: {
            theme : "WHITE",
            chart: {
                canvasBackgroundColor: 'rgba(0,0,0,0)',
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
                seriesColor : ["#ff0000", "#0000ff", "#000000", "#00ff00", "#C6FF00 ", "#0000ff","#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff","#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff","#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff","#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff","#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff","#f45b5b", "#8085e9", "#4DB6AC", "#E040FB", "#C6FF00 ", "#ff0000", "#0000ff",
                    "#55BF3B", "#8d4654", "#7798BF", "#aaeeee","#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                annotateDisplay: true,
                annotateLabel: '<%=v12%><BR><%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>',
                xAxisSpaceBetweenLabels: 100,
                detectAnnotateOnFullLine : false,
                spaceLeft: 20,
                spaceRight: 20,
                spaceTop: 20,
                spaceBottom: 20,
                bezierCurve: true,
                bezierCurveTension: 0.2,
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
                        var navigator = self.controlContainer.find(function(h) { return h.id == "navigator"});
                        if(self.options.chartType.toLowerCase() !== 'pie') {
                            self.pointerArr = [];
                            if(isOrigin) self.originPointerArr = [];
                            standard = { top : g.startY, bottom : g.endY, left : g.startX, right : g.endX }
                            var canvasWidth = standard.right - standard.left;
                            var gap = (self.canvas.width - canvasWidth) / 2;

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
                                        ratioPointer.pointX = (ratioPointer.pointX - standard.left) / canvasWidth;
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
                            if(navigator) {
                                navigator.display = true;
                                navigator.clear();
                                var leftPos = self.originPointerArr.find(function(h) { return h.time == tempChart.times[0] });
                                var rightPos = self.originPointerArr.find(function(h) { return h.time == tempChart.times[tempChart.times.length - 1] });
                                navigator.x = leftPos.pointX * canvasWidth + standard.left, navigator.y = standard.bottom + 2, navigator.width = (rightPos.pointX*canvasWidth) - (leftPos.pointX*canvasWidth) + 2, navigator.time = leftPos.time, navigator.valueHop = rightPos.valueHop * canvasWidth;
                                navigator.drawShape();
                            }
                        } else {
                            
                            if(navigator) {
                                navigator.display = false;
                                navigator.clear();
                            }
                        }
                        self._deferred.resolve(self);
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
                annotateBackgroundColor: 'rgba(255,255,255,0.5)', annotateFontColor: "rgba(0,0,0,1)", annotateFunction: "mousemove", annotateRelocate: true,
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

    self.initialize = function(div) {
        self.$container = $(div);
        self.$container.empty();
        self.overlay = document.createElement("canvas");
        $(self.overlay).attr("width", self.$container.width()).attr("height", self.$container.height()).css("position", "absolute").css("z-index",10).css("pointer-events", "none").css('background','rgba(0,0,0,0)')
        self.$container.append(self.overlay);
        self.overlayCtx = self.overlay.getContext('2d');
        
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
                self.$container[0].style.cursor = 'default';
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

        var prevHeight = self.$container.height();
        var prevWidth = self.$container.width();
        self.detectInterval = setInterval(function(){
            if(self.$container.height() !== prevHeight || self.$container.width() !== prevWidth) {
                prevHeight = self.$container.height();
                prevWidth = self.$container.width();
                var message = {
                    type : "redraw"
                };
                renderWorker.postMessage(message);
                var message2 = {
                    type : "redrawControl"
                };
                renderWorker.postMessage(message2);
            }
        },100)

        AddChartControl();
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

    self.load = function() {
        isOrigin = true;
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

        self.options.style.chart.yAxisFormat = self.options.yAxisFormat, self.options.style.chart.yMaximum = self.options.yMaximum, self.options.style.chart.yMinimum = self.options.yMinimum;
        var yMinInterval = 1;
        for(var i = 0; i < parseInt(self.options.yAxisFormat); i++){
            yMinInterval = yMinInterval * 1/10
        }
        self.options.style.chart.yAxisMinimumInterval = yMinInterval;
        self.options.style.chart.yAxisMinimumInterval2 = yMinInterval;

        if(self.options.style.theme == "WHITE") {
            var selectedStyle = simpleSetting.style.theme.find(function(d){ return d.name == "WHITE";});
            self.options.style.chart.canvasBackgroundColor = selectedStyle.background;
            self.options.style.chart.graphTitleFontColor = selectedStyle.header, self.options.style.chart.graphSubTitleFontColor = selectedStyle.header, self.options.style.chart.legendFontColor = selectedStyle.footer;
            self.options.style.chart.scaleFontColor = selectedStyle.body, self.options.style.chart.yAxisUnitFontColor = selectedStyle.body, self.options.style.chart.scaleLineColor = selectedStyle.line, self.options.style.chart.scaleGridLineColor = selectedStyle.line;
        } else {
            var selectedStyle = simpleSetting.style.theme.find(function(d){ return d.name == "BLACK";});
            self.options.style.chart.canvasBackgroundColor = selectedStyle.background;
            self.options.style.chart.graphTitleFontColor = selectedStyle.header, self.options.style.chart.graphSubTitleFontColor = selectedStyle.header, self.options.style.chart.legendFontColor = selectedStyle.footer;
            self.options.style.chart.scaleFontColor = selectedStyle.body, self.options.style.chart.yAxisUnitFontColor = selectedStyle.body, self.options.style.chart.scaleLineColor = selectedStyle.line, self.options.style.chart.scaleGridLineColor = selectedStyle.line;
        }

        if(self.options.fake) {
            if(self.options.data != null && typeof self.options.data != "undefined") {
                deserializeData(self.options.data);
            } else {
                if(self.canvas) $(self.canvas).detach();
                var navigator = self.controlContainer.find(function(h) { return h.id == "navigator"});
                if(navigator) {
                    navigator.display = false;
                    navigator.clear();
                }
            }
            self.draw();
        }
        this._deferred.promise();

        return this._deferred;
    };

    self.setOptions = function (options) {
        $.extend(true, self.options, options);
    };

    var AddChartControl = function () {
        var navigatorConfig = {x : undefined,y : undefined,width : undefined,height : 6,fill : "white", type: "navi", shape : "rectangle",
            stroke : "rgba(100,120,150,0.8)" ,strokewidth : 1,radius : { lt : 2, lb : 2, rt : 2, rb : 2 },text : "",textfill : "rgba(160,160,163,0)",font : 0,
            highlight : "rgba(150,120,100,0.5)",onColor : "red",hover : false,on : false,icon : false,keeping : true,display : false};
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

    var deserializeData = function (result) {
        self.options.style.chart.graphTitle = self.options.title;

        var _result = result.data;

        var fieldsLen = result.fields.length;
        if(result.fields.length > 0) {
            self.options.Fields = [];
            var colorIndex = 0;
            for(var i = 0; i < fieldsLen; i++) {
                var field = result.fields[i];
                if (field.value !== "unixtime" && field.type !== "Text") {
                    var real_color = field.value.includes("_support") ? '#8eb021' : field.value.includes("_resistance") ? '#d04437' : self.options.style.chart.seriesColor[colorIndex];
                    var color = convertHex(real_color, field.value.includes("_real_") ? 100 : 45);
                    var series = {
                        fillColor: color,
                        strokeColor: color,
                        pointColor: color,
                        markerShape: "circle",
                        pointStrokeColor: "rgba(255,255,255,0)",
                        data: [],
                        title: field.value,
                        id: field.value,
                        unit : self.options.fixedUnit,
                        datasetFill : true,
                        tooltip : true,
                        visible : true,
                        hover : false
                    };

                    var pieSeries = {
                        value: 0,
                        color: color,
                        title: field.value,
                        id : field.value,
                        unit : self.options.fixedUnit,
                        datasetFill : true,
                        tooltip : true,
                        visible : true,
                        hover : false
                    };
                    self.renderData.chart.datasets.push(series);
                    self.renderData.pie.push(pieSeries);
                    self.options.Fields.push(field.value);
                    colorIndex++;
                } else {
                    self.renderData.labels[field.value] = [];
                }
            }
        }

        var metric = _result;

        if(metric != undefined && metric.length > 0) {
            var colorIndex = 0;
            var sameCount = 1;
            var metricTime = 0;
            var metricLen = metric.length;
            var maxVal = 0;
            var minVal = 0;
            for(var a = 0; a < metricLen; a++) {
                var dataTime = parseInt(metric[a]['unixtime']) * 1000;
                metricTime == dataTime ? (metricTime = dataTime + sameCount, sameCount++) : (metricTime = dataTime,sameCount = 1);
                var standardTime = new Date(metricTime).format(self.options.timeFormat);
                self.renderData.labels["unixtime"].push(standardTime), self.renderData.chart.times.push(metricTime);

                var subLen = self.options.Fields.length;
                for(var b = 0; b < subLen; b++) {
                    var find = self.renderData.chart.datasets.find(function(d) { return d.id == self.options.Fields[b];});
                    var find2 = self.renderData.pie.find(function(d) { return d.id == self.options.Fields[b];});
                    var val = parseFloat(metric[a][self.options.Fields[b]]);
                    if(isNaN(val)) val = undefined;
                    maxVal = maxVal <= val ? val : maxVal;
                    minVal = minVal >= val ? val : minVal;
                    find2.value = find2.value + (typeof val == "undefined" ? 0 : parseInt(val));
                    find.data.push(val);
                    colorIndex++;
                }

                for(var label in self.renderData.labels) {
                    if(label !== 'unixtime') {
                        self.renderData.labels[label].push(typeof metric[a][label] == "undefined" ? "" : metric[a][label]);
                    }
                }
                metricTime = dataTime;
            }
            self.options.style.chart.graphSubTitle = 'Range : ' + self.renderData.labels["unixtime"][0] + " ~ "
                                                   + self.renderData.labels["unixtime"][self.renderData.labels["unixtime"].length-1];
            // self.options.style.chart.yMaximum = self.options.yMaximum = maxVal;
            // self.options.style.chart.yMinimum = self.options.yMinimum = minVal;
        }
        return true;
    };

    self.draw = function() {
        self.startDraw = new Date();
        $(self.canvas).detach();
        self.renderData.chart.labels = self.renderData.labels[self.options.xAxisField];

        self.canvas = document.createElement("canvas");
        $(self.canvas).attr("width", self.$container.width()).attr("height", self.$container.height()).css("position", "relative");
        self.$container.append(self.canvas);
        self.chartCtx = self.canvas.getContext("2d");
        var chartType = 'Line';
        var chartTypeOption = self.options.chartType.toLowerCase();
        tempChart = $.extend(true, {}, self.renderData.chart);
        
        if (chartTypeOption  == 'line' || chartTypeOption == 'area') {
            chartType = 'Line';
            tempChart.datasets.forEach(function(d) {d.datasetFill = chartTypeOption == 'area' ? true : false; d.axis = 1;});
            self.options.style.chart.yAxisRight = false;
            self.options.style.chart.yAxisUnit = self.options.fixedUnit;
            self.options.style.chart.annotateLabel = '<%=v12%><BR><%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>';
        } else if( chartTypeOption == 'pie') {
            tempChart = $.extend(true, [], self.renderData.pie);
            var pieIndex = tempChart.findIndex(function(d) {return d.id == self.options.xAxisField} );
            if(pieIndex != -1) tempChart.splice(pieIndex, 1);
            chartType = 'Pie';
            self.options.style.chart.annotateLabel = '<span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v2%> <%=unit%>';
            self.options.style.chart.yAxisRight = false;
        } else if (chartTypeOption == 'bar') {
            chartType = 'Bar';
            self.options.style.chart.yAxisRight = false;
            self.options.style.chart.annotateLabel = '<%=v12%><BR><%=v2%><BR><span style="color:{color};font-size:10px;">●</span> <%=v1%> : <%=v3%> <%=unit%>';
            tempChart.datasets.forEach(function(d) {d.datasetFill = true; d.axis = 1;});
            self.options.style.chart.yAxisUnit = self.options.fixedUnit;
        }
        self.chartObj = new Chart(self.chartCtx);
        var evalText = 'self.chartObj.'+chartType+'(tempChart, self.options.style.chart); self.chartCtx.stroke();'
        eval(evalText);
    };

    self.redraw = function (data) {
        if(self.options.predict) {
            var fieldsLength = data.datasets.length;
            for(var i = 0; i < fieldsLength; i++){
                var row = _.cloneDeep(data.datasets[i]);
                if(row.id.includes("support") || row.id.includes("resistance")){
                    continue;
                }
                var maxIndex = row.data.indexOf(Math.max(...row.data.filter(function(d){ return d != undefined && d != "undefined"})));
                var minIndex = row.data.indexOf(Math.min(...row.data.filter(function(d){ return d != undefined && d != "undefined"})));
                var nextData, nextMin, nextMax;
                if(minIndex > maxIndex) {
                    nextData = row.data.filter(function(d,k){ return k > minIndex && d != undefined && d != "undefined"});
                    if(nextData.length > 0) {
                        nextMax = row.data.lastIndexOf(Math.max(...nextData));
                        nextData = row.data.filter(function(d,k) { return k > nextMax && d != undefined && d != "undefined"});
                        if(nextData.length > 0) {
                            nextMin = row.data.lastIndexOf(Math.min(...nextData));
                        }
                    }
                } else {
                    nextData = row.data.filter(function(d,k){ return k > maxIndex && d != undefined && d != "undefined"});
                    if(nextData.length > 0) {
                        nextMin = row.data.lastIndexOf(Math.min(...nextData));
                        nextData = row.data.filter(function(d,k) { return k > nextMin && d != undefined && d != "undefined"});
                        if(nextData.length > 0) {
                            nextMax = row.data.lastIndexOf(Math.max(...nextData));
                        }
                    }
                }
                if(nextMin == undefined && nextMax == undefined) {
                    if(minIndex > maxIndex) {
                        var timeMaxGap = (data.times[minIndex] - data.times[maxIndex]) / (minIndex - maxIndex);
                        var maxGap = (row.data[minIndex] - row.data[maxIndex]) / (minIndex - maxIndex);
                        for(var j = maxIndex; j < row.data.length+30; j++) {
                            var supportData = data.datasets.find(function(d){ return d.id == row.id + '_real_resistance' });
                            if(data.datasets[i]) {
                                supportData.data[j] = data.datasets[i].data[maxIndex] + maxGap * (j - maxIndex);
                            }
                        }
                    } else {
                        var timeMinGap = (data.times[maxIndex] - data.times[minIndex]) / (maxIndex - minIndex);
                        var minGap = (row.data[maxIndex] - row.data[minIndex]) / (maxIndex - minIndex);
                        for(var j = minIndex; j < row.data.length+30; j++) {
                            var supportData = data.datasets.find(function(d){ return d.id == row.id + '_real_support' });
                            if(data.datasets[i]) {
                                supportData.data[j] = data.datasets[i].data[minIndex] + minGap * (j - minIndex);
                            }
                        }
                    }
                } else {
                    if(nextMin != undefined) {
                        var timeMinGap = (data.times[nextMin] - data.times[minIndex]) / (nextMin - minIndex);
                        var minGap = (row.data[nextMin] - row.data[minIndex]) / (nextMin - minIndex);
                        for(var j = minIndex; j < row.data.length+30; j++) {
                            var supportData = data.datasets.find(function(d){ return d.id == row.id + '_real_support' });
                            if(data.datasets[i]) {
                                supportData.data[j] = data.datasets[i].data[minIndex] + minGap * (j - minIndex);
                            }
                        }
                    } else if(nextMax != undefined) {
                        var timeMinGap = (data.times[nextMax] - data.times[minIndex]) / (nextMax - minIndex);
                        var minGap = (row.data[nextMax] - row.data[minIndex]) / (nextMax - minIndex);
                        for(var j = minIndex; j < row.data.length+30; j++) {
                            var supportData = data.datasets.find(function(d){ return d.id == row.id + '_real_support' });
                            if(data.datasets[i]) {
                                supportData.data[j] = data.datasets[i].data[minIndex] + minGap * (j - minIndex);
                            }
                        }
                    }
                    if(nextMax != undefined) {
                        var timeMaxGap = (data.times[nextMax] - data.times[maxIndex]) / (nextMax - maxIndex);
                        var maxGap = (row.data[nextMax] - row.data[maxIndex]) / (nextMax - maxIndex);
                        for(var j = maxIndex; j < row.data.length+30; j++) {
                            var supportData = data.datasets.find(function(d){ return d.id == row.id + '_real_resistance' });
                            if(data.datasets[i]) {
                                supportData.data[j] = data.datasets[i].data[maxIndex] + maxGap * (j - maxIndex);
                            }
                        }
                    } else if (nextMin != undefined) {
                        var timeMaxGap = (data.times[nextMin] - data.times[maxIndex]) / (nextMin - maxIndex);
                        var maxGap = (row.data[nextMin] - row.data[maxIndex]) / (nextMin - maxIndex);
                        for(var j = maxIndex; j < row.data.length+30; j++) {
                            var supportData = data.datasets.find(function(d){ return d.id == row.id + '_real_resistance' });
                            if(data.datasets[i]) {
                                supportData.data[j] = data.datasets[i].data[maxIndex] + maxGap * (j - maxIndex);
                            }
                        }
                    }
                }
            }
        }
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
            $(self.canvas).attr("width", self.$container.width()).attr("height", self.$container.height()).css("position", "relative");
            self.$container.append(self.canvas);
            self.chartCtx = self.canvas.getContext("2d");
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
                {name : "WHITE", background : "#ffffff", header : "#000000", footer : "#000000", body : "#575457", line : "#a8a0a8"}
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

    self.close = function() {
        clearInterval(self.detectInterval);
        self.$container.unbind(".setting");
        self.renderData = null, self.options = null, tempChart = null, self.pointerArr = null, zoomHistory = null, self.controlContainer = null;
        var annotateDIV = document.getElementById("divCursor");
        if(annotateDIV) annotateDIV.style.display = "none";
        if(self.chartObj) self.chartObj.dispose();

        renderWorker.terminate();
    }
};