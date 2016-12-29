/**
 * Created by shkim on 2016-05-16.
 */
window.Chart = function(context) {
    function lineStyleFn(e) {
        return "object" == typeof chartJSLineStyle[e] ? chartJSLineStyle[e] : chartJSLineStyle.solid
    }

    function roundToWithThousands(e, a, t) {
        var i = 1 * unFormat(e, a);
        if ("number" == typeof i && "none" != t) {
            var l;
            if (0 >= t) l = -t, i = +(Math.round(i + "e+" + l) + "e-" + l);
            else {
                l = t;
                var n = "1e+" + l;
                i = +Math.round(i / n) * n
            }
        }
        return i = fmtChartJS(e, i, "none")
    }

    function unFormat(e, a) {
        if ("." == e.decimalSeparator && "" == e.thousandSeparator || "string" != typeof a) return a;
        var t = "" + a;
        if ("" != e.thousandSeparator)
            for (; t.indexOf(e.thousandSeparator) >= 0;) t = "" + t.replace(e.thousandSeparator, "");
        return "." != e.decimalSeparator && (t = "" + t.replace(e.decimalSeparator, ".")), 1 * t
    }

    function fmtChartJSPerso(e, a, t) {
        switch (t) {
            case "SampleJS_Format":
                "number" == typeof a ? return_value = "My Format : " + a.toString() + " $" : return_value = a + "XX";
                break;
            case "Change_Month":
                "string" == typeof a ? return_value = a.toString() + " 2014" : return_value = a.toString() + "YY";
                break;
            default:
                return_value = a
        }
        return return_value
    }

    function fmtChartJS(e, a, t) {
        var i;
        if ("notformatted" == t) i = a;
        else if ("none" == t && "number" == typeof a) {
            if ("none" != e.roundNumber) {
                var l;
                if (e.roundNumber <= 0) l = -e.roundNumber, a = +(Math.round(a + "e+" + l) + "e-" + l);
                else {
                    l = e.roundNumber;
                    var n = "1e+" + l;
                    a = +Math.round(a / n) * n
                }
            }
            if ("." != e.decimalSeparator || "" != e.thousandSeparator) {
                if (i = a.toString().replace(/\./g, e.decimalSeparator), "" != e.thousandSeparator) {
                    var o = i,
                        s = "",
                        r = o.indexOf(e.decimalSeparator);
                    r >= 0 && (s = o.substring(r + 1, o.length), s = s.split("").reverse().join(""), o = o.substring(0, r)), o = o.toString().replace(/\B(?=(\d{3})+(?!\d))/g, e.thousandSeparator), s = s.split("").reverse().join(""), i = o, "" != s && (i = i + e.decimalSeparator + s)
                }
            } else i = a
        } else i = "none" != t && "notformatted" != t ? fmtChartJSPerso(e, a, t) : a;
        return i
    }

    function addParameters2Function(data, fctName, fctList) {
        var mathFunctions = {
            mean: {
                data: data.data,
                datasetNr: data.v11
            },
            varianz: {
                data: data.data,
                datasetNr: data.v11
            },
            stddev: {
                data: data.data,
                datasetNr: data.v11
            },
            cv: {
                data: data.data,
                datasetNr: data.v11
            },
            median: {
                data: data.data,
                datasetNr: data.v11
            }
        };
        if (dif = !1, "Dif" == fctName.substr(-3) && (fctName = fctName.substr(0, fctName.length - 3), dif = !0), "function" == typeof eval(fctName)) {
            var parameter = eval(fctList + "." + fctName);
            return dif ? data.v3 - window[fctName](parameter) : window[fctName](parameter)
        }
        return null
    }

    function isNumber(e) {
        return !isNaN(parseFloat(e)) && isFinite(e)
    }

    function tmplbis(e, a, t) {
        var newstr;
        return newstr = e, newstr.substr(0, t.templatesOpenTag.length) == t.templatesOpenTag && (newstr = "<%=" + newstr.substr(t.templatesOpenTag.length, newstr.length - t.templatesOpenTag.length)), newstr.substr(newstr.length - t.templatesCloseTag.length, t.templatesCloseTag.length) == t.templatesCloseTag && (newstr = newstr.substr(0, newstr.length - t.templatesCloseTag.length) + "%>"), tmplter(newstr, a)
    }

    function tmplter(e, a) {
        for (var t = ["mean", "varianz", "stddev", "cv", "median"], i = new RegExp("<%=((?:(?:.*?)\\W)??)((?:" + t.join("|") + ")(?:Dif)?)\\(([0-9]*?)\\)(.*?)%>", "g"); i.test(e);) e = e.replace(i, function(e, t, i, l, n) {
            var o;
            o = l ? l : 2;
            var s = addParameters2Function(a, i, "mathFunctions");
            return isNumber(s) ? "<%=" + t + Math.round(Math.pow(10, o) * s) / Math.pow(10, o) + n + "%>" : "<%= %>"
        });
        var l = /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(e) ? cachebis[e] = cachebis[e] || tmplter(document.getElementById(e).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + e.replace(/[\r\n]/g, "\\n").replace(/[\t]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        return a ? l(a) : l
    }

    function createCursorDiv() {
        if (0 == cursorDivCreated && document.getElementById('divCursor') == null) {
            var e = document.createElement("divCursor");
            e.id = "divCursor", e.style.position = "absolute", document.body.appendChild(e), cursorDivCreated = !0
        }
    }

    function addResponsiveChart(e, a, t, i) {
        initChartResize();
        var l = resizeGraph(a, i);
        "undefined" != typeof a.prevWidth ? (resizeCtx(a, l.newWidth, l.newHeight, i), a.prevWidth = l.newWidth) : i.responsiveScaleContent && i.responsiveWindowInitialWidth && (a.initialWidth = l.newWidth), a.prevWidth = l.newWidth, a.prevHeight = l.newHeight, jsGraphResize[jsGraphResize.length] = [e, a.tpchart, a, t, i]
    }

    function initChartResize() {
        0 == initChartJsResize && (window.addEventListener ? window.addEventListener("resize", chartJsResize) : window.attachEvent("resize", chartJsResize))
    }

    function getMaximumWidth(e) {
        return null != e.parentNode && void 0 != e.parentNode && (container = e.parentNode), container.clientWidth
    }

    function getMaximumHeight(e) {
        return null != e.parentNode && void 0 != e.parentNode && (container = e.parentNode), container.clientHeight
    }

    function resizeCtx(e, a, t, i) {
        "undefined" == typeof e.DefaultchartTextScale && (e.DefaultchartTextScale = i.chartTextScale), "undefined" == typeof e.DefaultchartLineScale && (e.DefaultchartLineScale = i.chartLineScale), "undefined" == typeof e.DefaultchartSpaceScale && (e.DefaultchartSpaceScale = i.chartSpaceScale), e.canvas.height = t, e.canvas.width = a, "undefined" != typeof e.chartTextScale && i.responsiveScaleContent && (e.chartTextScale = e.DefaultchartTextScale * (a / e.initialWidth), e.chartLineScale = e.DefaultchartLineScale * (a / e.initialWidth), e.chartSpaceScale = e.DefaultchartSpaceScale * (a / e.initialWidth))
    }

    function resizeGraph(e, a) {
        "undefined" == typeof a.maintainAspectRatio && (a.maintainAspectRatio = !0), "undefined" == typeof a.responsiveMinWidth && (a.responsiveMinWidth = 0), "undefined" == typeof a.responsiveMinHeight && (a.responsiveMinHeight = 0), "undefined" == typeof a.responsiveMaxWidth && (a.responsiveMaxWidth = 9999999), "undefined" == typeof a.responsiveMaxHeight && (a.responsiveMaxHeight = 9999999);
        var t = e.canvas;
        "undefined" == typeof e.aspectRatio && (e.aspectRatio = t.width / t.height);
        var i = getMaximumWidth(t),
            l = a.maintainAspectRatio ? i / e.aspectRatio : getMaximumHeight(t);
        return i = Math.min(a.responsiveMaxWidth, Math.max(a.responsiveMinWidth, i)), l = Math.min(a.responsiveMaxHeight, Math.max(a.responsiveMinHeight, l)), {
            newWidth: parseInt(i),
            newHeight: parseInt(l)
        }
    }

    function chartJsResize() {
        for (var e = 0; e < jsGraphResize.length; e++) "undefined" != typeof jsGraphResize[e][2].firstPass && 5 == jsGraphResize[e][2].firstPass && (jsGraphResize[e][2].firstPass = 6), subUpdateChart(jsGraphResize[e][2], jsGraphResize[e][3], jsGraphResize[e][4])
    }

    function reflowChart(ci) {
        for (var e = 0; e < jsGraphResize.length; e++) {
            if(jsGraphResize[e][0] === ci) {
                redrawGraph(jsGraphResize[e][2], jsGraphResize[e][3], jsGraphResize[e][4])
            }
        }
    }

    function testRedraw(e, a, t) {
        return 2 == e.firstPass || 4 == e.firstPass || 9 == e.firstPass ? (e.firstPass = 6, subUpdateChart(e, a, t), !0) : (e.firstPass = 5, !1)
    }

    function updateChart(e, a, t, i, l) {
        if (5 == e.firstPass) {
            if (window.devicePixelRatio && (e.canvas.width = e.canvas.width / window.devicePixelRatio, e.canvas.height = e.canvas.height / window.devicePixelRatio), e.runanimationcompletefunction = l, i ? e.firstPass = 0 : t.responsive ? e.firstPass = 7 : e.firstPass = 7, t.responsive)
                for (var n = 0; n < jsGraphResize.length; n++) jsGraphResize[n][2].ChartNewId == e.ChartNewId && (jsGraphResize[n][3] = a, jsGraphResize[n][4] = t);
            subUpdateChart(e, a, t)
        }
    }

    function subUpdateChart(e, a, t) {
        if (dynamicFunction(a, t, e)) {
            var i;
            "undefined" == typeof e.firstPass ? (e.firstPass = 1, i = resizeGraph(e, t), t.responsive ? (resizeCtx(e, i.newWidth, i.newHeight, t), e.prevWidth = i.newWidth, e.prevHeight = i.newHeight) : (e.prevWidth = 0, e.prevHeight = 0), e.runanimationcompletefunction = !0, redrawGraph(e, a, t)) : 0 == e.firstPass ? (e.firstPass = 1, i = resizeGraph(e, t), t.responsive ? (resizeCtx(e, i.newWidth, i.newHeight, t), e.prevWidth = i.newWidth, e.prevHeight = i.newHeight) : (e.prevWidth = 0, e.prevHeight = 0), redrawGraph(e, a, t)) : 1 == e.firstPass || 2 == e.firstPass ? e.firstPass = 2 : 3 == e.firstPass || 4 == e.firstPass ? e.firstPass = 4 : 5 == e.firstPass ? (e.firstPass = 1, redrawGraph(e, a, t)) : 6 == e.firstPass ? (i = resizeGraph(e, t), i.newWidth != e.prevWidth || i.newHeight != e.prevHeight ? (e.firstPass = 3, e.clearRect(0, 0, e.canvas.width, e.canvas.height), t.responsive ? (resizeCtx(e, i.newWidth, i.newHeight, t), e.prevWidth = i.newWidth, e.prevHeight = i.newHeight) : (e.prevWidth = 0, e.prevHeight = 0), redrawGraph(e, a, t)) : e.firstPass = 5) : 7 == e.firstPass && (i = resizeGraph(e, t), e.firstPass = 3, e.clearRect(0, 0, e.canvas.width, e.canvas.height), t.responsive ? (resizeCtx(e, i.newWidth, i.newHeight, t), e.prevWidth = i.newWidth, e.prevHeight = i.newHeight) : (e.prevWidth = 0, e.prevHeight = 0), redrawGraph(e, a, t))
        }
    }

    function redrawGraph(e, a, t) {
        var i = new Chart(e);
        switch (e.tpchart) {
            case "Bar":
                i.Bar(a, t);
                break;
            case "Pie":
                i.Pie(a, t);
                break;
            case "Doughnut":
                i.Doughnut(a, t);
                break;
            case "Radar":
                i.Radar(a, t);
                break;
            case "PolarArea":
                i.PolarArea(a, t);
                break;
            case "HorizontalBar":
                i.HorizontalBar(a, t);
                break;
            case "StackedBar":
                i.StackedBar(a, t);
                break;
            case "HorizontalStackedBar":
                i.HorizontalStackedBar(a, t);
                break;
            case "Line":
                i.Line(a, t)
        }
    }

    function checkBrowser() {
        return this.ver = navigator.appVersion, this.dom = document.getElementById ? 1 : 0, this.ie5 = this.ver.indexOf("MSIE 5") > -1 && this.dom ? 1 : 0, this.ie4 = document.all && !this.dom ? 1 : 0, this.ns5 = this.dom && parseInt(this.ver) >= 5 ? 1 : 0, this.ns4 = document.layers && !this.dom ? 1 : 0, this.bw = this.ie5 || this.ie4 || this.ns4 || this.ns5, this
    }

    function cursorInit() {
        var scrolled = bw.ns4 || bw.ns5 ? "window.pageYOffset" : "document.body.scrollTop"; bw.ns4 && document.captureEvents(Event.MOUSEMOVE)
    }

    function makeCursorObj(obj, nest) {
        return createCursorDiv(), nest = nest ? "document." + nest + "." : "", this.css = bw.dom ? document.getElementById(obj).style : bw.ie4 ? document.all[obj].style : bw.ns4 ? eval(nest + "document.layers." + obj) : 0, this.moveIt = b_moveIt, cursorInit(), this
    }

    function b_moveIt(e, a) {
        this.x = e, this.y = a, this.css.left = this.x + "px", this.css.top = this.y + "px"
    }

    function isIE() {
        var e = navigator.userAgent.toLowerCase();
        return -1 != e.indexOf("msie") ? parseInt(e.split("msie")[1]) : !1
    }

    function mergeChartConfig(e, a) {
        var t = {};
        for (var i in e) t[i] = e[i];
        for (var l in a) t[l] = a[l];
        return t
    }

    function sleep(e) {
        var a = new Date;
        for (a.setTime(a.getTime() + e);
             (new Date).getTime() < a.getTime(););
    }

    function saveCanvas(e, a, t) {
        cvSave = e.getImageData(0, 0, e.canvas.width, e.canvas.height);
        var i = {
                savePng: !1,
                annotateDisplay: !1,
                animation: !1,
                dynamicDisplay: !1
            },
            l = mergeChartConfig(t, i);
        l.clearRect = !1, redrawGraph(e, a, l);
        var n;
        if ("NewWindow" == t.savePngOutput && (n = e.canvas.toDataURL(), e.putImageData(cvSave, 0, 0), window.open(n, "_blank")), "CurrentWindow" == t.savePngOutput && (n = e.canvas.toDataURL(), e.putImageData(cvSave, 0, 0), window.location.href = n), "Save" == t.savePngOutput) {
            n = e.canvas.toDataURL();
            var o = document.createElement("a");
            o.href = n, o.download = t.savePngName + ".png", document.body.appendChild(o), o.click(), document.body.removeChild(o)
        }
    }

    function dynamicFunction(e, a, t) {
        if (isIE() < 9 && 0 != isIE()) return !0;
        if (a.dynamicDisplay) {
            if ("" == t.canvas.id) {
                var i = new Date,
                    l = i.getTime();
                t.canvas.id = "Canvas_" + l
            }
            if ("undefined" == typeof dynamicDisplay[t.canvas.id] ? (dynamicDisplayList[dynamicDisplayList.length] = t.canvas.id, dynamicDisplay[t.canvas.id] = [t, !1, !1, e, a, t.canvas], dynamicDisplay[t.canvas.id][1] = isScrolledIntoView(t.canvas), window.onscroll = scrollFunction) : 0 == dynamicDisplay[t.canvas.id][2] && (dynamicDisplay[t.canvas.id][1] = isScrolledIntoView(t.canvas)), 0 == dynamicDisplay[t.canvas.id][1] && 0 == dynamicDisplay[t.canvas.id][2]) return !1;
            dynamicDisplay[t.canvas.id][2] = !0
        }
        return !0
    }

    function isScrolledIntoView(e) {
        var a = 0,
            t = 0;
        for (elem = e; elem;) a += elem.offsetLeft - elem.scrollLeft + elem.clientLeft, t += elem.offsetTop - elem.scrollTop + elem.clientTop, elem = elem.offsetParent;
        return a + e.width / 2 >= window.pageXOffset && a + e.width / 2 <= window.pageXOffset + window.innerWidth && t + e.height / 2 >= window.pageYOffset && t + e.height / 2 <= window.pageYOffset + window.innerHeight ? !0 : !1
    }

    function scrollFunction() {
        for (var e = 0; e < dynamicDisplayList.length; e++) isScrolledIntoView(dynamicDisplay[dynamicDisplayList[e]][5]) && 0 == dynamicDisplay[dynamicDisplayList[e]][2] && (dynamicDisplay[dynamicDisplayList[e]][1] = !0, redrawGraph(dynamicDisplay[dynamicDisplayList[e]][0], dynamicDisplay[dynamicDisplayList[e]][3], dynamicDisplay[dynamicDisplayList[e]][4]))
    }

    function clearAnnotate(e) {
        jsGraphAnnotate[e] = [], jsTextMousePos[e] = []
    }

    function getMousePos(e, a) {
        var t = e.getBoundingClientRect();
        return {
            x: a.clientX - t.left,
            y: a.clientY - t.top
        }
    }

    function doMouseAction(config, ctx, event, data, action, funct) {
        var onData = !1,
            topY, bottomY, leftX, rightX, textMsr, myStatData, dispString, x, y;
        if ("annotate" == action) {
            var annotateDIV = document.getElementById("divCursor"),
                show = !1;
            annotateDIV.className = config.annotateClassName ? config.annotateClassName : "", annotateDIV.style.border = config.annotateClassName ? "" : config.annotateBorder, annotateDIV.style.padding = config.annotateClassName ? "" : config.annotatePadding, annotateDIV.style.borderRadius = config.annotateClassName ? "" : config.annotateBorderRadius, annotateDIV.style.backgroundColor = config.annotateClassName ? "" : config.annotateBackgroundColor, annotateDIV.style.color = config.annotateClassName ? "" : config.annotateFontColor, annotateDIV.style.fontFamily = config.annotateClassName ? "" : config.annotateFontFamily, annotateDIV.style.fontSize = config.annotateClassName ? "" : Math.ceil(ctx.chartTextScale * config.annotateFontSize).toString() + "pt", annotateDIV.style.fontStyle = config.annotateClassName ? "" : config.annotateFontStyle, annotateDIV.style.zIndex = 10002, ctx.save(), ctx.font = annotateDIV.style.fontStyle + " " + annotateDIV.style.fontSize + " " + annotateDIV.style.fontFamily;
            var rect = ctx.canvas.getBoundingClientRect()
        }
        "annotate" == action && (show = !1, annotateDIV.style.display = show ? "" : "none");
        for (var canvas_pos = getMousePos(ctx.canvas, event), i = 0; i < jsGraphAnnotate[ctx.ChartNewId].length && !show; i++) {
            if ("ARC" == jsGraphAnnotate[ctx.ChartNewId][i][0]) {
                if (myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]], distance = Math.sqrt((canvas_pos.x - myStatData.midPosX) * (canvas_pos.x - myStatData.midPosX) + (canvas_pos.y - myStatData.midPosY) * (canvas_pos.y - myStatData.midPosY)), distance > myStatData.int_radius && distance < myStatData.radiusOffset && (angle = (Math.acos((canvas_pos.x - myStatData.midPosX) / distance) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), canvas_pos.y < myStatData.midPosY && (angle = -angle), angle = ((angle + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), myStatData.startAngle = ((myStatData.startAngle + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), myStatData.endAngle = ((myStatData.endAngle + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), myStatData.endAngle < myStatData.startAngle && (myStatData.endAngle += 2 * Math.PI), (angle > myStatData.startAngle && angle < myStatData.endAngle || angle > myStatData.startAngle - 2 * Math.PI && angle < myStatData.endAngle - 2 * Math.PI || angle > myStatData.startAngle + 2 * Math.PI && angle < myStatData.endAngle + 2 * Math.PI) && (myStatData.graphPosX = canvas_pos.x, myStatData.graphPosY = canvas_pos.y, onData = !0, "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4] ? (dispString = tmplbis(setOptionValue(1, "ANNOTATELABEL", ctx, data, jsGraphAnnotate[ctx.ChartNewId][i][3], void 0, config.annotateLabel, jsGraphAnnotate[ctx.ChartNewId][i][1], -1, {
                        otherVal: !0
                    }), myStatData, config), textMsr = ctx.measureTextMultiLine(dispString, 1 * annotateDIV.style.fontSize.replace("pt", "")), ctx.restore(), annotateDIV.innerHTML = dispString, show = !0) : "function" == typeof funct && funct(event, ctx, config, data, myStatData), "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4])))
                    if (x = bw.ns4 || bw.ns5 ? event.pageX : event.x, y = bw.ns4 || bw.ns5 ? event.pageY : event.y, (bw.ie4 || bw.ie5) && (y += eval(scrolled)), config.annotateRelocate === !0) {
                        var colorInfo = data.filter(function(d) {return d.title == myStatData.v1});
                        annotateDIV.style.borderColor = colorInfo[0].color;
                        annotateDIV.innerHTML = annotateDIV.innerHTML.replace('{color}', colorInfo[0].color);
                        var relocateX, relocateY;
                        relocateX = 0, relocateY = 0, x + fromLeft + textMsr.textWidth > ctx.widthAtSetMeasures - rect.left - fromLeft && (relocateX = -textMsr.textWidth), y + fromTop + textMsr.textHeight > 1 * ctx.heightAtSetMeasures - 1 * rect.top + fromTop && (relocateY -= textMsr.textHeight + 2 * fromTop), oCursor.moveIt(Math.max(8 - rect.left, x + fromLeft + relocateX), Math.max(8 - rect.top, y + fromTop + relocateY))
                    } else oCursor.moveIt(x + fromLeft, y + fromTop)
            } else if ("RECT" == jsGraphAnnotate[ctx.ChartNewId][i][0]) {
                if (myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]], topY = Math.max(myStatData.yPosBottom, myStatData.yPosTop), bottomY = Math.min(myStatData.yPosBottom, myStatData.yPosTop), topY - bottomY < config.annotateBarMinimumDetectionHeight && (topY = (topY + bottomY + config.annotateBarMinimumDetectionHeight) / 2, bottomY = topY - config.annotateBarMinimumDetectionHeight), leftX = Math.min(myStatData.xPosLeft, myStatData.xPosRight), rightX = Math.max(myStatData.xPosLeft, myStatData.xPosRight), rightX - leftX < config.annotateBarMinimumDetectionHeight && (rightX = (rightX + leftX + config.annotateBarMinimumDetectionHeight) / 2, leftX = rightX - config.annotateBarMinimumDetectionHeight), canvas_pos.x > leftX && canvas_pos.x < rightX && canvas_pos.y < topY && canvas_pos.y > bottomY && (myStatData.graphPosX = canvas_pos.x, myStatData.graphPosY = canvas_pos.y, onData = !0, "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4] ? (dispString = tmplbis(setOptionValue(1, "ANNOTATELABEL", ctx, data, jsGraphAnnotate[ctx.ChartNewId][i][3], void 0, config.annotateLabel, jsGraphAnnotate[ctx.ChartNewId][i][1], jsGraphAnnotate[ctx.ChartNewId][i][2], {
                        otherVal: !0
                    }), myStatData, config), textMsr = ctx.measureTextMultiLine(dispString, 1 * annotateDIV.style.fontSize.replace("pt", "")), ctx.restore(), annotateDIV.innerHTML = dispString, show = !0) : "function" == typeof funct && funct(event, ctx, config, data, myStatData), "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4]))
                    if (x = bw.ns4 || bw.ns5 ? event.pageX : event.x, y = bw.ns4 || bw.ns5 ? event.pageY : event.y, (bw.ie4 || bw.ie5) && (y += eval(scrolled)), config.annotateRelocate === !0) {
                        var colorInfo = data.datasets.filter(function(d) {return d.title == myStatData.v1});
                        if(!colorInfo[0].tooltip) { show = 0; continue; }
                        annotateDIV.style.borderColor = colorInfo[0].strokeColor;
                        annotateDIV.innerHTML = annotateDIV.innerHTML.replace('{color}', colorInfo[0].strokeColor);
                        var relocateX, relocateY;
                        relocateX = 0, relocateY = 0, x - rect.left + fromLeft + textMsr.textWidth > ctx.widthAtSetMeasures- fromLeft && (relocateX = -textMsr.textWidth), y - rect.top + fromTop + textMsr.textHeight > 1 * ctx.heightAtSetMeasures + fromTop && (relocateY -= textMsr.textHeight + 2 * fromTop), oCursor.moveIt(Math.max(8 - rect.left, x + fromLeft + relocateX), Math.max(8 - rect.top, y + fromTop + relocateY))
                    } else oCursor.moveIt(x + fromLeft, y + fromTop)
            } else if ("POINT" == jsGraphAnnotate[ctx.ChartNewId][i][0]) {
                myStatData = jsGraphAnnotate[ctx.ChartNewId][i][3][jsGraphAnnotate[ctx.ChartNewId][i][1]][jsGraphAnnotate[ctx.ChartNewId][i][2]];
                var distance;
                if (config.detectAnnotateOnFullLine)
                    if (canvas_pos.x < Math.min(myStatData.annotateStartPosX, myStatData.annotateEndPosX) - Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) || canvas_pos.x > Math.max(myStatData.annotateStartPosX, myStatData.annotateEndPosX) + Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) || canvas_pos.y < Math.min(myStatData.annotateStartPosY, myStatData.annotateEndPosY) - Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) || canvas_pos.y > Math.max(myStatData.annotateStartPosY, myStatData.annotateEndPosY) + Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius)) distance = Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) + 1;
                    else if ("undefined" == typeof myStatData.D1A) distance = Math.abs(canvas_pos.x - myStatData.posX);
                    else if ("undefined" == typeof myStatData.D2A) distance = Math.abs(canvas_pos.y - myStatData.posY);
                    else {
                        var D2B = -myStatData.D2A * canvas_pos.x + canvas_pos.y,
                            g = -(myStatData.D1B - D2B) / (myStatData.D1A - myStatData.D2A),
                            h = myStatData.D2A * g + D2B;
                        distance = Math.sqrt((canvas_pos.x - g) * (canvas_pos.x - g) + (canvas_pos.y - h) * (canvas_pos.y - h))
                    } else distance = Math.sqrt((canvas_pos.x - myStatData.posX) * (canvas_pos.x - myStatData.posX) + (canvas_pos.y - myStatData.posY) * (canvas_pos.y - myStatData.posY));
                if (distance < Math.ceil(ctx.chartSpaceScale * config.pointHitDetectionRadius) && (myStatData.graphPosX = canvas_pos.x, myStatData.graphPosY = canvas_pos.y, onData = !0, "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4] ? (dispString = tmplbis(setOptionValue(1, "ANNOTATELABEL", ctx, data, jsGraphAnnotate[ctx.ChartNewId][i][3], void 0, config.annotateLabel, jsGraphAnnotate[ctx.ChartNewId][i][1], jsGraphAnnotate[ctx.ChartNewId][i][2], {
                        otherVal: !0
                    }), myStatData, config), textMsr = ctx.measureTextMultiLine(dispString, 1 * annotateDIV.style.fontSize.replace("pt", "")), ctx.restore(), annotateDIV.innerHTML = dispString, show = !0) : "function" == typeof funct && funct(event, ctx, config, data, myStatData), "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4]))
                    if (x = bw.ns4 || bw.ns5 ? event.pageX : event.x, y = bw.ns4 || bw.ns5 ? event.pageY : event.y, (bw.ie4 || bw.ie5) && (y += eval(scrolled)), config.annotateRelocate === !0) {
                        var colorInfo = data.datasets.filter(function(d) {return d.title == myStatData.v1});
                        if(!colorInfo[0].tooltip) { show = 0; continue; }
                        annotateDIV.style.borderColor = colorInfo[0].strokeColor;
                        annotateDIV.innerHTML = annotateDIV.innerHTML.replace('{color}', colorInfo[0].strokeColor);
                        var relocateX, relocateY;
                        relocateX = 0, relocateY = 0, x - rect.left + fromLeft + textMsr.textWidth > ctx.widthAtSetMeasures - fromLeft && (relocateX = -textMsr.textWidth), y - rect.top + fromTop + textMsr.textHeight > 1 * ctx.heightAtSetMeasures + fromTop && (relocateY -= textMsr.textHeight + 2 * fromTop), oCursor.moveIt(Math.max(8 - rect.left, x + fromLeft + relocateX), Math.max(8 - rect.top, y + fromTop + relocateY))
                    } else oCursor.moveIt(x + fromLeft, y + fromTop)
            }
            "annotate" == action && jsGraphAnnotate[ctx.ChartNewId][i][4] && (annotateDIV.style.display = show ? "" : "none", show && annotatePrevShow != i && (annotatePrevShow >= 0 && "function" == typeof config.annotateFunctionOut && ("ARC" == jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][0] ? config.annotateFunctionOut("OUTANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][3], jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][1], -1, null) : config.annotateFunctionOut("OUTANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][3], jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][1], jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][2], null)), annotatePrevShow = i, "function" == typeof config.annotateFunctionIn && ("ARC" == jsGraphAnnotate[ctx.ChartNewId][i][0] ? config.annotateFunctionIn("INANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][i][3], jsGraphAnnotate[ctx.ChartNewId][i][1], -1, {x:this.x,y:this.y,div:annotateDIV}) : config.annotateFunctionIn("INANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][i][3], jsGraphAnnotate[ctx.ChartNewId][i][1], jsGraphAnnotate[ctx.ChartNewId][i][2], {x: x, y: y, div:annotateDIV, aaaa:myStatData}))))
        }
        0 == show && "annotate" == action && annotatePrevShow >= 0 && ("function" == typeof config.annotateFunctionOut && ("ARC" == jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][0] ? config.annotateFunctionOut("OUTANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][3], jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][1], -1, null) : config.annotateFunctionOut("OUTANNOTATE", ctx, data, jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][3], jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][1], jsGraphAnnotate[ctx.ChartNewId][annotatePrevShow][2], null)), annotatePrevShow = -1);
        var inRect;
        if ("annotate" != action) {
            if (config.detectMouseOnText)
                for (var i = 0; i < jsTextMousePos[ctx.ChartNewId].length; i++) {
                    if (inRect = !0, Math.abs(jsTextMousePos[ctx.ChartNewId][i][3].p1 - jsTextMousePos[ctx.ChartNewId][i][3].p2) < config.zeroValue) canvas_pos.x < Math.min(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p2) && (inRect = !1), canvas_pos.x > Math.max(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p2) && (inRect = !1), canvas_pos.y < Math.min(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p3) && (inRect = !1), canvas_pos.y > Math.max(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p3) && (inRect = !1);
                    else if (Math.abs(jsTextMousePos[ctx.ChartNewId][i][2].p1 - jsTextMousePos[ctx.ChartNewId][i][2].p2) < config.zeroValue) canvas_pos.x < Math.min(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p3) && (inRect = !1), canvas_pos.x > Math.max(jsTextMousePos[ctx.ChartNewId][i][2].p1, jsTextMousePos[ctx.ChartNewId][i][2].p3) && (inRect = !1), canvas_pos.y < Math.min(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p2) && (inRect = !1), canvas_pos.y > Math.max(jsTextMousePos[ctx.ChartNewId][i][3].p1, jsTextMousePos[ctx.ChartNewId][i][3].p2) && (inRect = !1);
                    else {
                        var P12 = Math.tan(jsTextMousePos[ctx.ChartNewId][i][4]),
                            D12 = jsTextMousePos[ctx.ChartNewId][i][3].p1 - P12 * jsTextMousePos[ctx.ChartNewId][i][2].p1,
                            D34 = jsTextMousePos[ctx.ChartNewId][i][3].p3 - P12 * jsTextMousePos[ctx.ChartNewId][i][2].p3,
                            P13 = -1 / P12,
                            D13 = jsTextMousePos[ctx.ChartNewId][i][3].p1 - P13 * jsTextMousePos[ctx.ChartNewId][i][2].p1,
                            D24 = jsTextMousePos[ctx.ChartNewId][i][3].p4 - P13 * jsTextMousePos[ctx.ChartNewId][i][2].p4,
                            y1 = P12 * canvas_pos.x + D12,
                            y2 = P12 * canvas_pos.x + D34,
                            y3 = P13 * canvas_pos.x + D13,
                            y4 = P13 * canvas_pos.x + D24;
                        canvas_pos.y < Math.min(y1, y2) && (inRect = !1), canvas_pos.y > Math.max(y1, y2) && (inRect = !1), canvas_pos.y < Math.min(y3, y4) && (inRect = !1), canvas_pos.y > Math.max(y3, y4) && (inRect = !1)
                    }
                    inRect && (onData = !0, funct(event, ctx, config, data, {
                        type: "CLICKONTEXT",
                        values: jsTextMousePos[ctx.ChartNewId][i]
                    }))
                }
            0 == onData && funct(event, ctx, config, data, null)
        }
    }

    function animationCorrection(e, a, t, i, l, n) {
        var o = e,
            s = 0;
        if (-1 != l) {
            1 > o && i < t.animationStartWithDataset - 1 && t.animationStartWithDataset - 1 != -1 && (o = 1), 1 > o && l < t.animationStartWithData - 1 && t.animationStartWithData - 1 != -1 && (o = 1);
            var r = 1,
                c = e;
            if (1 > o && t.animationByDataset) {
                o = 0, r = 0;
                var h = t.animationStartWithDataset - 1;
                t.animationStartWithDataset - 1 == -1 && (h = 0);
                var d = t.animationSteps / (a.datasets.length - h);
                if (e >= (i - h + 1) * d / t.animationSteps) o = 1;
                else if (e >= (i - h) * d / t.animationSteps) {
                    var u = e - (i - h) * d / t.animationSteps;
                    t.animationLeftToRight ? c = u * (a.datasets.length - h) : o = u * (a.datasets.length - h), r = 1
                }
            }
            if (1 == r && 1 > o && t.animationLeftToRight) {
                o = 0;
                var p = t.animationStartWithData - 1;
                t.animationStartWithData - 1 == -1 && (p = 0);
                var S = t.animationSteps / (a.datasets[i].data.length - p - 1 + n);
                c >= (l - p) * S / t.animationSteps && (o = 1, c <= (l + 1 - p) * S / t.animationSteps && (s = (a.datasets[i].data.length - p - 1) * (c - (l - p) * S / t.animationSteps)))
            }
        } else 1 > o && i < t.animationStartWithData - 1 && (o = 1);
        return {
            mainVal: o,
            subVal: s,
            animVal: o + s
        }
    }

    function showLabels(e, a, t, i) {
        var xLabelWidth = e.measureTextMultiLine(a.labels[i]).textWidth;
        var l = setOptionValue(1, "SHOWLABEL", e, a, void 0, void 0, t.showXLabels, i, -1, void 0, {
            labelValue: fmtChartJS(t, a.labels[i], t.fmtXLabel),
            unformatedLabelValue: a.labels[i]
        });
        if(l === "smart" && typeof xLabelWidth !== 'undefined') {
            var test = xLabelWidth+60;
            var smartShow = Math.floor(a.labels.length / (e.widthAtSetMeasures / test ));
            l = smartShow < 1 ? 1 : smartShow + 1;
        };
        return "number" == typeof l && (l = i >= t.firstLabelToShow - 1 && (i + t.firstLabelToShow - 1) % parseInt(l) == 0 ? !0 : !1), l
    }

    function showYLabels(e, a, t, i, l) {
        var n = setOptionValue(1, "SHOWYLABEL", e, a, void 0, void 0, t.showYLabels, -1, i, void 0, {
            labelValue: l
        });
        return "number" == typeof n && (n = i >= t.firstYLabelToShow - 1 && (i + t.firstYLabelToShow - 1) % parseInt(n) == 0 ? !0 : !1), n
    }

    function drawLegend(e, a, t, i, l) {
        var n, nbcols, ypos, xpos, fromi, orderi, tpof;
        1 == t.legendBorders && (i.save(), i.setLineDash(lineStyleFn(t.legendBordersStyle)), i.beginPath(), i.lineWidth = Math.ceil(i.chartLineScale * t.legendBordersWidth), i.strokeStyle = t.legendBordersColors, i.moveTo(e.xLegendBorderPos, e.yLegendBorderPos), i.lineTo(e.xLegendBorderPos, e.yLegendBorderPos + e.legendBorderHeight), i.lineTo(e.xLegendBorderPos + e.legendBorderWidth, e.yLegendBorderPos + e.legendBorderHeight), i.lineTo(e.xLegendBorderPos + e.legendBorderWidth, e.yLegendBorderPos), i.lineTo(e.xLegendBorderPos, e.yLegendBorderPos), i.stroke(), i.closePath(), i.setLineDash([]), i.fillStyle = "rgba(0,0,0,0)", i.fillStyle = t.legendFillColor, i.fill(), i.restore()), nbcols = e.nbLegendCols - 1, ypos = e.yFirstLegendTextPos - (Math.ceil(i.chartTextScale * t.legendFontSize) + Math.ceil(i.chartSpaceScale * t.legendSpaceBetweenTextVertical)), xpos = 0, e.drawLegendOnData ? fromi = a.datasets.length : fromi = a.length;
        for (var o = fromi - 1; o >= 0; o--)
            if (orderi = typeof a.datasets == "undefined" ? a.length  - o - 1 : a.datasets.length - o - 1, e.drawLegendOnData ? tpof = typeof a.datasets[orderi].title : tpof = typeof a[orderi].title, "string" == tpof && (n = e.drawLegendOnData ? fmtChartJS(t, a.datasets[orderi].title, t.fmtLegend).trim() : fmtChartJS(t, a[orderi].title, t.fmtLegend).trim(), "" != n)) {
                nbcols++, nbcols == e.nbLegendCols ? (nbcols = 0, xpos = e.xFirstLegendTextPos, ypos += Math.ceil(i.chartTextScale * t.legendFontSize) + Math.ceil(i.chartSpaceScale * t.legendSpaceBetweenTextVertical)) : xpos += e.widestLegend + Math.ceil(i.chartSpaceScale * t.legendSpaceBetweenTextHorizontal), i.save(), i.beginPath();
                var s = e.legendBox;
                if (("Bar" == i.tpchart || "StackedBar" == i.tpchart) && ("Line" != a.datasets[orderi].type || a.datasets[orderi].datasetFill && 1 != setOptionValue(1, "LINKTYPE", i, a, void 0, a.datasets[orderi].linkType, t.linkType, orderi, -1, {
                        nullvalue: null
                    }) || (s = !1)), s) e.drawLegendOnData ? i.lineWidth = Math.ceil(i.chartLineScale * setOptionValue(1, "LINEWIDTH", i, a, void 0, a.datasets[orderi].datasetStrokeWidth, t.datasetStrokeWidth, orderi, -1, {
                        nullvalue: null
                    })) : i.lineWidth = Math.ceil(i.chartLineScale * t.datasetStrokeWidth), i.beginPath(), e.drawLegendOnData ? (i.strokeStyle = setOptionValue(1, "LEGENDSTROKECOLOR", i, a, void 0, a.datasets[orderi].strokeColor, t.defaultFillColor, orderi, -1, {
                    animationValue: 1,
                    xPosLeft: xpos,
                    yPosBottom: ypos,
                    xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                    yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                }), i.setLineDash(lineStyleFn(setOptionValue(1, "LEGENDLINEDASH", i, a, void 0, a.datasets[orderi].datasetStrokeStyle, t.datasetStrokeStyle, orderi, -1, {
                    animationValue: 1,
                    xPosLeft: xpos,
                    yPosBottom: ypos,
                    xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                    yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                })))) : (i.strokeStyle = setOptionValue(1, "LEGENDSTROKECOLOR", i, a, void 0, a[orderi].strokeColor, t.defaultFillColor, orderi, -1, {
                    animationValue: 1,
                    xPosLeft: xpos,
                    yPosBottom: ypos,
                    xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                    yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                }), i.setLineDash(lineStyleFn(setOptionValue(1, "LEGENDSEGMENTTROKESTYLE", i, a, void 0, a[orderi].segmentStrokeStyle, t.segmentStrokeStyle, orderi, -1, {
                    animationValue: 1,
                    xPosLeft: xpos,
                    yPosBottom: ypos,
                    xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                    yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                })))), i.moveTo(xpos, ypos), i.lineTo(xpos + Math.ceil(i.chartTextScale * t.legendBlockSize), ypos), i.lineTo(xpos + Math.ceil(i.chartTextScale * t.legendBlockSize), ypos - Math.ceil(i.chartTextScale * t.legendFontSize)), i.lineTo(xpos, ypos - Math.ceil(i.chartTextScale * t.legendFontSize)), i.lineTo(xpos, ypos), i.stroke(), i.closePath(), e.drawLegendOnData ? i.fillStyle = setOptionValue(1, "LEGENDFILLCOLOR", i, a, void 0, a.datasets[orderi].fillColor, t.defaultFillColor, orderi, -1, {
                    animationValue: 1,
                    xPosLeft: xpos,
                    yPosBottom: ypos,
                    xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                    yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                }) : i.fillStyle = setOptionValue(1, "LEGENDFILLCOLOR", i, a, void 0, a[orderi].color, t.defaultFillColor, orderi, -1, {
                    animationValue: 1,
                    xPosLeft: xpos,
                    yPosBottom: ypos,
                    xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                    yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                }), i.fill();
                else {
                    if (i.lineWidth = t.legendColorIndicatorStrokeWidth ? t.legendColorIndicatorStrokeWidth : Math.ceil(i.chartLineScale * setOptionValue(1, "LINEWIDTH", i, a, void 0, a.datasets[orderi].datasetStrokeWidth, t.datasetStrokeWidth, orderi, -1, {
                                nullvalue: null
                            })), t.legendColorIndicatorStrokeWidth && t.legendColorIndicatorStrokeWidth > Math.ceil(i.chartTextScale * t.legendFontSize) && (i.lineWidth = Math.ceil(i.chartTextScale * t.legendFontSize)), e.drawLegendOnData ? (i.strokeStyle = setOptionValue(1, "LEGENDSTROKECOLOR", i, a, void 0, a.datasets[orderi].strokeColor, t.defaultFillColor, orderi, -1, {
                            animationValue: 1,
                            xPosLeft: xpos,
                            yPosBottom: ypos,
                            xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                            yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                        }), i.setLineDash(lineStyleFn(setOptionValue(1, "LEGENDLINEDASH", i, a, void 0, a.datasets[orderi].datasetStrokeStyle, t.datasetStrokeStyle, orderi, -1, {
                            animationValue: 1,
                            xPosLeft: xpos,
                            yPosBottom: ypos,
                            xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                            yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                        })))) : (i.strokeStyle = setOptionValue(1, "LEGENDSTROKECOLOR", i, a, void 0, a[orderi].strokeColor, t.defaultFillColor, orderi, -1, {
                            animationValue: 1,
                            xPosLeft: xpos,
                            yPosBottom: ypos,
                            xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                            yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                        }), i.setLineDash(lineStyleFn(setOptionValue(1, "LEGENDSEGMENTTROKESTYLE", i, a, void 0, a[orderi].segmentStrokeStyle, t.segmentStrokeStyle, orderi, -1, {
                            animationValue: 1,
                            xPosLeft: xpos,
                            yPosBottom: ypos,
                            xPosRight: xpos + Math.ceil(i.chartTextScale * t.legendBlockSize),
                            yPosTop: ypos - Math.ceil(i.chartTextScale * t.legendFontSize)
                        })))), i.moveTo(xpos + 2, ypos - Math.ceil(i.chartTextScale * t.legendFontSize) / 2), i.lineTo(xpos + 2 + Math.ceil(i.chartTextScale * t.legendBlockSize), ypos - Math.ceil(i.chartTextScale * t.legendFontSize) / 2), i.stroke(), i.fill(), t.pointDot) {
                        i.beginPath(), i.fillStyle = setOptionValue(1, "LEGENDMARKERFILLCOLOR", i, a, void 0, a.datasets[orderi].pointColor, t.defaultStrokeColor, orderi, -1, {
                            nullvalue: !0
                        }), i.strokeStyle = setOptionValue(1, "LEGENDMARKERSTROKESTYLE", i, a, void 0, a.datasets[orderi].pointStrokeColor, t.defaultStrokeColor, orderi, -1, {
                            nullvalue: !0
                        }), i.lineWidth = setOptionValue(i.chartLineScale, "LEGENDMARKERLINEWIDTH", i, a, void 0, a.datasets[orderi].pointDotStrokeWidth, t.pointDotStrokeWidth, orderi, -1, {
                            nullvalue: !0
                        });
                        var r = setOptionValue(1, "LEGENDMARKERSHAPE", i, a, void 0, a.datasets[orderi].markerShape, t.markerShape, orderi, -1, {
                                nullvalue: !0
                            }),
                            c = setOptionValue(i.chartSpaceScale, "LEGENDMARKERRADIUS", i, a, void 0, a.datasets[orderi].pointDotRadius, t.pointDotRadius, orderi, -1, {
                                nullvalue: !0
                            }),
                            h = setOptionValue(1, "LEGENDMARKERSTROKESTYLE", i, a, void 0, a.datasets[orderi].pointDotStrokeStyle, t.pointDotStrokeStyle, orderi, -1, {
                                nullvalue: !0
                            });
                        drawMarker(i, xpos + 2 + Math.ceil(i.chartTextScale * t.legendBlockSize) / 2, ypos - Math.ceil(i.chartTextScale * t.legendFontSize) / 2, r, c, h);
                    }
                    i.fill()
                }
                i.restore(), i.save(), i.beginPath(), i.font = t.legendFontStyle + " " + Math.ceil(i.chartTextScale * t.legendFontSize).toString() + "px " + t.legendFontFamily, i.fillStyle = setOptionValue(1, "LEGENDFONTCOLOR", i, a, void 0, void 0, t.legendFontColor, orderi, -1, {
                    nullvalue: !0
                }), i.textAlign = "left", i.textBaseline = "bottom", i.translate(xpos + Math.ceil(i.chartTextScale * t.legendBlockSize) + Math.ceil(i.chartSpaceScale * t.legendSpaceBetweenBoxAndText), ypos), i.fillTextMultiLine(n, 0, 0, i.textBaseline, Math.ceil(i.chartTextScale * t.legendFontSize), !0, t.detectMouseOnText, i, "LEGEND_TEXTMOUSE", 0, xpos + Math.ceil(i.chartTextScale * t.legendBlockSize) + Math.ceil(i.chartSpaceScale * t.legendSpaceBetweenBoxAndText), ypos, orderi, -1, typeof a.datasets == "undefined" ? a[orderi] : a.datasets[orderi]), i.restore()
            }
    }

    function drawMarker(e, a, t, i, l, n) {
        switch (e.setLineDash(lineStyleFn(n)), i) {
            case "square":
                e.rect(a - l, t - l, 2 * l, 2 * l), e.stroke(), e.fill(), e.setLineDash([]);
                break;
            case "triangle":
                pointA_x = 0, pointA_y = 2 / 3 * l, e.moveTo(a, t - pointA_y), e.lineTo(a + pointA_y * Math.sin(4 / 3), t + pointA_y * Math.cos(4 / 3)), e.lineTo(a - pointA_y * Math.sin(4 / 3), t + pointA_y * Math.cos(4 / 3)), e.lineTo(a, t - pointA_y), e.stroke(), e.fill(), e.setLineDash([]);
                break;
            case "diamond":
                e.moveTo(a, t + l), e.lineTo(a + l, t), e.lineTo(a, t - l), e.lineTo(a - l, t), e.lineTo(a, t + l), e.stroke(), e.fill(), e.setLineDash([]);
                break;
            case "plus":
                e.moveTo(a, t - l), e.lineTo(a, t + l), e.moveTo(a - l, t), e.lineTo(a + l, t), e.stroke(), e.setLineDash([]);
                break;
            case "cross":
                e.moveTo(a - l, t - l), e.lineTo(a + l, t + l), e.moveTo(a - l, t + l), e.lineTo(a + l, t - l), e.stroke(), e.setLineDash([]);
                break;
            case "circle":
            default:
                e.arc(a, t, l, 0, 2 * Math.PI * 1, !0), e.stroke(), e.fill(), e.setLineDash([])
        }
    }

    function initPassVariableData_part1(e, a, t) {
        var i, l, n, o, s, r, c, h, d, u, p, S, g, f, x, A, m ,tt, k;
        switch (t.tpdata) {
            case 1:
                n = [];
                var M, P, T, v = ((a.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
                v <= a.zeroValue && (v = 2 * Math.PI), P = ((-a.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), T = ((a.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), startAngle = P, c = 0, notemptyval = 0;
                var L = -1,
                    D = -1,
                    y = -1;
                for (o = -Number.MAX_VALUE, s = Number.MAX_VALUE, i = 0; i < e.length; i++) "PolarArea" != t.tpchart && 1 * e[i].value < 0 || "undefined" != typeof e[i].value && (-1 == L && (L = i), o = Math.max(o, 1 * e[i].value), s = Math.min(s, 1 * e[i].value), notemptyval++, c += 1 * e[i].value, D = i);
                r = 0;
                var V = -1;
                for (i = 0; i < e.length; i++) u = "string" == typeof e[i].title ? e[i].title.trim() : "", "undefined" != typeof e[i].value && ("PolarArea" == t.tpchart || 1 * e[i].value >= 0) ? (M = "PolarArea" == t.tpchart ? notemptyval > 0 ? v / notemptyval : 0 : 1 * e[i].value / c * v, M >= 2 * Math.PI && (M = 2 * Math.PI - .001), r += 1 * e[i].value, n[i] = {
                    config: a,
                    v1: fmtChartJS(a, u, a.fmtV1),
                    v2: fmtChartJS(a, 1 * e[i].value, a.fmtV2),
                    v3: fmtChartJS(a, r, a.fmtV3),
                    v4: fmtChartJS(a, c, a.fmtV4),
                    v5: fmtChartJS(a, M, a.fmtV5),
                    v6: roundToWithThousands(a, fmtChartJS(a, 100 * e[i].value / c, a.fmtV6), a.roundPct),
                    v7: 0,
                    v8: 0,
                    v9: 0,
                    v10: 0,
                    v11: fmtChartJS(a, P - M, a.fmtV11),
                    v12: fmtChartJS(a, P, a.fmtV12),
                    v13: fmtChartJS(a, i, a.fmtV13),
                    unit: e[i].unit,
                    lgtxt: u,
                    datavalue: 1 * e[i].value,
                    cumvalue: r,
                    totvalue: c,
                    segmentAngle: M,
                    firstAngle: startAngle,
                    pctvalue: 100 * e[i].value / c,
                    startAngle: P,
                    realStartAngle: T,
                    endAngle: P + M,
                    maxvalue: a.yMaximum == "smart" ? o : a.yMaximum,
                    minvalue: a.yMinimum == "smart" ? s : a.yMinimum,
                    i: i,
                    firstNotMissing: L,
                    lastNotMissing: D,
                    prevNotMissing: y,
                    prevMissing: V,
                    nextNotMissing: -1,
                    radiusOffset: 0,
                    midPosX: 0,
                    midPosY: 0,
                    int_radius: 0,
                    ext_radius: 0,
                    data: e
                }, P += M, T -= M, -1 != y && (n[y].nextNotMissing = i), y = i) : (n[i] = {
                    v1: u,
                    maxvalue: a.yMaximum == "smart" ? o : a.yMaximum,
                    minvalue: a.yMinimum == "smart" ? s : a.yMinimum,
                    i: i,
                    firstNotMissing: L,
                    lastNotMissing: D,
                    prevNotMissing: y
                }, V = i);
                break;
            case 0:
            default:
                var b;
                for (n = [], o = [], o[0] = [], o[1] = [], s = [], s[0] = [], s[1] = [], r = [], r[0] = [], r[1] = [], c = [], c[0] = [], c[1] = [], h = [], h[0] = [], h[1] = [], d = [], d[0] = [], d[1] = [], S = [], g = [], f = [], x = [], A = [], S[0] = [], S[1] = [], m = 0, i = 0; i < e.datasets.length; i++) {
                    if ("undefined" != typeof e.datasets[i].xPos && "Line" == tpdraw(t, e.datasets[i]))
                        for (l = e.datasets[i].data.length; l < e.datasets[i].xPos.length; l++) e.datasets[i].data.push(void 0);
                    else
                        for (l = e.datasets[i].data.length; l < e.labels.length; l++) e.datasets[i].data.push(void 0);
                    for (b = 2 == e.datasets[i].axis ? 0 : 1, n[i] = [], h[0][i] = -Number.MAX_VALUE, h[1][i] = -Number.MAX_VALUE, d[0][i] = Number.MAX_VALUE, d[1][i] = Number.MAX_VALUE, g[i] = -1, f[i] = -1, l = 0; l < e.datasets[i].data.length; l++) "undefined" == typeof x[l] && (x[l] = -1, A[l] = -1, c[0][l] = 0, o[0][l] = -Number.MAX_VALUE, s[0][l] = Number.MAX_VALUE, c[1][l] = 0, o[1][l] = -Number.MAX_VALUE, s[1][l] = Number.MAX_VALUE), "undefined" != typeof e.datasets[i].data[l] && (m += 1 * e.datasets[i].data[l], -1 == g[i] && (g[i] = l), f[i] = l, -1 == x[l] && (x[l] = i), A[l] = i, c[b][l] += 1 * e.datasets[i].data[l], o[b][l] = Math.max(o[b][l], 1 * e.datasets[i].data[l]), s[b][l] = Math.min(s[b][l], 1 * e.datasets[i].data[l]), h[b][i] = Math.max(h[b][i], 1 * e.datasets[i].data[l]), d[b][i] = Math.min(d[b][i], 1 * e.datasets[i].data[l]))
                }
                for (i = 0; i < e.datasets.length; i++) {
                    b = 2 == e.datasets[i].axis ? 0 : 1, u = "string" == typeof e.datasets[i].title ? e.datasets[i].title.trim() : ""; var id = "string" == typeof e.datasets[i].id ? e.datasets[i].id.trim() : "";
                    var I = -1,
                        O = -1;
                    for (l = 0; l < e.datasets[i].data.length; l++)
                        if ("undefined" == typeof r[0][l] && (r[0][l] = 0, S[0][l] = -1, r[1][l] = 0, S[1][l] = -1), p = "", "undefined" != typeof e.datasets[i].xPos && "undefined" != typeof e.datasets[i].xPos[l] && (p = e.datasets[i].xPos[l]), "" == p && "undefined" != typeof e.labels[l] && (p = e.labels[l]), "string" == typeof p && (p = p.trim(), tt = e.times[l]), "undefined" != typeof e.datasets[i].data[l]) {
                            switch (r[b][l] += 1 * e.datasets[i].data[l], tpdraw(t, e.datasets[i])) {
                                case "Bar":
                                case "StackedBar":
                                case "HorizontalBar":
                                case "HorizontalStackedBar":
                                    n[i][l] = {
                                        id: id,
                                        time : tt,
                                        config: a,
                                        v1: fmtChartJS(a, u, a.fmtV1),
                                        v2: fmtChartJS(a, p, a.fmtV2),
                                        v3: fmtChartJS(a, 1 * e.datasets[i].data[l], a.fmtV3),
                                        v4: fmtChartJS(a, r[b][l], a.fmtV4),
                                        v5: fmtChartJS(a, c[b][l], a.fmtV5),
                                        v6: roundToWithThousands(a, fmtChartJS(a, 100 * e.datasets[i].data[l] / c[b][l], a.fmtV6), a.roundPct),
                                        v6T: roundToWithThousands(a, fmtChartJS(a, 100 * e.datasets[i].data[l] / m, a.fmtV6T), a.roundPct),
                                        v11: fmtChartJS(a, i, a.fmtV11),
                                        v12: fmtChartJS(a, l, a.fmtV12),
                                        unit: e.datasets[i].unit,
                                        lgtxt: u,
                                        lgtxt2: p,
                                        datavalue: 1 * e.datasets[i].data[l],
                                        cumvalue: r[b][l],
                                        totvalue: c[b][l],
                                        pctvalue: 100 * e.datasets[i].data[l] / c[b][l],
                                        pctvalueT: 100 * e.datasets[i].data[l] / m,
                                        maxvalue: a.yMaximum == "smart" ? o[b][l] : a.yMaximum,
                                        minvalue: a.yMinimum == "smart" ? s[b][l] : a.yMinimum,
                                        lmaxvalue: h[b][i],
                                        lminvalue: d[b][i],
                                        grandtotal: m,
                                        firstNotMissing: x[l],
                                        lastNotMissing: A[l],
                                        prevNotMissing: I,
                                        prevMissing: O,
                                        nextNotMissing: -1,
                                        j: l,
                                        i: i,
                                        data: e
                                    }, 1 * e.datasets[i].data[l] != 0 || "HorizontalStackedBar" != tpdraw(t, e.datasets[i]) && "StackedBar" != tpdraw(t, e.datasets[i]) || (n[i][l].v3 = "");
                                    break;
                                case "Line":
                                case "Radar":
                                    n[i][l] = {
                                        id: id,
                                        time : tt,
                                        config: a,
                                        v1: fmtChartJS(a, u, a.fmtV1),
                                        v2: fmtChartJS(a, p, a.fmtV2),
                                        v3: fmtChartJS(a, 1 * e.datasets[i].data[l], a.fmtV3),
                                        v5: fmtChartJS(a, 1 * e.datasets[i].data[l], a.fmtV5),
                                        v6: fmtChartJS(a, o[b][l], a.fmtV6),
                                        v7: fmtChartJS(a, c[b][l], a.fmtV7),
                                        v8: roundToWithThousands(a, fmtChartJS(a, 100 * e.datasets[i].data[l] / c[b][l], a.fmtV8), a.roundPct),
                                        v8T: roundToWithThousands(a, fmtChartJS(a, 100 * e.datasets[i].data[l] / m, a.fmtV8T), a.roundPct),
                                        v11: fmtChartJS(a, i, a.fmtV11),
                                        v12: fmtChartJS(a, l, a.fmtV12),
                                        unit: e.datasets[i].unit,
                                        lgtxt: u,
                                        lgtxt2: p,
                                        datavalue: 1 * e.datasets[i].data[l],
                                        diffnext: 1 * e.datasets[i].data[l],
                                        pctvalue: 100 * e.datasets[i].data[l] / c[b][l],
                                        pctvalueT: 100 * e.datasets[i].data[l] / m,
                                        totvalue: c[b][l],
                                        cumvalue: r[b][l],
                                        maxvalue: a.yMaximum == "smart" ? o[b][l] : a.yMaximum,
                                        minvalue: a.yMinimum == "smart" ? s[b][l] : a.yMinimum,
                                        lmaxvalue: h[b][i],
                                        lminvalue: d[b][i],
                                        grandtotal: m,
                                        firstNotMissing: g[i],
                                        lastNotMissing: f[i],
                                        prevNotMissing: I,
                                        prevMissing: O,
                                        nextNotMissing: -1,
                                        j: l,
                                        i: i,
                                        data: e
                                    }, S[b][l] >= 0 ? (n[i][l].v4 = fmtChartJS(a, -1 != S[b][l] ? 1 * e.datasets[i].data[l] - n[S[b][l]][l].datavalue : 1 * e.datasets[i].data[l], a.fmtV4), n[i][l].diffprev = -1 != S[b][l] ? 1 * e.datasets[i].data[l] - n[S[b][l]][l].datavalue : 1 * e.datasets[i].data[l], n[S[b][l]][l].diffnext = e.datasets[S[b][l]].data[l] - e.datasets[i].data[l], n[S[b][l]][l].v5 = n[S[b][l]][l].diffnext) : n[i][l].v4 = 1 * e.datasets[i].data[l], S[b][l] = i
                            }
                            if ("undefined" != typeof e.datasets[i].data[l]) {
                                if (-1 != I)
                                    for (k = I; k < l; k++) n[i][k].nextNotMissing = l;
                                I = l
                            }
                        } else switch (O = l, tpdraw(t, e.datasets[i])) {
                            case "Bar":
                            case "StackedBar":
                            case "HorizontalBar":
                            case "HorizontalStackedBar":
                                n[i][l] = {
                                    id: id,
                                    time : tt,
                                    v1: u,
                                    v2: p,
                                    lmaxvalue: h[b][i],
                                    lminvalue: d[b][i],
                                    firstNotMissing: x[l],
                                    lastNotMissing: A[l],
                                    prevNotMissing: I,
                                    prevMissing: O,
                                    grandtotal: m
                                };
                                break;
                            case "Line":
                            case "Radar":
                                n[i][l] = {
                                    id: id,
                                    time : tt,
                                    v1: u,
                                    v2: p,
                                    lmaxvalue: h[b][i],
                                    lminvalue: d[b][i],
                                    firstNotMissing: g[i],
                                    lastNotMissing: f[i],
                                    prevNotMissing: I,
                                    prevMissing: O,
                                    grandtotal: m
                                }
                        }
                }
        }
        return n
    }

    function initPassVariableData_part2(e, a, t, i, l) {
        function n(e, a, i, l, o, s) {
            if ("object" == typeof i.datasets[e].xPos && "undefined" != typeof i.datasets[e].xPos[Math.floor(a + t.zeroValue)]) {
                var r = o * s,
                    c = "undefined" != typeof i.xBegin ? i.xBegin : 1 * i.labels[0],
                    h = "undefined" != typeof i.xEnd ? i.xEnd : 1 * i.labels[i.labels.length - 1];
                if (c >= h && (h = c + 100), 1 * i.datasets[e].xPos[Math.floor(a + t.zeroValue)] >= c && i.datasets[e].xPos[Math.floor(a + t.zeroValue)] <= h) {
                    var d = l + r * ((1 * i.datasets[e].xPos[Math.floor(a + t.zeroValue)] - c) / (h - c)),
                        u = d;
                    return Math.abs(a - Math.floor(a + t.zeroValue)) > t.zeroValue && (u = n(e, Math.ceil(a - t.zeroValue), i)), d + (a - Math.floor(a + t.zeroValue)) * (u - d)
                }
            }
            return l + o * a
        }

        function o(e, a, t, i) {
            if (e) return r(c(a) * i - c(t.graphMin) * i, void 0, 0);
            var l = t.steps * t.stepValue,
                n = a - t.graphMin,
                o = r(n / l, 1, 0);
            return i * t.steps * o
        }

        function s(e, a, t) {
            var i = a.steps * a.stepValue,
                l = e - a.graphMin,
                n = r(l / i, 1, 0);
            return t * a.steps * n
        }

        function r(e, a, t) {
            return isNumber(a) && e > a ? a : isNumber(t) && t > e ? t : e
        }

        function c(e) {
            return Math.log(e) / Math.LN10
        }
        var h, d, u = 0;
        switch (i.tpdata) {
            case 1:
                for (h = 0; h < a.length; h++) e[h].v7 = fmtChartJS(t, l.midPosX, t.fmtV7), e[h].v8 = fmtChartJS(t, l.midPosY, t.fmtV8), e[h].v9 = fmtChartJS(t, l.int_radius, t.fmtV9), e[h].v10 = fmtChartJS(t, l.ext_radius, t.fmtV10), "PolarArea" == i.tpchart ? (e[h].radiusOffset = o(t.logarithmic, 1 * a[h].value, l.calculatedScale, l.scaleHop), e[h].v10 = fmtChartJS(t, e[h].radiusOffset, t.fmtV10)) : (e[h].v10 = fmtChartJS(t, l.ext_radius, t.fmtV10), e[h].radiusOffset = l.ext_radius), e[h].outerVal = l.outerVal, e[h].midPosX = l.midPosX, e[h].midPosY = l.midPosY, e[h].calculatedScale = l.calculatedScale, e[h].scaleHop = l.scaleHop, e[h].int_radius = l.int_radius, e[h].ext_radius = l.ext_radius;
                break;
            case 0:
            default:
                var p = new Array(a.datasets.length),
                    S = new Array(a.datasets.length);
                for (h = 0; h < a.datasets.length; h++) switch (tpdraw(i, a.datasets[h])) {
                    case "Line":
                        for (d = 0; d < a.datasets[h].data.length; d++) e[h][d].xAxisPosY = l.xAxisPosY, e[h][d].yAxisPosX = l.yAxisPosX, e[h][d].valueHop = l.valueHop, e[h][d].nbValueHop = l.nbValueHop, 2 == a.datasets[h].axis ? (e[h][d].scaleHop = l.scaleHop2, e[h][d].zeroY = l.zeroY2, e[h][d].calculatedScale = l.calculatedScale2, e[h][d].logarithmic = l.logarithmic2) : (e[h][d].scaleHop = l.scaleHop, e[h][d].zeroY = l.zeroY, e[h][d].calculatedScale = l.calculatedScale, e[h][d].logarithmic = l.logarithmic), e[h][d].xPos = n(h, d, a, l.yAxisPosX, l.valueHop, l.nbValueHop), e[h][d].yAxisPos = l.xAxisPosY - e[h][d].zeroY, ("Bar" == i.tpchart || "StackedBar" == i.tpchart) && (e[h][d].xPos += l.valueHop / 2, e[h][d].yAxisPosX += l.valueHop / 2), 0 == d ? (e[h][d].lmaxvalue_offset = o(e[h][d].logarithmic, e[h][d].lmaxvalue, e[h][d].calculatedScale, e[h][d].scaleHop) - e[h][d].zeroY, e[h][d].lminvalue_offset = o(e[h][d].logarithmic, e[h][d].lminvalue, e[h][d].calculatedScale, e[h][d].scaleHop) - e[h][d].zeroY) : (e[h][d].lmaxvalue_offset = e[h][0].lmaxvalue_offset, e[h][d].lminvalue_offset = e[h][0].lminvalue_offset), "undefined" != typeof a.datasets[h].data[d] && (e[h][d].yPosOffset = o(e[h][d].logarithmic, a.datasets[h].data[d], e[h][d].calculatedScale, e[h][d].scaleHop) - e[h][d].zeroY, e[h][d].posY = e[h][d].yAxisPos - e[h][d].yPosOffset), "object" == typeof a.datasets[h].origin && "undefined" != typeof a.datasets[h].origin[d] && (e[h][d].yPosOffsetOrigin = o(e[h][d].logarithmic, a.datasets[h].origin[d], e[h][d].calculatedScale, e[h][d].scaleHop) - e[h][d].zeroY, e[h][d].posYOrigin = e[h][d].yAxisPos - e[h][d].yPosOffsetOrigin), e[h][d].posX = e[h][d].xPos, e[h][d].v9 = e[h][d].xPos, e[h][d].v10 = e[h][d].posY, e[h][d].annotateStartPosX = e[h][d].xPos, e[h][d].annotateEndPosX = e[h][d].xPos, e[h][d].annotateStartPosY = l.xAxisPosY, e[h][d].annotateEndPosY = l.xAxisPosY - l.msr.availableHeight, e[h][d].D1A = void 0, e[h][d].D1B = void 0;
                        break;
                    case "Radar":
                        var g = 2 * Math.PI / a.datasets[0].data.length;
                        for (d = 0; d < a.datasets[h].data.length; d++) e[h][d].midPosX = l.midPosX, e[h][d].midPosY = l.midPosY, e[h][d].int_radius = 0, e[h][d].ext_radius = l.maxSize, e[h][d].radiusOffset = l.maxSize, e[h][d].calculatedScale = l.calculatedScale, e[h][d].scaleHop = l.scaleHop, e[h][d].calculated_offset = o(t.logarithmic, a.datasets[h].data[d], l.calculatedScale, l.scaleHop), e[h][d].offsetX = Math.cos(t.startAngle * Math.PI / 180 - d * g) * e[h][d].calculated_offset, e[h][d].offsetY = Math.sin(t.startAngle * Math.PI / 180 - d * g) * e[h][d].calculated_offset, e[h][d].v9 = e[h][d].midPosX + e[h][d].offsetX, e[h][d].v10 = e[h][d].midPosY - e[h][d].offsetY, e[h][d].posX = e[h][d].midPosX + e[h][d].offsetX, e[h][d].posY = e[h][d].midPosY - e[h][d].offsetY, 0 == d ? e[h][d].calculated_offset_max = o(t.logarithmic, e[h][d].lmaxvalue, l.calculatedScale, l.scaleHop) : e[h][d].calculated_offset_max = e[0][d].calculated_offset_max, e[h][d].annotateStartPosX = l.midPosX, e[h][d].annotateEndPosX = l.midPosX + Math.cos(t.startAngle * Math.PI / 180 - d * g) * l.maxSize, e[h][d].annotateStartPosY = l.midPosY, e[h][d].annotateEndPosY = l.midPosY - Math.sin(t.startAngle * Math.PI / 180 - d * g) * l.maxSize, Math.abs(e[h][d].annotateStartPosX - e[h][d].annotateEndPosX) < t.zeroValue ? (e[h][d].D1A = void 0, e[h][d].D1B = void 0, e[h][d].D2A = 0) : (e[h][d].D1A = (e[h][d].annotateStartPosY - e[h][d].annotateEndPosY) / (e[h][d].annotateStartPosX - e[h][d].annotateEndPosX), e[h][d].D1B = -e[h][d].D1A * e[h][d].annotateStartPosX + e[h][d].annotateStartPosY, Math.abs(e[h][d].D1A) >= t.zeroValue ? e[h][d].D2A = -(1 / e[h][d].D1A) : e[h][d].D2A = void 0);
                        break;
                    case "Bar":
                        for (d = 0; d < a.datasets[h].data.length; d++) e[h][d].posX = (n(h, d, a, l.yAxisPosX, l.valueHop, l.nbValueHop) + (l.valueHop/2)), e[h][d].xAxisPosY = l.xAxisPosY, e[h][d].yAxisPosX = l.yAxisPosX, e[h][d].valueHop = l.valueHop, e[h][d].barWidth = l.barWidth, e[h][d].additionalSpaceBetweenBars = l.additionalSpaceBetweenBars, e[h][d].nbValueHop = l.nbValueHop, e[h][d].calculatedScale = l.calculatedScale, e[h][d].scaleHop = l.scaleHop, e[h][d].xPosLeft = l.yAxisPosX + Math.ceil(i.chartSpaceScale * t.barValueSpacing) + l.valueHop * d + l.additionalSpaceBetweenBars + l.barWidth * u + Math.ceil(i.chartSpaceScale * t.barDatasetSpacing) * u + Math.ceil(i.chartLineScale * t.barStrokeWidth) * u, e[h][d].xPosRight = e[h][d].xPosLeft + l.barWidth, e[h][d].yPosBottom = l.xAxisPosY - l.zeroY, e[h][d].barHeight = o(t.logarithmic, 1 * a.datasets[h].data[d], l.calculatedScale, l.scaleHop) - l.zeroY, 2 == a.datasets[h].axis ? (e[h][d].yPosBottom = l.xAxisPosY - l.zeroY2, e[h][d].barHeight = o(t.logarithmic2, 1 * a.datasets[h].data[d], l.calculatedScale2, l.scaleHop2) - l.zeroY2) : (e[h][d].yPosBottom = l.xAxisPosY - l.zeroY, e[h][d].barHeight = o(t.logarithmic, 1 * a.datasets[h].data[d], l.calculatedScale, l.scaleHop) - l.zeroY), e[h][d].yPosTop = e[h][d].yPosBottom - e[h][d].barHeight + Math.ceil(i.chartLineScale * t.barStrokeWidth) / 2, e[h][d].v7 = e[h][d].xPosLeft, e[h][d].v8 = e[h][d].yPosBottom, e[h][d].v9 = e[h][d].xPosRight, e[h][d].v10 = e[h][d].yPosTop;
                        u++;
                        break;
                    case "StackedBar":
                        for (d = 0; d < a.datasets[h].data.length; d++) e[h][d].posX = (n(h, d, a, l.yAxisPosX, l.valueHop, l.nbValueHop) + (l.valueHop/2)), e[h][d].xAxisPosY = l.xAxisPosY, e[h][d].yAxisPosX = l.yAxisPosX, e[h][d].valueHop = l.valueHop, e[h][d].barWidth = l.barWidth, e[h][d].additionalSpaceBetweenBars = l.additionalSpaceBetweenBars, e[h][d].nbValueHop = l.nbValueHop, e[h][d].calculatedScale = l.calculatedScale, e[h][d].scaleHop = l.scaleHop, "undefined" == typeof p[d] && (p[d] = 0, S[d] = 0, zeroY = o(t.logarithmic, 0, l.calculatedScale, l.scaleHop)), "undefined" != typeof a.datasets[h].data[d] && (e[h][d].xPosLeft = l.yAxisPosX + Math.ceil(i.chartSpaceScale * t.barValueSpacing) + l.valueHop * d + l.additionalSpaceBetweenBars, 1 * a.datasets[h].data[d] < 0 ? (e[h][d].botval = S[d], e[h][d].topval = S[d] + 1 * a.datasets[h].data[d], S[d] = S[d] + 1 * a.datasets[h].data[d]) : (e[h][d].botval = p[d], e[h][d].topval = p[d] + 1 * a.datasets[h].data[d], p[d] = p[d] + 1 * a.datasets[h].data[d]), e[h][d].xPosRight = e[h][d].xPosLeft + l.barWidth, e[h][d].botOffset = o(t.logarithmic, e[h][d].botval, l.calculatedScale, l.scaleHop), e[h][d].topOffset = o(t.logarithmic, e[h][d].topval, l.calculatedScale, l.scaleHop), e[h][d].yPosBottom = l.xAxisPosY - e[h][d].botOffset, e[h][d].yPosTop = l.xAxisPosY - e[h][d].topOffset, Math.ceil(i.chartSpaceScale * t.spaceBetweenBar) > 0 && (1 * a.datasets[h].data[d] < 0 ? (e[h][d].yPosBottom += Math.ceil(i.chartSpaceScale * t.spaceBetweenBar), S[d] == 1 * a.datasets[h].data[d] && (e[h][d].yPosBottom -= Math.ceil(i.chartSpaceScale * t.spaceBetweenBar) / 2), e[h][d].yPosTop < e[h][d].yPosBottom && (e[h][d].yPosBottom = e[h][d].yPosTop)) : 1 * a.datasets[h].data[d] > 0 && (e[h][d].yPosBottom -= Math.ceil(i.chartSpaceScale * t.spaceBetweenBar), p[d] == 1 * a.datasets[h].data[d] && (e[h][d].yPosBottom += Math.ceil(i.chartSpaceScale * t.spaceBetweenBar) / 2), e[h][d].yPosTop > e[h][d].yPosBottom && (e[h][d].yPosBottom = e[h][d].yPosTop))), e[h][d].v7 = e[h][d].xPosLeft, e[h][d].v8 = e[h][d].yPosBottom, e[h][d].v9 = e[h][d].xPosRight, e[h][d].v10 = e[h][d].yPosTop);
                        break;
                    case "HorizontalBar":
                        for (d = 0; d < a.datasets[h].data.length; d++) e[h][d].xAxisPosY = l.xAxisPosY, e[h][d].yAxisPosX = l.yAxisPosX, e[h][d].valueHop = l.valueHop, e[h][d].barWidth = l.barWidth, e[h][d].additionalSpaceBetweenBars = l.additionalSpaceBetweenBars, e[h][d].nbValueHop = l.nbValueHop, e[h][d].calculatedScale = l.calculatedScale, e[h][d].scaleHop = l.scaleHop, e[h][d].xPosLeft = l.yAxisPosX + l.zeroY, e[h][d].yPosTop = l.xAxisPosY + Math.ceil(i.chartSpaceScale * t.barValueSpacing) - l.scaleHop * (d + 1) + l.additionalSpaceBetweenBars + l.barWidth * h + Math.ceil(i.chartSpaceScale * t.barDatasetSpacing) * h + Math.ceil(i.chartLineScale * t.barStrokeWidth) * h, e[h][d].yPosBottom = e[h][d].yPosTop + l.barWidth, e[h][d].barWidth = o(t.logarithmic, 1 * a.datasets[h].data[d], l.calculatedScale, l.valueHop) - l.zeroY, e[h][d].xPosRight = e[h][d].xPosLeft + e[h][d].barWidth, e[h][d].v7 = e[h][d].xPosLeft, e[h][d].v8 = e[h][d].yPosBottom, e[h][d].v9 = e[h][d].xPosRight, e[h][d].v10 = e[h][d].yPosTop;
                        break;
                    case "HorizontalStackedBar":
                        for (d = 0; d < a.datasets[h].data.length; d++) e[h][d].xAxisPosY = l.xAxisPosY, e[h][d].yAxisPosX = l.yAxisPosX, e[h][d].valueHop = l.valueHop, e[h][d].barWidth = l.barWidth, e[h][d].additionalSpaceBetweenBars = l.additionalSpaceBetweenBars, e[h][d].nbValueHop = l.nbValueHop, e[h][d].calculatedScale = l.calculatedScale, e[h][d].scaleHop = l.scaleHop, 0 == h && (p[d] = 0, S[d] = 0), "undefined" != typeof a.datasets[h].data[d] && (e[h][d].xPosLeft = l.yAxisPosX + Math.ceil(i.chartSpaceScale * t.barValueSpacing) + l.valueHop * d, 1 * a.datasets[h].data[d] < 0 ? (e[h][d].leftval = S[d], e[h][d].rightval = S[d] + 1 * a.datasets[h].data[d], S[d] = S[d] + 1 * a.datasets[h].data[d]) : (e[h][d].leftval = p[d], e[h][d].rightval = p[d] + 1 * a.datasets[h].data[d], p[d] = p[d] + 1 * a.datasets[h].data[d]), e[h][d].rightOffset = s(e[h][d].rightval, l.calculatedScale, l.valueHop), e[h][d].leftOffset = s(e[h][d].leftval, l.calculatedScale, l.valueHop), e[h][d].xPosRight = l.yAxisPosX + e[h][d].rightOffset, e[h][d].xPosLeft = l.yAxisPosX + e[h][d].leftOffset, e[h][d].yPosTop = l.xAxisPosY + Math.ceil(i.chartSpaceScale * t.barValueSpacing) - l.scaleHop * (d + 1) + l.additionalSpaceBetweenBars, e[h][d].yPosBottom = e[h][d].yPosTop + l.barWidth, Math.ceil(i.chartSpaceScale * t.spaceBetweenBar) > 0 && (1 * a.datasets[h].data[d] < 0 ? (e[h][d].xPosLeft -= Math.ceil(i.chartSpaceScale * t.spaceBetweenBar), S[d] == 1 * a.datasets[h].data[d] && (e[h][d].xPosLeft += Math.ceil(i.chartSpaceScale * t.spaceBetweenBar) / 2), e[h][d].xPosLeft < e[h][d].xPosRight && (e[h][d].xPosLeft = e[h][d].xPosRight)) : 1 * a.datasets[h].data[d] > 0 && (e[h][d].xPosLeft += Math.ceil(i.chartSpaceScale * t.spaceBetweenBar), p[d] == 1 * a.datasets[h].data[d] && (e[h][d].xPosLeft -= Math.ceil(i.chartSpaceScale * t.spaceBetweenBar) / 2), e[h][d].xPosLeft > e[h][d].xPosRight && (e[h][d].xPosLeft = e[h][d].xPosRight))), e[h][d].v7 = e[h][d].xPosLeft, e[h][d].v8 = e[h][d].yPosBottom, e[h][d].v9 = e[h][d].xPosRight, e[h][d].v10 = e[h][d].yPosTop)
                }
        }
    }

    function isBooleanOptionTrue(e, a) {
        var t;
        if ("undefined" == typeof optionvar) {
            if ("function" == typeof a) return !0;
            if ("object" == typeof a) {
                for (t = 0; t < a.length; t++)
                    if (a[t]) return !0;
                return !1
            }
            return a
        }
        if ("function" == typeof optionvar) return !0;
        if ("object" == typeof optionvar) {
            for (t = 0; t < optionvar.length; t++)
                if (optionvar[t]) return !0;
            return !1
        }
        return optionvar
    }

    function setOptionValue(e, a, t, i, l, n, o, s, r, c) {
        var h;
        return "undefined" == typeof n ? "function" == typeof o ? o(a, t, i, l, s, r, c) : (h = "object" == typeof o ? o[Math.min(o.length - 1, Math.max(0, s))] : o, 1 != e && (h = Math.ceil(h * e)), h) : (h = "function" == typeof n ? n(a, t, i, l, s, r, c) : "object" == typeof n ? -1 == r ? n[Math.min(n.length - 1, Math.max(0, s))] : n[Math.min(n.length - 1, Math.max(0, r))] : n, 1 != e && (h = Math.ceil(h * e)), h)
    }

    function tpdraw(e, a) {
        var tp;
        switch (e.tpchart) {
            case "Bar":
            case "StackedBar":
                "Line" == a.type ? tp = "Line" : tp = e.tpchart;
                break;
            default:
                tp = e.tpchart
        }
        return tp
    }

    function setTextBordersAndBackground(e, a, t, i, l, n, o, s, r, c, h, d, u) {
        var p, S, ybottom;
        if ("string" != typeof a) {
            var g = a.toString();
            p = t * (g.split("\n").length || 1), S = e.measureText(g).width
        } else p = t * (a.split("\n").length || 1), S = e.measureText(a).width;
        var f, x, A;
        "center" == e.textAlign ? (f = -S / 2, x = S / 2) : "left" == e.textAlign ? (f = 0, x = S) : "right" == e.textAlign && (f = -S, x = 0), "top" == e.textBaseline ? (A = 0, ybottom = p) : "center" == e.textBaseline || "middle" == e.textBaseline ? (A = -p / 2, ybottom = p / 2) : "bottom" == e.textBaseline && (A = -p, ybottom = 0), e.save(), e.beginPath(), e.translate(i, l), "none" != d && (e.save(), e.fillStyle = d, e.fillRect(f - r, ybottom + c, x - f + 2 * r, A - ybottom - 2 * c), e.stroke(), e.restore(), e.fillStyle = "black"), n && (e.save(), e.lineWidth = s, e.strokeStyle = o, e.fillStyle = o, e.setLineDash(lineStyleFn(h)), e.rect(f - s / 2 - r, A - s / 2 - c, x - f + s + 2 * r, ybottom - A + s + 2 * c), e.stroke(), e.setLineDash([]), e.restore()), e.restore()
    }

    function calculatePieDrawingSize(e, a, t, i, l) {
        var n = ((t.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI),
            o = ((t.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        o <= t.zeroValue && (o = 2 * Math.PI);
        var s = (n - o + 4 * Math.PI) % (2 * Math.PI),
            r = s + o,
            c = Math.floor((s + t.zeroValue) / (Math.PI / 2) % 4),
            h = Math.floor((r - t.zeroValue) / (Math.PI / 2) % 4),
            d = [0, 0, 0, 0];
        if (h >= c)
            for (var u = c; h >= u; u++) d[u] = 1;
        else {
            for (var u = c; 4 > u; u++) d[u] = 1;
            for (var u = 0; h >= u; u++) d[u] = 1
        }
        0 == d[0] && 0 == d[1] ? (midPieY = a.topNotUsableSize + 5, doughnutRadius = a.availableHeight - 5) : 0 == d[2] && 0 == d[3] ? (midPieY = a.topNotUsableSize + a.availableHeight, doughnutRadius = a.availableHeight - 5) : (midPieY = a.topNotUsableSize + a.availableHeight / 2, doughnutRadius = a.availableHeight / 2 - 5);
        var p;
        if (0 == d[0] && 0 == d[3] ? (midPieX = a.leftNotUsableSize + a.availableWidth - 5, doughnutRadius = Math.min(doughnutRadius, a.availableWidth - 5), p = a.availableWidth - 5) : 0 == d[1] && 0 == d[2] ? (midPieX = a.leftNotUsableSize + 5, doughnutRadius = Math.min(doughnutRadius, a.availableWidth - 5), p = a.availableWidth - 5) : (midPieX = a.leftNotUsableSize + a.availableWidth / 2, doughnutRadius = Math.min(doughnutRadius, a.availableWidth / 2 - 5), p = a.availableWidth / 2 - 5), isBooleanOptionTrue(void 0, t.inGraphDataShow) && 3 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", e, i, l, void 0, t.inGraphDataRadiusPosition, 0, -1, {
                nullValue: !0
            }) && "off-center" == setOptionValue(1, "INGRAPHDATAALIGN", e, i, l, void 0, t.inGraphDataAlign, 0, -1, {
                nullValue: !0
            }) && 0 == setOptionValue(1, "INGRAPHDATAROTATE", e, i, l, void 0, t.inGraphDataRotate, 0, -1, {
                nullValue: !0
            })) {
            doughnutRadius = doughnutRadius - setOptionValue(e.chartTextScale, "INGRAPHDATAFONTSIZE", e, i, l, void 0, t.inGraphDataFontSize, 0, -1, {
                    nullValue: !0
                }) - setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", e, i, l, void 0, t.inGraphDataPaddingRadius, 0, -1, {
                    nullValue: !0
                }) - 5;
            for (var S, u = 0; u < i.length; u++)
                if ("undefined" != typeof i[u].value && 1 * i[u].value >= 0) {
                    e.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", e, i, l, void 0, t.inGraphDataFontStyle, u, -1, {
                            nullValue: !0
                        }) + " " + setOptionValue(e.chartTextScale, "INGRAPHDATAFONTSIZE", e, i, l, void 0, t.inGraphDataFontSize, u, -1, {
                            nullValue: !0
                        }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", e, i, l, void 0, t.inGraphDataFontFamily, u, -1, {
                            nullValue: !0
                        }), 1 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", e, i, l, void 0, t.inGraphDataAnglePosition, u, -1, {
                        nullValue: !0
                    }) ? S = n + setOptionValue(1, "INGRAPHDATAPADDINANGLE", e, i, l, void 0, t.inGraphDataPaddingAngle, u, -1, {
                            nullValue: !0
                        }) * (Math.PI / 180) : 2 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", e, i, l, void 0, t.inGraphDataAnglePosition, u, -1, {
                        nullValue: !0
                    }) ? S = n - l[u].segmentAngle / 2 + setOptionValue(1, "INGRAPHDATAPADDINANGLE", e, i, l, void 0, t.inGraphDataPaddingAngle, u, -1, {
                            nullValue: !0
                        }) * (Math.PI / 180) : 3 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", e, i, l, void 0, t.inGraphDataAnglePosition, u, -1, {
                        nullValue: !0
                    }) && (S = n - l[u].segmentAngle + setOptionValue(1, "INGRAPHDATAPADDINANGLE", e, i, l, void 0, t.inGraphDataPaddingAngle, u, -1, {
                            nullValue: !0
                        }) * (Math.PI / 180)), n -= l[u].segmentAngle;
                    var g = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", e, i, l, void 0, t.inGraphDataTmpl, u, -1, {
                            nullValue: !0
                        }), l[u], t),
                        f = e.measureText(g).width,
                        x = Math.abs((p - f) / Math.cos(S)) - setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", e, i, l, void 0, t.inGraphDataPaddingRadius, u, -1, {
                                nullValue: !0
                            }) - 5;
                    x < doughnutRadius && (doughnutRadius = x)
                }
        }
        return doughnutRadius *= t.radiusScale, {
            radius: doughnutRadius,
            midPieX: midPieX,
            midPieY: midPieY
        }
    }

    function gradientColor(e, a, t, i, l, n, o) {
        var s, r;
        if ("SHAPESINCHART_RECT" == e) s = a.createLinearGradient(o.xPosLeft, o.yPosBottom, o.xPosLeft, o.yPosTop), r = o.gradientColors;
        else if ("SHAPESINCHART_ELLIPSE" == e || "SHAPESINCHART_REGULARSHAPE" == e || "SHAPESINCHART_CIRCLE" == e) s = a.createRadialGradient(o.midPosX, o.midPosY, 0, o.midPosX, o.midPosY, o.radius), r = o.gradientColors;
        else switch (a.tpchart) {
                case "Radar":
                    s = "COLOR" == e ? a.createRadialGradient(o.midPosX, o.midPosY, 0, o.midPosX, o.midPosY, o.ext_radius) : a.createRadialGradient(o.xPosLeft + (o.xPosRight - o.xPosLeft) / 2, o.yPosBottom + (o.yPosTop - o.yPosBottom) / 2, 0, o.xPosLeft + (o.xPosRight - o.xPosLeft) / 2, o.yPosBottom + (o.yPosTop - o.yPosBottom) / 2, Math.max((o.xPosRight - o.xPosLeft) / 2, (o.yPosTop - o.yPosBottom) / 2)), r = t.datasets[l].gradientColors;
                    break;
                case "PolarArea":
                case "Pie":
                case "Doughnut":
                    s = "COLOR" == e ? a.createRadialGradient(i[0].midPosX, i[0].midPosY, o.scaleAnimation * i[0].int_radius, i[0].midPosX, i[0].midPosY, o.scaleAnimation * i[0].radiusOffset) : a.createRadialGradient(o.xPosLeft + (o.xPosRight - o.xPosLeft) / 2, o.yPosBottom + (o.yPosTop - o.yPosBottom) / 2, 0, o.xPosLeft + (o.xPosRight - o.xPosLeft) / 2, o.yPosBottom + (o.yPosTop - o.yPosBottom) / 2, Math.max((o.xPosRight - o.xPosLeft) / 2, (o.yPosTop - o.yPosBottom) / 2)), r = t[l].gradientColors;
                    break;
                case "Line":
                case "Bar":
                case "StackedBar":
                    s = a.createLinearGradient(o.xPosLeft, o.yPosBottom, o.xPosLeft, o.yPosTop), r = t.datasets[l].gradientColors;
                    break;
                case "HorizontalBar":
                case "HorizontalStackedBar":
                    s = a.createLinearGradient(o.xPosLeft, o.yPosBottom, o.xPosRight, o.yPosBottom), r = t.datasets[l].gradientColors
            }
        for (var c = r.length, h = [], d = /(\d{1,2}|100)%\s*?$/g, u = 0; c > u; u++) {
            var p = r[u].match(d);
            p ? (p = parseFloat(p) / 100, h[u] = p) : h[u] = !1
        }
        for (var u = 0; c > u; u++) {
            if (h[u] === !1)
                if (0 == u) h[u] = 0;
                else if (u == c - 1) h[u] = 1;
                else {
                    for (var S = u + 1; c - 1 > S && h[S] === !1;) S++;
                    var g = 0 == u ? 0 : h[u - 1];
                    h[u] = (S >= c - 1 ? 1 : h[S + 1]) - g, h[u] = g + h[u] / (S - u + 1)
                }
            GradientcolorsWithoutStep = r[u].replace(d, "").trim(), s.addColorStop(h[u], GradientcolorsWithoutStep)
        }
        return s
    }
    var chartJSLineStyle = [];
    chartJSLineStyle.solid = [], chartJSLineStyle.dotted = [1, 4], chartJSLineStyle.shortDash = [2, 1], chartJSLineStyle.dashed = [4, 2], chartJSLineStyle.dashSpace = [4, 6], chartJSLineStyle.longDashDot = [7, 2, 1, 2], chartJSLineStyle.longDashShortDash = [10, 4, 4, 4], chartJSLineStyle.gradient = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1], "function" != typeof String.prototype.trim && (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }), Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
        "use strict";
        if (null == this) throw new TypeError;
        var a = Object(this),
            t = a.length >>> 0;
        if (0 === t) return -1;
        var i = 0;
        if (arguments.length > 0 && (i = Number(arguments[1]), i != i ? i = 0 : 0 != i && i != 1 / 0 && i != -(1 / 0) && (i = (i > 0 || -1) * Math.floor(Math.abs(i)))), i >= t) return -1;
        for (var l = i >= 0 ? i : Math.max(t - Math.abs(i), 0); t > l; l++)
            if (l in a && a[l] === e) return l;
        return -1
    });
    var charJSPersonalDefaultOptions = {},
        charJSPersonalDefaultOptionsLine = {},
        charJSPersonalDefaultOptionsRadar = {},
        charJSPersonalDefaultOptionsPolarArea = {},
        charJSPersonalDefaultOptionsPie = {},
        charJSPersonalDefaultOptionsDoughnut = {},
        charJSPersonalDefaultOptionsBar = {},
        charJSPersonalDefaultOptionsStackedBar = {},
        charJSPersonalDefaultOptionsHorizontalBar = {},
        charJSPersonalDefaultOptionsHorizontalStackedBar = {},
        cachebis = {};
    "undefined" != typeof CanvasRenderingContext2D && (CanvasRenderingContext2D.prototype.fillTextMultiLine = function(e, a, t, i, l, n, o, s, r, c, h, d, u, p, q) {
        var S = ("" + e).split("\n");
        "middle" == i ? n && (t -= (S.length - 1) / 2 * l) : "bottom" == i && n && (t -= (S.length - 1) * l);
        for (var g = t - l, f = 0; f < S.length; f++) this.fillText(S[f], a, t), t += l;
        if (o) {
            var x = s.measureTextMultiLine(e, l),
                A = [],
                g = [];
            A.p1 = h + a, g.p1 = d + t - l;
            var m = Math.PI / 2 + c;
            "left" == s.textAlign && "top" == i ? (A.p1 += l * Math.cos(m), g.p1 += l * Math.sin(m)) : "left" == s.textAlign && "middle" == i ? (A.p1 += l / 2 * Math.cos(m), g.p1 += l / 2 * Math.sin(m)) : "left" == s.textAlign && "bottom" == i || ("center" == s.textAlign && "top" == i ? (A.p1 += l * Math.cos(m) - x.textWidth / 2 * Math.cos(c), g.p1 += l * Math.sin(m) - x.textWidth / 2 * Math.sin(c)) : "center" == s.textAlign && "middle" == i ? (A.p1 += l / 2 * Math.cos(m) - x.textWidth / 2 * Math.cos(c), g.p1 += l / 2 * Math.sin(m) - x.textWidth / 2 * Math.sin(c)) : "center" == s.textAlign && "bottom" == i ? (A.p1 -= x.textWidth / 2 * Math.cos(c), g.p1 -= x.textWidth / 2 * Math.sin(c)) : "right" == s.textAlign && "top" == i ? (A.p1 += l * Math.cos(m) - x.textWidth * Math.cos(c), g.p1 += l * Math.sin(m) - x.textWidth * Math.sin(c)) : "right" == s.textAlign && "middle" == i ? (A.p1 += l / 2 * Math.cos(m) - x.textWidth * Math.cos(c), g.p1 += l / 2 * Math.sin(m) - x.textWidth * Math.sin(c)) : "right" == s.textAlign && "bottom" == i && (A.p1 -= x.textWidth * Math.cos(c), g.p1 -= x.textWidth * Math.sin(c))), A.p2 = A.p1 + x.textWidth * Math.cos(c), g.p2 = g.p1 + x.textWidth * Math.sin(c), A.p3 = A.p1 - l * Math.cos(m), g.p3 = g.p1 - l * Math.sin(m), A.p4 = A.p3 + x.textWidth * Math.cos(c), g.p4 = g.p3 + x.textWidth * Math.sin(c), jsTextMousePos[s.ChartNewId][jsTextMousePos[s.ChartNewId].length] = [r, e, A, g, c, x.textWidth, x.textHeight, u, p, h, d]; if(typeof q != 'undefined') {q.x = h, q.y = d - x.textHeight, q.w = x.textWidth, q.h = x.textHeight};
        }
    }, CanvasRenderingContext2D.prototype.measureTextMultiLine = function(e, a) {
        for (var t, i = 0, l = ("" + e).replace(/\<span.*\>/, "").replace(/<BR>/gi, "\n").split("\n"), n = l.length * a, o = 0; o < l.length; o++) t = this.measureText(l[o]).width, t > i && (i = t);
        return {
            textWidth: i,
            textHeight: 1.2 * n
        }
    }, "function" != typeof CanvasRenderingContext2D.prototype.setLineDash && (CanvasRenderingContext2D.prototype.setLineDash = function(e) {
        return 0
    })); var cursorDivCreated = !1, initChartJsResize = !1;
    var jsGraphResize = new Array,
        container;
    var bw = new checkBrowser, fromLeft = 10, fromTop = 10; "function" != typeof String.prototype.trim && (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    });
    var dynamicDisplay = new Array,
        dynamicDisplayList = new Array,
        jsGraphAnnotate = new Array,
        jsTextMousePos = new Array,
        annotatePrevShow = -1,
        oCursor = null;

    this.reflowChart = function (ci) {
        annotatePrevShow = -1;
        reflowChart(ci);
    }

    this.redrawGraph = function (e, a , t) {
        annotatePrevShow = -1;
        redrawGraph(e, a, t);
    }

    this.getDivCursor = function () {
        return oCursor;
    }

    this.dispose = function () {
        dynamicDisplay = null;
        dynamicDisplayList = null;
        jsGraphAnnotate = null;
        jsTextMousePos = null;
        this.defaults = null;
        myStatData = null;
    }

    function init_and_start(e, a, t) {
        var i;
        annotatePrevShow = -1;
        if ("undefined" == typeof e.initialWidth && (e.initialWidth = e.canvas.width), "undefined" == typeof e.chartTextScale && (e.chartTextScale = t.chartTextScale), "undefined" == typeof e.chartLineScale && (e.chartLineScale = t.chartLineScale), "undefined" == typeof e.chartSpaceScale && (e.chartSpaceScale = t.chartSpaceScale), "undefined" == typeof e.ChartNewId) {
            e.runanimationcompletefunction = !0;
            var l = new Date,
                n = l.getTime();
            e.ChartNewId = e.tpchart + "_" + n, e._eventListeners = {}
        }
        if (!dynamicFunction(a, t, e)) return t.responsive && "undefined" == typeof e.firstPass && (t.multiGraph || addResponsiveChart(e.ChartNewId, e, a, t)), !1;
        if (t.responsive && "undefined" == typeof e.firstPass) {
            if (!t.multiGraph) return addResponsiveChart(e.ChartNewId, e, a, t), subUpdateChart(e, a, t), !1;
            e.firstPass = 1
        }
        switch ("undefined" == typeof jsGraphAnnotate[e.ChartNewId] ? (jsGraphAnnotate[e.ChartNewId] = new Array, jsTextMousePos[e.ChartNewId] = new Array) : t.multiGraph || clearAnnotate(e.ChartNewId), (0 == t.contextMenu || "function" == typeof t.mouseDownRight) && (e.canvas.oncontextmenu = function(e) {
            e.preventDefault()
        }), e.tpdata) {
            case 1:
                for (i = 0; i < a.length; i++) "undefined" == typeof a[i].title && "undefined" != typeof a[i].label && (a[i].title = a[i].label);
                break;
            case 0:
            default:
                for (i = 0; i < a.datasets.length; i++) "undefined" == typeof a.datasets[i].title && "undefined" != typeof a.datasets[i].label && (a.datasets[i].title = a.datasets[i].label)
        }
        return defMouse(e, a, t), setRect(e, t), !0
    }

    function reverseData(e) {
        e.labels = e.labels.reverse();
        for (var a = 0; a < e.datasets.length; a++)
            for (var t in e.datasets[a]) Array.isArray(e.datasets[a][t]) && (e.datasets[a][t] = e.datasets[a][t].reverse());
        return e
    }

    function calculateOffset(e, a, t, i) {
        if (e) return CapValue(log10(a) * i - log10(t.graphMin) * i, void 0, 0);
        var l = t.steps * t.stepValue,
            n = a - t.graphMin,
            o = CapValue(n / l, 1, 0);
        return i * t.steps * o
    }

    function animationLoop(e, a, t, i, l, n, o, s, r, c, h, d, u, p) {
        function S() {
            var S = e.animation ? CapValue(M(P), null, 0) : 1;
            1 * f >= 1 * CapValue(e.animationSteps, Number.MAX_VALUE, 1) || 0 == e.animation || 3 == i.firstPass || 4 == i.firstPass || 8 == i.firstPass || 9 == i.firstPass ? S = 1 : S >= 1 && (S = .9999), !e.animation || isIE() < 9 && 0 != isIE() || !e.clearRect || i.clearRect(l, n, o, s), dispCrossImage(i, e, r, c, h, d, !1, u, S, f), dispCrossText(i, e, r, c, h, d, !1, u, S, f), "function" == typeof e.beforeDrawFunction && e.beforeDrawFunction("BEFOREDRAWFUNCTION", i, u, p, -1, -1, {
                animationValue: S,
                cntiter: f,
                config: e,
                borderX: h,
                borderY: d,
                midPosX: r,
                midPosY: c
            }), e.scaleOverlay ? (t(S), "function" == typeof e.endDrawDataFunction && e.endDrawDataFunction("ENDDATAFUNCTION", i, u, p, -1, -1, {
                animationValue: S,
                cntiter: f,
                config: e,
                borderX: h,
                borderY: d,
                midPosX: r,
                midPosY: c,
                startX: h,
                startY: n,
                endX: o,
                endY: d
            }), a(), "function" == typeof e.endDrawScaleFunction && e.endDrawScaleFunction("ENDSCALEFUNCTION", i, u, p, -1, -1, {
                animationValue: S,
                cntiter: f,
                config: e,
                borderX: h,
                borderY: d,
                midPosX: r,
                midPosY: c
            })) : (a(), "function" == typeof e.endDrawScaleFunction && e.endDrawScaleFunction("ENDSCALEFUNCTION", i, u, p, -1, -1, {
                animationValue: S,
                cntiter: f,
                config: e,
                borderX: h,
                borderY: d,
                midPosX: r,
                midPosY: c
            }), t(S), "function" == typeof e.endDrawDataFunction && e.endDrawDataFunction("ENDDATAFUNCTION", i, u, p, -1, -1, {
                animationValue: S,
                cntiter: f,
                config: e,
                borderX: h,
                borderY: d,
                midPosX: r,
                midPosY: c,
                startX: h,
                startY: n,
                endX: h+o,
                endY: d
            })), dispCrossImage(i, e, r, c, h, d, !0, u, S, f), dispCrossText(i, e, r, c, h, d, !0, u, S, f)
        }

        function g() {
            f += A, P += A * m, f == e.animationSteps || 0 == e.animation || 3 == i.firstPass || 4 == i.firstPass || 8 == i.firstPass || 9 == i.firstPass ? P = 1 : P >= 1 && (P = .999), S(), -1 == A && T >= f ? ("function" == typeof e.onAnimationComplete && 1 == i.runanimationcompletefunction && e.onAnimationComplete(i, e, u, 0, x + 1), A = 1, requestAnimFrame(g)) : P < e.animationStopValue ? requestAnimFrame(g) : !(x < e.animationCount || 0 == e.animationCount) || 1 != i.firstPass && 2 == i.firstPass ? testRedraw(i, u, e) || "function" == typeof e.onAnimationComplete && 1 == i.runanimationcompletefunction && (e.onAnimationComplete(i, e, u, 1, x + 1), i.runanimationcompletefunction = !1) : (x++, e.animationBackward && 1 == A ? (P -= m, A = -1) : (A = 1, f = T - 1, P = v - m), window.setTimeout(g, 1e3 * e.animationPauseTime))
        }
        var f = 0,
            x = 1,
            A = 1;
        (e.animationStartValue < 0 || e.animationStartValue > 1) && (e.animation.StartValue = 0), (e.animationStopValue < 0 || e.animationStopValue > 1) && (e.animation.StopValue = 1), e.animationStopValue < e.animationStartValue && (e.animationStopValue = e.animationStartValue), isIE() < 9 && 0 != isIE() && (e.animation = !1);
        var m = e.animation ? 1 / CapValue(e.animationSteps, Number.MAX_VALUE, 1) : 1,
            M = animationOptions[e.animationEasing],
            P = e.animation ? 0 : 1;
        if (e.animation && e.animationStartValue > 0 && e.animationStartValue <= 1)
            for (; P < e.animationStartValue;) f++, P += m;
        var T = f,
            v = P;
        "function" != typeof a && (a = function() {}), e.clearRect ? g() : g()
    }

    function calculateScale(e, a, t, i, l, n, o) {
        var s, r, c, h, d, u, p, S, g;
        if (2 == e ? (S = a.logarithmic2, g = a.yAxisMinimumInterval2) : (S = a.logarithmic, g = a.yAxisMinimumInterval), S) {
            n == l && (l += 1), 0 == n && (n = .01);
            var f = calculateOrderOfMagnitude(n),
                x = calculateOrderOfMagnitude(l) + 1;
            s = Math.pow(10, f), r = Math.pow(10, x), p = x - f
        } else if (u = l - n, p = calculateOrderOfMagnitude(u), s = Math.abs(n) > a.zeroValue ? Math.floor(n / (1 * Math.pow(10, p))) * Math.pow(10, p) : 0, r = Math.abs(l) > a.zeroValue ? Math.ceil(l / (1 * Math.pow(10, p))) * Math.pow(10, p) : 0, "number" == typeof g && r >= 0) {
            for (s -= s % g; s > n;) s -= g;
            for (r % g > a.zeroValue && r % g < g - a.zeroValue && (r = roundScale(a, (1 + Math.floor(r / g)) * g)); l > r;) r += g
        }
        if (c = r - s, h = Math.pow(10, p), d = Math.round(c / h), S) d = p;
        else {
            for (var A = !1; !A && (i > d || d > t);) i > d ? ("number" == typeof g && g > h / 2 && (A = !0, h = g, d = Math.ceil(c / h)), A || (h /= 2, d = Math.round(c / h))) : (h *= 2, d = Math.round(c / h));
            if ("number" == typeof g && (g > h && (h = g, d = Math.ceil(c / h)), h % g > a.zeroValue && h % g < g - a.zeroValue && (2 * h % g < a.zeroValue || 2 * h % g > g - a.zeroValue ? (h = 2 * h, d = Math.ceil(c / h)) : (h = roundScale(a, (1 + Math.floor(h / g)) * g), d = Math.ceil(c / h)))), 1 == a.graphMaximized || "bottom" == a.graphMaximized || "undefined" != typeof a.graphMin)
                for (; n > s + h && d >= 3;) s += h, d--;
            if (1 == a.graphMaximized || "top" == a.graphMaximized || "undefined" != typeof a.graphMax)
                for (; s + (d - 1) * h >= l && d >= 3;) d--
        }
        var m = [];
        return populateLabels(1, a, o, m, d, s, r, h), {
            steps: d,
            stepValue: h,
            graphMin: s,
            labels: m,
            maxValue: a.yMaximum == "smart" ? l : a.yMaximum
        }
    }

    function roundScale(e, a) {
        var t = 0,
            i = "" + e.yAxisMinimumInterval;
        return i.indexOf(".") > 0 && (t = i.substr(i.indexOf(".")).length), Math.round(a * Math.pow(10, t)) / Math.pow(10, t)
    }

    function calculateOrderOfMagnitude(e) {
        return 0 == e ? 0 : Math.floor(Math.log(e) / Math.LN10)
    }

    function populateLabels(e, a, t, i, l, n, o, s) {
        var r, fmtYLabel;
        if (2 == e ? (r = a.logarithmic2, fmtYLabel = a.fmtYLabel2) : (r = a.logarithmic, fmtYLabel = a.fmtYLabel), t) {
            var c;
            if (r) {
                var h = n;
                for (c = 0; l + 1 > c; c++) i.push(tmpl(t, {
                    value: fmtChartJS(a, 1 * h.toFixed(getDecimalPlaces(h)), fmtYLabel)
                }, a)), h *= 10
            } else
                for (c = 0; l + 1 > c; c++) i.push(tmpl(t, {
                    value: fmtChartJS(a, 1 * (n + s * c).toFixed(getDecimalPlaces(s)), fmtYLabel)
                }, a))
        }
    }

    function Max(e) {
        return Math.max.apply(Math, e)
    }

    function Min(e) {
        return Math.min.apply(Math, e)
    }

    function Default(e, a) {
        return e ? e : a
    }

    function CapValue(e, a, t) {
        return isNumber(a) && e > a ? a : isNumber(t) && t > e ? t : e
    }

    function getDecimalPlaces(e) {
        var a = ("" + e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        return a ? Math.max(0, (a[1] ? a[1].length : 0) - (a[2] ? +a[2] : 0)) : 0
    }

    function mergeChartConfig(e, a) {
        var t = {};
        for (var i in e) t[i] = e[i];
        for (var l in a) t[l] = a[l];
        return t
    }

    function tmpl(e, a, t) {
        var newstr;
        return newstr = e, newstr.substr(0, t.templatesOpenTag.length) == t.templatesOpenTag && (newstr = "<%=" + newstr.substr(t.templatesOpenTag.length, newstr.length - t.templatesOpenTag.length)), newstr.substr(newstr.length - t.templatesCloseTag.length, t.templatesCloseTag.length) == t.templatesCloseTag && (newstr = newstr.substr(0, newstr.length - t.templatesCloseTag.length) + "%>"), tmplpart2(newstr, a)
    }

    function tmplpart2(e, a) {
        var t = /\W/.test(e) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + e.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : cache[e] = cache[e] || tmplpart2(document.getElementById(e).innerHTML);
        return a ? t(a) : t
    }

    function dispCrossText(e, a, t, i, l, n, o, s, r, c) {
        var h, d, u, p, S, g;
        for (h = 0; h < a.crossText.length; h++)
            if ("" != a.crossText[h] && a.crossTextOverlay[Min([h, a.crossTextOverlay.length - 1])] == o && (1 == c && "first" == a.crossTextIter[Min([h, a.crossTextIter.length - 1])] || a.crossTextIter[Min([h, a.crossTextIter.length - 1])] == c || "all" == a.crossTextIter[Min([h, a.crossTextIter.length - 1])] || 1 == r && "last" == a.crossTextIter[Min([h, a.crossTextIter.length - 1])])) {
                switch (e.save(), e.beginPath(), e.font = a.crossTextFontStyle[Min([h, a.crossTextFontStyle.length - 1])] + " " + Math.ceil(e.chartTextScale * a.crossTextFontSize[Min([h, a.crossTextFontSize.length - 1])]).toString() + "px " + a.crossTextFontFamily[Min([h, a.crossTextFontFamily.length - 1])], e.fillStyle = a.crossTextFontColor[Min([h, a.crossTextFontColor.length - 1])], S = a.crossTextAlign[Min([h, a.crossTextAlign.length - 1])], g = a.crossTextBaseline[Min([h, a.crossTextBaseline.length - 1])], u = 1 * Math.ceil(e.chartSpaceScale * a.crossTextPosX[Min([h, a.crossTextPosX.length - 1])]), p = 1 * Math.ceil(e.chartSpaceScale * a.crossTextPosY[Min([h, a.crossTextPosY.length - 1])]), 1 * a.crossTextRelativePosX[Min([h, a.crossTextRelativePosX.length - 1])]) {
                    case 0:
                        "default" == S && (S = "left");
                        break;
                    case 1:
                        u += l, "default" == S && (S = "right");
                        break;
                    case 2:
                        u += t, "default" == S && (S = "center");
                        break;
                    case -2:
                        u += context.canvas.width / 2, "default" == S && (S = "center");
                        break;
                    case 3:
                        u += u + 2 * t - l, "default" == S && (S = "left");
                        break;
                    case 4:
                        u += context.canvas.width, "default" == S && (S = "right");
                        break;
                    default:
                        u += t, "default" == S && (S = "center")
                }
                switch (1 * a.crossTextRelativePosY[Min([h, a.crossTextRelativePosY.length - 1])]) {
                    case 0:
                        "default" == g && (g = "top");
                        break;
                    case 3:
                        p += n, "default" == g && (g = "top");
                        break;
                    case 2:
                        p += i, "default" == g && (g = "middle");
                        break;
                    case -2:
                        p += context.canvas.height / 2, "default" == g && (g = "middle");
                        break;
                    case 1:
                        p += p + 2 * i - n, "default" == g && (g = "bottom");
                        break;
                    case 4:
                        p += context.canvas.height, "default" == g && (g = "bottom");
                        break;
                    default:
                        p += i, "default" == g && (g = "middle")
                }
                e.textAlign = S, e.textBaseline = g, e.translate(1 * u, 1 * p);
                var f = Math.PI * a.crossTextAngle[Min([h, a.crossTextAngle.length - 1])] / 180;
                e.rotate(f), "%" == a.crossText[h].substring(0, 1) ? "function" == typeof a.crossTextFunction && (d = a.crossTextFunction(h, a.crossText[h], e, a, t, i, l, n, o, s, r)) : d = a.crossText[h], setTextBordersAndBackground(e, d, Math.ceil(e.chartTextScale * a.crossTextFontSize[Min([h, a.crossTextFontSize.length - 1])]), 0, 0, a.crossTextBorders[Min([h, a.crossTextBorders.length - 1])], a.crossTextBordersColor[Min([h, a.crossTextBordersColor.length - 1])], Math.ceil(e.chartLineScale * a.crossTextBordersWidth[Min([h, a.crossTextBordersWidth.length - 1])]), Math.ceil(e.chartSpaceScale * a.crossTextBordersXSpace[Min([h, a.crossTextBordersXSpace.length - 1])]), Math.ceil(e.chartSpaceScale * a.crossTextBordersYSpace[Min([h, a.crossTextBordersYSpace.length - 1])]), a.crossTextBordersStyle[Min([h, a.crossTextBordersStyle.length - 1])], a.crossTextBackgroundColor[Min([h, a.crossTextBackgroundColor.length - 1])], "CROSSTEXT"), 1 == r && "all" == a.crossTextIter[Min([h, a.crossTextIter.length - 1])] || "last" != a.crossTextIter[Min([h, a.crossTextIter.length - 1])] ? e.fillTextMultiLine(d, 0, 0, e.textBaseline, Math.ceil(e.chartTextScale * a.crossTextFontSize[Min([h, a.crossTextFontSize.length - 1])]), !0, a.detectMouseOnText, e, "CROSSTEXT_TEXTMOUSE", f, 1 * u, 1 * p, h, -1) : e.fillTextMultiLine(d, 0, 0, e.textBaseline, Math.ceil(e.chartTextScale * a.crossTextFontSize[Min([h, a.crossTextFontSize.length - 1])]), !0, !1, e, "CROSSTEXT_TEXTMOUSE", f, 1 * u, 1 * p, h, -1), e.restore()
            }
    }

    function dispCrossImage(e, a, t, i, l, n, o, s, r, c) {
        var h, d, u, p, S;
        for (h = 0; h < a.crossImage.length; h++)
            if ("undefined" != typeof a.crossImage[h] && a.crossImageOverlay[Min([h, a.crossImageOverlay.length - 1])] == o && (-1 == c && "background" == a.crossImageIter[Min([h, a.crossImageIter.length - 1])] || 1 == c && "first" == a.crossImageIter[Min([h, a.crossImageIter.length - 1])] || a.crossImageIter[Min([h, a.crossImageIter.length - 1])] == c || -1 != c && "all" == a.crossImageIter[Min([h, a.crossImageIter.length - 1])] || 1 == r && "last" == a.crossImageIter[Min([h, a.crossImageIter.length - 1])])) {
                switch (e.save(), e.beginPath(), p = a.crossImageAlign[Min([h, a.crossImageAlign.length - 1])], S = a.crossImageBaseline[Min([h, a.crossImageBaseline.length - 1])], d = 1 * Math.ceil(e.chartSpaceScale * a.crossImagePosX[Min([h, a.crossImagePosX.length - 1])]), u = 1 * Math.ceil(e.chartSpaceScale * a.crossImagePosY[Min([h, a.crossImagePosY.length - 1])]), 1 * a.crossImageRelativePosX[Min([h, a.crossImageRelativePosX.length - 1])]) {
                    case 0:
                        "default" == p && (p = "left");
                        break;
                    case 1:
                        d += l, "default" == p && (p = "right");
                        break;
                    case 2:
                        d += t, "default" == p && (p = "center");
                        break;
                    case -2:
                        d += context.canvas.width / 2, "default" == p && (p = "center");
                        break;
                    case 3:
                        d += d + 2 * t - l, "default" == p && (p = "left");
                        break;
                    case 4:
                        d += context.canvas.width, "default" == p && (p = "right");
                        break;
                    default:
                        d += t, "default" == p && (p = "center")
                }
                switch (1 * a.crossImageRelativePosY[Min([h, a.crossImageRelativePosY.length - 1])]) {
                    case 0:
                        "default" == S && (S = "top");
                        break;
                    case 3:
                        u += n, "default" == S && (S = "top");
                        break;
                    case 2:
                        u += i, "default" == S && (S = "middle");
                        break;
                    case -2:
                        u += context.canvas.height / 2, "default" == S && (S = "middle");
                        break;
                    case 1:
                        u += u + 2 * i - n, "default" == S && (S = "bottom");
                        break;
                    case 4:
                        u += context.canvas.height, "default" == S && (S = "bottom");
                        break;
                    default:
                        u += i, "default" == S && (S = "middle")
                }
                var g = a.crossImage[h].width;
                switch (p) {
                    case "left":
                        break;
                    case "right":
                        d -= g;
                        break;
                    case "center":
                        d -= g / 2
                }
                var f = a.crossImage[h].height;
                switch (S) {
                    case "top":
                        break;
                    case "bottom":
                        u -= f;
                        break;
                    case "middle":
                        u -= f / 2
                }
                e.translate(1 * d, 1 * u), e.rotate(Math.PI * a.crossImageAngle[Min([h, a.crossImageAngle.length - 1])] / 180), e.drawImage(a.crossImage[h], 0, 0), e.restore()
            }
    }

    function setMeasures(e, a, t, i, l, n, o, s, r, c, h, d, u) {
        var startMeasures = new Date().getTime();

        "none" != a.canvasBackgroundColor && (t.canvas.style.background = a.canvasBackgroundColor);
        var p = 0,
            S = 0,
            g = 0,
            f = 0,
            x = 0,
            A = 0,
            m = 0,
            M = 0,
            P = 0,
            T = 0,
            v = 0,
            L = 0,
            D = 0,
            y = 0,
            V = 0,
            b = 0,
            I = 0,
            O = 0,
            B = 0,
            R = 0,
            N = 0,
            G = 0,
            w = 0,
            H = 0,
            C = 1,
            F = 1,
            k = 0,
            E = 1,
            z = 0,
            W = 1,
            Y = 0,
            X = 0,
            U = 0,
            _ = 0,
            j = 0,
            J = 0,
            availableWidth, topNotUsableSize, bottomNotUsableHeightWithoutXLabels, availableLegendWidth, maxLegendOnLine, xLabelWidth, bottomNotUsableHeightWithXLabels,
            nblab, availableHeight, clrx, clry, clrwidth, clrheight;
        t.widthAtSetMeasures = l, t.heightAtSetMeasures = i, a.canvasBorders && (p = Math.ceil(t.chartLineScale * a.canvasBordersWidth));
        var K, Z;
        if (c) {
            for (t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, Z = 0; Z < e.labels.length; Z++) showLabels(t, e, a, Z) === !0 && (K = t.measureTextMultiLine(fmtChartJS(a, e.labels[Z], a.fmtXLabel), Math.ceil(t.chartTextScale * a.scaleFontSize)), C = K.textWidth > C ? K.textWidth : C, F = K.textHeight > F ? K.textHeight : F);
            C < Math.ceil(t.chartTextScale * a.xScaleLabelsMinimumWidth) && (C = Math.ceil(t.chartTextScale * a.xScaleLabelsMinimumWidth))
        }
        if (c) {
            if (k = 1, null != n && "nihil" != n)
                for (t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, Z = n.length - 1; Z >= 0; Z--) "string" == typeof n[Z] && showYLabels(t, e, a, Z, n[Z]) && "" != n[Z].trim() && (K = t.measureTextMultiLine(fmtChartJS(a, parseFloat(n[Z]).toFixed(a.yAxisFormat), a.fmtYLabel), Math.ceil(t.chartTextScale * a.scaleFontSize)), k = K.textWidth > k ? K.textWidth : k, E = K.textHeight > E ? K.textHeight : E);
            if (k < Math.ceil(t.chartTextScale * a.yScaleLabelsMinimumWidth) && (k = Math.ceil(t.chartTextScale * a.yScaleLabelsMinimumWidth)), z = 1, null != o && a.yAxisRight)
                for (t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, Z = o.length - 1; Z >= 0; Z--) "string" == typeof o[Z] && "" != o[Z].trim() && (K = t.measureTextMultiLine(fmtChartJS(a, parseFloat(o[Z]).toFixed(a.yAxisFormat), a.fmtYLabel2), Math.ceil(t.chartTextScale * a.scaleFontSize)), z = K.textWidth > z ? K.textWidth : z, W = K.textHeight > W ? K.textHeight : W);
            else z = k;
            z < Math.ceil(t.chartTextScale * a.yScaleLabelsMinimumWidth) && (z = Math.ceil(t.chartTextScale * a.yScaleLabelsMinimumWidth))
        }
        if (Y = p + Math.ceil(t.chartSpaceScale * a.spaceLeft), X = p + Math.ceil(t.chartSpaceScale * a.spaceRight), c && ("undefined" != typeof a.yAxisLabel && ("" != a.yAxisLabel.trim() && (R = Math.ceil(t.chartTextScale * a.yAxisFontSize) * (a.yAxisLabel.split("\n").length || 1) + Math.ceil(t.chartSpaceScale * a.yAxisLabelSpaceLeft) + Math.ceil(t.chartSpaceScale * a.yAxisLabelSpaceRight), N = p + Math.ceil(t.chartSpaceScale * a.spaceLeft) + Math.ceil(t.chartSpaceScale * a.yAxisLabelSpaceLeft) + Math.ceil(t.chartTextScale * a.yAxisFontSize), G = l - p - Math.ceil(t.chartSpaceScale * a.spaceRight) - Math.ceil(t.chartSpaceScale * a.yAxisLabelSpaceLeft) - Math.ceil(t.chartTextScale * a.yAxisFontSize)), ("none" != a.yAxisLabelBackgroundColor || a.yAxisLabelBorders) && (R += 2 * Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersYSpace), N += Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersYSpace), G -= Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersYSpace)), a.graphTitleBorders && (R += 2 * Math.ceil(t.chartLineScale * a.yAxisLabelBordersWidth), N += Math.ceil(t.chartLineScale * a.yAxisLabelBordersWidth), G -= Math.ceil(t.chartLineScale * a.yAxisLabelBordersWidth))), a.yAxisLeft && (Y = 0 == r ? p + Math.ceil(t.chartSpaceScale * a.spaceLeft) + R + k + Math.ceil(t.chartSpaceScale * a.yAxisSpaceLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight) : p + Math.ceil(t.chartSpaceScale * a.spaceLeft) + R + C + Math.ceil(t.chartSpaceScale * a.yAxisSpaceLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), a.yAxisRight && (X = 0 == r ? p + Math.ceil(t.chartSpaceScale * a.spaceRight) + R + z + Math.ceil(t.chartSpaceScale * a.yAxisSpaceLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight) : p + Math.ceil(t.chartSpaceScale * a.spaceRight) + R + C + Math.ceil(t.chartSpaceScale * a.yAxisSpaceLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight))), availableWidth = l - Y - X, "" != a.graphTitle.trim() && (g = Math.ceil(t.chartTextScale * a.graphTitleFontSize) * (a.graphTitle.split("\n").length || 1) + Math.ceil(t.chartSpaceScale * a.graphTitleSpaceBefore) + Math.ceil(t.chartSpaceScale * a.graphTitleSpaceAfter), f = p + Math.ceil(t.chartSpaceScale * a.spaceTop) + g - Math.ceil(t.chartSpaceScale * a.graphTitleSpaceAfter), ("none" != a.graphTitleBackgroundColor || a.graphTitleBorders) && (g += 2 * Math.ceil(t.chartSpaceScale * a.graphTitleBordersYSpace), f += Math.ceil(t.chartSpaceScale * a.graphTitleBordersYSpace)), a.graphTitleBorders && (g += 2 * Math.ceil(t.chartLineScale * a.graphTitleBordersWidth), f += Math.ceil(t.chartLineScale * a.graphTitleBordersWidth))), "" != a.graphSubTitle.trim() && (x = Math.ceil(t.chartTextScale * a.graphSubTitleFontSize) * (a.graphSubTitle.split("\n").length || 1) + Math.ceil(t.chartSpaceScale * a.graphSubTitleSpaceBefore) + Math.ceil(t.chartSpaceScale * a.graphSubTitleSpaceAfter), A = p + Math.ceil(t.chartSpaceScale * a.spaceTop) + g + x - Math.ceil(t.chartSpaceScale * a.graphSubTitleSpaceAfter), ("none" != a.graphSubTitleBackgroundColor || a.graphSubTitleBorders) && (x += 2 * Math.ceil(t.chartSpaceScale * a.graphSubTitleBordersYSpace), A += Math.ceil(t.chartSpaceScale * a.graphSubTitleBordersYSpace)), a.graphSubTitleBorders && (x += 2 * Math.ceil(t.chartLineScale * a.graphSubTitleBordersWidth), A += Math.ceil(t.chartLineScale * a.graphSubTitleBordersWidth))), c && ("" != a.yAxisUnit.trim() && (P = Math.ceil(t.chartTextScale * a.yAxisUnitFontSize) * (a.yAxisUnit.split("\n").length || 1) + Math.ceil(t.chartSpaceScale * a.yAxisUnitSpaceBefore) + Math.ceil(t.chartSpaceScale * a.yAxisUnitSpaceAfter), T = p + Math.ceil(t.chartSpaceScale * a.spaceTop) + g + x + P - Math.ceil(t.chartSpaceScale * a.yAxisUnitSpaceAfter)), ("none" != a.yAxisUnitBackgroundColor || a.yAxisUnitBorders) && (P += 2 * Math.ceil(t.chartSpaceScale * a.yAxisUnitBordersYSpace), T += Math.ceil(t.chartSpaceScale * a.yAxisUnitBordersYSpace)), a.yAxisUnitBorders && (P += 2 * Math.ceil(t.chartLineScale * a.yAxisUnitBordersWidth), T += Math.ceil(t.chartLineScale * a.yAxisUnitBordersWidth))), topNotUsableSize = p + Math.ceil(t.chartSpaceScale * a.spaceTop) + g + x + P + Math.ceil(t.chartTextScale * a.graphSpaceBefore), "undefined" != typeof a.footNote && "" != a.footNote.trim() && (m = Math.ceil(t.chartTextScale * a.footNoteFontSize) * (a.footNote.split("\n").length || 1) + Math.ceil(t.chartSpaceScale * a.footNoteSpaceBefore) + Math.ceil(t.chartSpaceScale * a.footNoteSpaceAfter), M = i - Math.ceil(t.chartSpaceScale * a.spaceBottom) - p - Math.ceil(t.chartSpaceScale * a.footNoteSpaceAfter), ("none" != a.footNoteBackgroundColor || a.footNoteBorders) && (m += 2 * Math.ceil(t.chartSpaceScale * a.footNoteBordersYSpace), M -= Math.ceil(t.chartSpaceScale * a.footNoteBordersYSpace)), a.footNoteBorders && (m += 2 * Math.ceil(t.chartLineScale * a.footNoteBordersWidth), M -= Math.ceil(t.chartLineScale * a.footNoteBordersWidth))), c && "undefined" != typeof a.xAxisLabel && "" != a.xAxisLabel.trim() && (w = Math.ceil(t.chartTextScale * a.xAxisFontSize) * (a.xAxisLabel.split("\n").length || 1) + Math.ceil(t.chartSpaceScale * a.xAxisLabelSpaceBefore) + Math.ceil(t.chartSpaceScale * a.xAxisLabelSpaceAfter), S = i - p - Math.ceil(t.chartSpaceScale * a.spaceBottom) - m - Math.ceil(t.chartSpaceScale * a.xAxisLabelSpaceAfter), ("none" != a.xAxisLabelBackgroundColor || a.footNoteBorders) && (w += 2 * Math.ceil(t.chartSpaceScale * a.xAxisLabelBordersYSpace), S -= Math.ceil(t.chartSpaceScale * a.xAxisLabelBordersYSpace)), a.footNoteBorders && (w += 2 * Math.ceil(t.chartLineScale * a.xAxisLabelBordersWidth), S -= Math.ceil(t.chartLineScale * a.xAxisLabelBordersWidth))), bottomNotUsableHeightWithoutXLabels = p + Math.ceil(t.chartSpaceScale * a.spaceBottom) + m + w + Math.ceil(t.chartTextScale * a.graphSpaceAfter), "undefined" != typeof a.legend && 1 == a.legend) {
            t.font = a.legendFontStyle + " " + Math.ceil(t.chartTextScale * a.legendFontSize).toString() + "px " + a.legendFontFamily;
            var q;
            if (h)
                for (Z = e.datasets.length - 1; Z >= 0; Z--) "string" == typeof e.datasets[Z].title && "" != e.datasets[Z].title.trim() && (L++, q = t.measureText(fmtChartJS(a, e.datasets[Z].title, a.fmtLegend)).width, v = q > v ? q : v);
            else
                for (Z = e.length - 1; Z >= 0; Z--) "string" == typeof e[Z].title && "" != e[Z].title.trim() && (L++, q = t.measureText(fmtChartJS(a, e[Z].title, a.fmtLegend)).width, v = q > v ? q : v);
            if (L > 1 || 1 == L && a.showSingleLegend) {
                v += Math.ceil(t.chartTextScale * a.legendBlockSize) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenBoxAndText), 1 == a.legendPosY || 2 == a.legendPosY || 3 == a.legendPosY ? availableLegendWidth = availableWidth - Math.ceil(t.chartSpaceScale * Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText)) - Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) : availableLegendWidth = l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - 2 * p - Math.ceil(t.chartSpaceScale * Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText)) - Math.ceil(t.chartSpaceScale * a.legendSpaceRightText), 1 == a.legendBorders && (availableLegendWidth -= 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceLeft) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceRight)), maxLegendOnLine = Min([Math.floor((availableLegendWidth + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))), a.maxLegendCols]), D = Math.ceil(L / maxLegendOnLine), y = Math.ceil(L / D);
                var Q = D * (Math.ceil(t.chartTextScale * a.legendFontSize) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextVertical)) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextVertical) + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartSpaceScale * a.legendSpaceAfterText);
                switch (a.legendPosY) {
                    case 0:
                        b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, V = Q, 1 == a.legendBorders ? (B = topNotUsableSize + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2, I = B + Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartTextScale * a.legendFontSize), V += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), O = Math.floor(b - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2), J = Math.ceil(V - Math.ceil(t.chartLineScale * a.legendBordersWidth)) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), j = Math.ceil(y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText)) : I = topNotUsableSize + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2, P > 0 && (T += V, 1 == a.legendBorders && (B -= P), I -= P), topNotUsableSize += V;
                        break;
                    case 1:
                        V = Q, b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, I = topNotUsableSize + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartTextScale * a.legendFontSize), 1 == a.legendBorders && (I += Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartLineScale * a.legendBordersWidth), B = I - Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) - Math.ceil(t.chartTextScale * a.legendFontSize) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2, V += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), O = Math.floor(b - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2), J = Math.ceil(V - Math.ceil(t.chartLineScale * a.legendBordersWidth)) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), j = Math.ceil(y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText));
                        break;
                    case 2:
                        V = Q, b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, I = topNotUsableSize + (i - topNotUsableSize - bottomNotUsableHeightWithoutXLabels - V) / 2 + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartTextScale * a.legendFontSize), 1 == a.legendBorders && (I += Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), B = I - Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) - Math.ceil(t.chartTextScale * a.legendFontSize) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2, V += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), O = Math.floor(b - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2), J = Math.ceil(V - Math.ceil(t.chartLineScale * a.legendBordersWidth)) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), j = Math.ceil(y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText));
                        break;
                    case -2:
                        V = Q, b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, I = (i - V) / 2 + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartTextScale * a.legendFontSize), 1 == a.legendBorders && (I += Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), B = I - Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) - Math.ceil(t.chartTextScale * a.legendFontSize) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2, V += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), O = Math.floor(b - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2), J = Math.ceil(V - Math.ceil(t.chartLineScale * a.legendBordersWidth)) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), j = Math.ceil(y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText));
                        break;
                    case 3:
                        V = Q, b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, availableHeight = i - topNotUsableSize - bottomNotUsableHeightWithoutXLabels, I = topNotUsableSize + availableHeight - V + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartTextScale * a.legendFontSize), 1 == a.legendBorders && (I -= Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter) + Math.ceil(t.chartLineScale * a.legendBordersWidth), B = I - Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) - Math.ceil(t.chartTextScale * a.legendFontSize) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2, V += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), O = Math.floor(b - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2), J = Math.ceil(V - Math.ceil(t.chartLineScale * a.legendBordersWidth)) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), j = Math.ceil(y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText));
                        break;
                    default:
                        V = Q, I = i - p - Math.ceil(t.chartSpaceScale * a.spaceBottom) - m - V + Math.ceil(t.chartSpaceScale * a.legendSpaceBeforeText) + Math.ceil(t.chartTextScale * a.legendFontSize), b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, 1 == a.legendBorders && (V += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), I -= Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), B = Math.floor(i - p - Math.ceil(t.chartSpaceScale * a.spaceBottom) - m - V + Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore)), O = Math.floor(b - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2), J = Math.ceil(V - Math.ceil(t.chartLineScale * a.legendBordersWidth)) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceBefore) - Math.ceil(t.chartSpaceScale * a.legendBordersSpaceAfter), j = Math.ceil(y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal))) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText)), S -= V, bottomNotUsableHeightWithoutXLabels += V
                }
                var $ = Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) + y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText);
                switch (1 == a.legendBorders && ($ += 2 * Math.ceil(t.chartLineScale * a.legendBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceLeft) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceRight)), a.legendPosX) {
                    case 0:
                    case 1:
                        b = Math.ceil(t.chartSpaceScale * a.spaceLeft) + a.canvasBorders * Math.ceil(t.chartLineScale * a.canvasBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText), 1 == a.legendBorders && (b += Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceLeft), O = Math.ceil(t.chartSpaceScale * a.spaceLeft) + a.canvasBorders * Math.ceil(t.chartLineScale * a.canvasBordersWidth) + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceLeft)), 0 == a.legendPosX && (a.legendPosY >= 1 && a.legendPosY <= 3 || -2 == a.legendPosY) && (Y += $, N += $);
                        break;
                    case 2:
                        b = Y + (l - X - Y) / 2 - (Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText) - Math.ceil(t.chartSpaceScale * a.legendSpaceRightText)) - (y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) - Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) / 2, 1 == a.legendBorders && (b -= Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceRight), O = b - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText));
                        break;
                    case 3:
                    case 4:
                        b = l - X - Math.ceil(t.chartSpaceScale * a.legendSpaceRightText) - y * (v + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal)) + Math.ceil(t.chartSpaceScale * a.legendSpaceBetweenTextHorizontal) / 2, 1 == a.legendBorders && (b -= Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 + Math.ceil(t.chartSpaceScale * a.legendBordersSpaceRight), O = b - Math.ceil(t.chartLineScale * a.legendBordersWidth) / 2 - Math.ceil(t.chartSpaceScale * a.legendSpaceLeftText)), 4 == a.legendPosX && (a.legendPosY >= 1 && a.legendPosY <= 3 || -2 == a.legendPosY) && (X += $, G -= $)
                }
                1 == a.legendBorders && (B += Math.ceil(t.chartSpaceScale * a.legendYPadding), O += Math.ceil(t.chartSpaceScale * a.legendXPadding)), I += Math.ceil(t.chartSpaceScale * a.legendYPadding), b += Math.ceil(t.chartSpaceScale * a.legendXPadding)
            }
        }
        if (xLabelWidth = 0, bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels, c && (a.xAxisBottom || a.xAxisTop)) {
            var ee, ae;
            0 == r ? (ee = C, ae = F, nblab = e.labels.length) : (ee = k, ae = E, nblab = n.length), "smart" == a.rotateLabels ? (U = 0, (availableWidth + Math.ceil(t.chartTextScale * a.xAxisSpaceBetweenLabels)) / nblab < ee + Math.ceil(t.chartTextScale * a.xAxisSpaceBetweenLabels) && (U = 45, availableWidth / nblab < Math.abs(Math.cos(U * Math.PI / 180) * ee) && (U = 90))) : (U = a.rotateLabels, 0 > U && (U = 0), U > 180 && (U = 180)), U > 90 && (U += 180), H = Math.abs(Math.sin(U * Math.PI / 180) * ee) + Math.abs(Math.sin((U + 90) * Math.PI / 180) * ae) + Math.ceil(t.chartSpaceScale * a.xAxisSpaceBefore) + Math.ceil(t.chartSpaceScale * a.xAxisSpaceAfter), _ = i - p - Math.ceil(t.chartSpaceScale * a.spaceBottom) - m - w - (H - Math.ceil(t.chartSpaceScale * a.xAxisSpaceBefore)) - Math.ceil(t.chartTextScale * a.graphSpaceAfter), xLabelWidth = Math.abs(Math.cos(U * Math.PI / 180) * ee) + Math.abs(Math.cos((U + 90) * Math.PI / 180) * ae), Y = Max([Y, p + Math.ceil(t.chartSpaceScale * a.spaceLeft) + xLabelWidth / 2]), X = Max([X, p + Math.ceil(t.chartSpaceScale * a.spaceRight) + xLabelWidth / 2]), availableWidth = l - Y - X, a.legend && a.xAxisBottom && 4 == a.legendPosY && (_ -= V), bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels + H;
        } else availableWidth = l - Y - X;
        if (availableHeight = i - topNotUsableSize - bottomNotUsableHeightWithXLabels, dispCrossImage(t, a, l / 2, i / 2, l / 2, i / 2, !1, e, -1, -1), "function" == typeof a.initFunction && a.initFunction("INITFUNCTION", t, e, null, -1, -1, {
                animationValue: 0,
                cntiter: 0,
                config: a,
                borderX: 0,
                borderY: 0,
                midPosX: 0,
                midPosY: 0
            }), "nihil" != n) {
            p > 0 && (t.save(), t.beginPath(), t.lineWidth = 2 * p, t.setLineDash(lineStyleFn(a.canvasBordersStyle)), t.strokeStyle = a.canvasBordersColor, t.moveTo(0, 0), t.lineTo(0, i), t.lineTo(l, i), t.lineTo(l, 0), t.lineTo(0, 0), t.stroke(), t.setLineDash([]), t.restore()), g > 0 && (t.save(), t.beginPath(), t.font = a.graphTitleFontStyle + " " + Math.ceil(t.chartTextScale * a.graphTitleFontSize).toString() + "px " + a.graphTitleFontFamily, t.fillStyle = a.graphTitleFontColor, t.textAlign = a.graphAlign, t.textBaseline = "bottom", setTextBordersAndBackground(t, a.graphTitle, Math.ceil(t.chartTextScale * a.graphTitleFontSize), a.graphPosX == undefined ? (Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight)) / 2) : a.graphPosX, f, a.graphTitleBorders, a.graphTitleBordersColor, Math.ceil(t.chartLineScale * a.graphTitleBordersWidth), Math.ceil(t.chartSpaceScale * a.graphTitleBordersXSpace), Math.ceil(t.chartSpaceScale * a.graphTitleBordersYSpace), a.graphTitleBordersStyle, a.graphTitleBackgroundColor, "GRAPHTITLE"), t.translate(a.graphPosX == undefined ? (Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight)) / 2) : a.graphPosX, f), t.fillTextMultiLine(a.graphTitle, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.graphTitleFontSize), !0, a.detectMouseOnText, t, "TITLE_TEXTMOUSE", 0, Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight)) / 2, f, -1, -1), t.stroke(), t.restore()), x > 0 && (t.save(), t.beginPath(), t.font = a.graphSubTitleFontStyle + " " + Math.ceil(t.chartTextScale * a.graphSubTitleFontSize).toString() + "px " + a.graphSubTitleFontFamily, t.fillStyle = a.graphSubTitleFontColor, t.textAlign = a.graphAlign, t.textBaseline = "bottom", setTextBordersAndBackground(t, a.graphSubTitle, Math.ceil(t.chartTextScale * a.graphSubTitleFontSize), a.graphPosX == undefined ? (Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight)) / 2) : a.graphPosX, A, a.graphSubTitleBorders, a.graphSubTitleBordersColor, Math.ceil(t.chartLineScale * a.graphSubTitleBordersWidth), Math.ceil(t.chartSpaceScale * a.graphSubTitleBordersXSpace), Math.ceil(t.chartSpaceScale * a.graphSubTitleBordersYSpace), a.graphSubTitleBordersStyle, a.graphSubTitleBackgroundColor, "GRAPHSUBTITLE"), t.translate(a.graphPosX == undefined ? (Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight)) / 2) : a.graphPosX, A), t.fillTextMultiLine(a.graphSubTitle, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.graphSubTitleFontSize), !0, a.detectMouseOnText, t, "SUBTITLE_TEXTMOUSE", 0, Math.ceil(t.chartSpaceScale * a.spaceLeft) + (l - Math.ceil(t.chartSpaceScale * a.spaceLeft) - Math.ceil(t.chartSpaceScale * a.spaceRight)) / 2, A, -1, -1), t.stroke(), t.restore()), P > 0 && (a.yAxisLeft && (t.save(), t.beginPath(), t.font = a.yAxisUnitFontStyle + " " + Math.ceil(t.chartTextScale * a.yAxisUnitFontSize).toString() + "px " + a.yAxisUnitFontFamily, t.fillStyle = a.yAxisUnitFontColor, t.textAlign = "center", t.textBaseline = "bottom", setTextBordersAndBackground(t, a.yAxisUnit, Math.ceil(t.chartTextScale * a.yAxisUnitFontSize), Y, T, a.yAxisUnitBorders, a.yAxisUnitBordersColor, Math.ceil(t.chartLineScale * a.yAxisUnitBordersWidth), Math.ceil(t.chartSpaceScale * a.yAxisUnitBordersXSpace), Math.ceil(t.chartSpaceScale * a.yAxisUnitBordersYSpace), a.yAxisUnitBordersStyle, a.yAxisUnitBackgroundColor, "YAXISUNIT"), t.translate(Y, T), t.fillTextMultiLine(a.yAxisUnit, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.yAxisUnitFontSize), !0, a.detectMouseOnText, t, "YLEFTAXISUNIT_TEXTMOUSE", 0, Y, T, -1, -1), t.stroke(), t.restore()), a.yAxisRight && ("" == a.yAxisUnit2 && (a.yAxisUnit2 = a.yAxisUnit), t.save(), t.beginPath(), t.font = a.yAxisUnitFontStyle + " " + Math.ceil(t.chartTextScale * a.yAxisUnitFontSize).toString() + "px " + a.yAxisUnitFontFamily, t.fillStyle = a.yAxisUnitFontColor, t.textAlign = "center", t.textBaseline = "bottom", setTextBordersAndBackground(t, a.yAxisUnit2, Math.ceil(t.chartTextScale * a.yAxisUnitFontSize), l - X, T, a.yAxisUnitBorders, a.yAxisUnitBordersColor, Math.ceil(t.chartLineScale * a.yAxisUnitBordersWidth), Math.ceil(t.chartSpaceScale * a.yAxisUnitBordersXSpace), Math.ceil(t.chartSpaceScale * a.yAxisUnitBordersYSpace), a.yAxisUnitBordersStyle, a.yAxisUnitBackgroundColor, "YAXISUNIT"), t.translate(l - X, T), t.fillTextMultiLine(a.yAxisUnit2, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.yAxisUnitFontSize), !0, a.detectMouseOnText, t, "YRIGHTAXISUNIT_TEXTMOUSE", 0, l - X, T, -1, -1), t.stroke(), t.restore())), R > 0 && (a.yAxisLeft && (t.save(), t.beginPath(), t.font = a.yAxisFontStyle + " " + Math.ceil(t.chartTextScale * a.yAxisFontSize).toString() + "px " + a.yAxisFontFamily, t.fillStyle = a.yAxisFontColor, t.textAlign = "center", t.textBaseline = "bottom", t.translate(N, topNotUsableSize + availableHeight / 2), t.rotate(-(90 * (Math.PI / 180))), setTextBordersAndBackground(t, a.yAxisLabel, Math.ceil(t.chartTextScale * a.yAxisFontSize), 0, 0, a.yAxisLabelBorders, a.yAxisLabelBordersColor, Math.ceil(t.chartLineScale * a.yAxisLabelBordersWidth), Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersXSpace), Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersYSpace), a.yAxisLabelBordersStyle, a.yAxisLabelBackgroundColor, "YAXISLABELLEFT"), t.fillTextMultiLine(a.yAxisLabel, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.yAxisFontSize), !1, a.detectMouseOnText, t, "YLEFTAXISLABEL_TEXTMOUSE", -(90 * (Math.PI / 180)), N, topNotUsableSize + availableHeight / 2, -1, -1), t.stroke(), t.restore()), a.yAxisRight && ("" == a.yAxisLabel2 && (a.yAxisLabel2 = a.yAxisLabel), t.save(), t.beginPath(), t.font = a.yAxisFontStyle + " " + Math.ceil(t.chartTextScale * a.yAxisFontSize).toString() + "px " + a.yAxisFontFamily, t.fillStyle = a.yAxisFontColor, t.textAlign = "center", t.textBaseline = "bottom", t.translate(G, topNotUsableSize + availableHeight / 2), t.rotate(+(90 * (Math.PI / 180))), setTextBordersAndBackground(t, a.yAxisLabel2, Math.ceil(t.chartTextScale * a.yAxisFontSize), 0, 0, a.yAxisLabelBorders, a.yAxisLabelBordersColor, Math.ceil(t.chartLineScale * a.yAxisLabelBordersWidth), Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersXSpace), Math.ceil(t.chartSpaceScale * a.yAxisLabelBordersYSpace), a.yAxisLabelBordersStyle, a.yAxisLabelBackgroundColor, "YAXISLABELLEFT"), t.fillTextMultiLine(a.yAxisLabel2, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.yAxisFontSize), !1, a.detectMouseOnText, t, "YRIGHTAXISLABEL_TEXTMOUSE", +(90 * (Math.PI / 180)), G, topNotUsableSize + availableHeight / 2, -1, -1), t.stroke(), t.restore())), w > 0 && a.xAxisBottom && (t.save(), t.beginPath(), t.font = a.xAxisFontStyle + " " + Math.ceil(t.chartTextScale * a.xAxisFontSize).toString() + "px " + a.xAxisFontFamily, t.fillStyle = a.xAxisFontColor, t.textAlign = "center", t.textBaseline = "bottom", setTextBordersAndBackground(t, a.xAxisLabel, Math.ceil(t.chartTextScale * a.xAxisFontSize), Y + availableWidth / 2, S, a.xAxisLabelBorders, a.xAxisLabelBordersColor, Math.ceil(t.chartLineScale * a.xAxisLabelBordersWidth), Math.ceil(t.chartSpaceScale * a.xAxisLabelBordersXSpace), Math.ceil(t.chartSpaceScale * a.xAxisLabelBordersYSpace), a.xAxisLabelBordersStyle, a.xAxisLabelBackgroundColor, "XAXISLABEL"), t.translate(Y + availableWidth / 2, S), t.fillTextMultiLine(a.xAxisLabel, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.xAxisFontSize), !0, a.detectMouseOnText, t, "XAXISLABEL_TEXTMOUSE", 0, Y + availableWidth / 2, S, -1, -1), t.stroke(), t.restore());
            var te;
            L > 1 || 1 == L && a.showSingleLegend ? (te = {
                dispLegend: !0,
                xLegendBorderPos: O,
                yLegendBorderPos: B,
                legendBorderWidth: j,
                legendBorderHeight: J,
                nbLegendCols: y,
                xFirstLegendTextPos: b,
                yFirstLegendTextPos: I,
                drawLegendOnData: h,
                reverseLegend: s,
                legendBox: d,
                widestLegend: v
            }, (0 == a.legendPosY || 4 == a.legendPosY || 0 == a.legendPosX || 4 == a.legendPosX) && (drawLegend(te, e, a, t, u), te = {
                dispLegend: !1
            })) : te = {
                dispLegend: !1
            }, "" != a.footNote.trim() && (t.save(), t.font = a.footNoteFontStyle + " " + Math.ceil(t.chartTextScale * a.footNoteFontSize).toString() + "px " + a.footNoteFontFamily, t.fillStyle = a.footNoteFontColor, t.textAlign = "center", t.textBaseline = "bottom", setTextBordersAndBackground(t, a.footNote, Math.ceil(t.chartTextScale * a.footNoteFontSize), Y + availableWidth / 2, M, a.footNoteBorders, a.footNoteBordersColor, Math.ceil(t.chartLineScale * a.footNoteBordersWidth), Math.ceil(t.chartSpaceScale * a.footNoteBordersXSpace), Math.ceil(t.chartSpaceScale * a.footNoteBordersYSpace), a.footNoteBordersStyle, a.footNoteBackgroundColor, "FOOTNOTE"), t.translate(Y + availableWidth / 2, M), t.fillTextMultiLine(a.footNote, 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.footNoteFontSize), !0, a.detectMouseOnText, t, "FOOTNOTE_TEXTMOUSE", 0, Y + availableWidth / 2, M, -1, -1), t.stroke(), t.restore())
        }

        return clrx = Y, clrwidth = availableWidth, clry = topNotUsableSize, clrheight = availableHeight, {
            leftNotUsableSize: Y,
            rightNotUsableSize: X,
            availableWidth: availableWidth,
            topNotUsableSize: topNotUsableSize,
            bottomNotUsableHeightWithoutXLabels: bottomNotUsableHeightWithoutXLabels,
            bottomNotUsableHeightWithXLabels: bottomNotUsableHeightWithXLabels,
            availableHeight: availableHeight,
            widestXLabel: C,
            highestXLabel: F,
            widestYLabel: k,
            widestYLabel2: z,
            highestYLabel: E,
            rotateLabels: U,
            xLabelPos: _,
            clrx: clrx,
            clry: clry,
            clrwidth: clrwidth,
            clrheight: clrheight,
            legendMsr: te
        }
    }

    function drawLinesDataset(e, a, t, i, l, n) {
        function o(e, n, o, s) {
            0 == setOptionValue(1, "LINKTYPE", i, a, l, a.datasets[s].linkType, t.linkType, s, L, {
                nullvalue: null
            }) && setOptionValue(1, "BEZIERCURVE", i, a, l, void 0, t.bezierCurve, s, -1, {
                nullValue: !0
            }) && (e.length = 0, e.push(n), e.push(o)), m = o
        }

        function s(e, a, t, i) {
            var yposOrigin;
            return yposOrigin = "undefined", "undefined" != typeof i[e][a].yPosOffsetOrigin && (yposOrigin = i[e][a].yAxisPos - A.mainVal * i[e][a].yPosOffsetOrigin), yposOrigin
        }

        function r(e, a, t, i, l, n, o, s, r) {
            0 == setOptionValue(1, "LINKTYPE", a, n, o, n.datasets[s].linkType, l.linkType, s, L, {
                nullvalue: null
            }) && setOptionValue(1, "BEZIERCURVE", a, n, o, void 0, l.bezierCurve, s, -1, {
                nullValue: !0
            }) ? (e.push(t), e.push(i)) : 0 == setOptionValue(1, "LINKTYPE", a, n, o, n.datasets[s].linkType, l.linkType, s, L, {
                nullvalue: null
            }) ? a.lineTo(t, i) : 1 == setOptionValue(1, "LINKTYPE", a, n, o, n.datasets[s].linkType, l.linkType, s, L, {
                nullvalue: null
            }) ? ("undefined" != r ? a.moveTo(t, r) : a.moveTo(t, o[s][0].xAxisPosY - o[s][0].zeroY), a.lineTo(t, i)) : 2 == setOptionValue(1, "LINKTYPE", a, n, o, n.datasets[s].linkType, l.linkType, s, L, {
                nullvalue: null
            }) && "undefined" != typeof m && (a.lineTo(t, m), a.lineTo(t, i), m = i)
        }

        function c(e, t, i, n) {
            var minimumpos, maximumpos;
            0 == setOptionValue(1, "LINKTYPE", t, a, l, a.datasets[n].linkType, i.linkType, n, L, {
                nullvalue: null
            }) && setOptionValue(1, "BEZIERCURVE", t, a, l, void 0, i.bezierCurve, n, -1, {
                nullValue: !0
            }) && (minimumpos = l[n][0].xAxisPosY, maximumpos = l[n][0].xAxisPosY - l[n][0].calculatedScale.steps * l[n][0].scaleHop, d(t, e, setOptionValue(1, "BEZIERCURVETENSION", t, a, l, void 0, i.bezierCurveTension, n, -1, {
                nullValue: !0
            }), minimumpos, maximumpos), e.length = 0), m = void 0
        }

        function h(e, a, t, i, l, n, o) {
            var s = Math.sqrt(Math.pow(t - e, 2) + Math.pow(i - a, 2)),
                r = Math.sqrt(Math.pow(l - t, 2) + Math.pow(n - i, 2)),
                c = o * s / (s + r),
                h = o - c,
                d = t + c * (e - l),
                u = i + c * (a - n),
                p = t - h * (e - l),
                S = i - h * (a - n);
            return [d, u, p, S]
        }

        function d(e, i, n, o, s) {
            var r = [],
                c = i.length;
            if (i.push(2 * i[c - 2] - i[c - 4]), i.push(2 * i[c - 1] - i[c - 3]), 4 == c) {
            }

            if(t.bezierCurveTension !== 0) {
                for (var d = 0; c - 2 > d; d += 2) {
                    r = r.concat(h(i[d], i[d + 1], i[d + 2], i[d + 3], i[d + 4], i[d + 5], n));
                }
                for (e.beginPath(), e.strokeStyle = setOptionValue(1, "STROKECOLOR", e, a, l, a.datasets[P].strokeColor, t.defaultStrokeColor, P, L, {
                    nullvalue: null
                }), e.lineWidth = Math.ceil(e.chartLineScale * setOptionValue(1, "LINEWIDTH", e, a, l, a.datasets[P].datasetStrokeWidth, t.datasetStrokeWidth, P, L, {
                        nullvalue: null
                    })), e.moveTo(i[0], i[1]), e.quadraticCurveTo(r[0], Math.max(Math.min(r[1], o), s), i[2], i[3]), e.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", e, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                    nullvalue: null
                }))), d = 2; d < i.length - 4; d += 2) {
                    u = Math.max(Math.min(r[2 * d - 1], o), s), p = Math.max(Math.min(r[2 * d + 1], o), s), e.bezierCurveTo(r[2 * d - 2], u, r[2 * d], p, i[d + 2], i[d + 3]);
                }
            } else {
                e.beginPath();
                e.strokeStyle = setOptionValue(1, "STROKECOLOR", e, a, l, a.datasets[P].strokeColor, t.defaultStrokeColor, P, L, { nullvalue: null });
                e.lineWidth = Math.ceil(e.chartLineScale * setOptionValue(1, "LINEWIDTH", e, a, l, a.datasets[P].datasetStrokeWidth, t.datasetStrokeWidth, P, L, { nullvalue: null }));
                e.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", e, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, { nullvalue: null })));
                e.moveTo(i[0], i[1])
                for (d = 2; d < i.length - 2; d += 2) {
                    e.lineTo(i[d], i[d + 1]);
                }
            }
            e.stroke();
        }

        for (var u, p, S, g, f, x, A, m, M = [], P = 0; P < a.datasets.length; P++)
            if (1 == setOptionValue(1, "ANIMATION", i, a, l, a.datasets[P].animation, t.animation, P, -1, { nullvalue: null }) || e >= 1) {
                if (m = "undefined", "Line" != l[P][0].tpchart) continue;
                if (0 == l[P].length) continue;
                if (-1 == l[P][0].firstNotMissing) continue;
                i.save(), i.beginPath();
                var prevAnimPc = {
                    mainVal: 0,
                    subVal: 0,
                    animVal: 0
                };
                for (var T = -1, v = -1, L = l[P][0].firstNotMissing; L <= l[P][0].lastNotMissing; L++)
                    if (!(0 == prevAnimPc.animVal && L > l[P][0].firstNotMissing))
                        if (A = animationCorrection(e, a, t, P, L, 0), 0 == A.mainVal && prevAnimPc.mainVal > 0 && -1 != T) i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                            nullvalue: null
                        }))), i.stroke(), i.setLineDash([]), t.extrapolateMissingData ? (u = l[P][l[P][L].prevNotMissing].yAxisPos - prevAnimPc.mainVal * l[P][l[P][L].prevNotMissing].yPosOffset, p = l[P][L].yAxisPos - prevAnimPc.mainVal * l[P][l[P][L - 1].nextNotMissing].yPosOffset, g = l[P][L - 1].nextNotMissing - l[P][L].prevNotMissing, f = L - 1 - l[P][L].prevNotMissing, x = (f + prevAnimPc.subVal) / g, S = u + x * (p - u), r(M, i, l[P][l[P][L].prevNotMissing].xPos + x * (l[P][l[P][L - 1].nextNotMissing].xPos - l[P][l[P][L].prevNotMissing].xPos), S, t, a, l, P, s(P, L, a, l)), c(M, i, t, P), i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                            nullvalue: null
                        }))), i.stroke(), i.setLineDash([]), i.strokeStyle = "rgba(0,0,0,0)", a.datasets[P].datasetFill && 1 != setOptionValue(1, "LINKTYPE", i, a, l, a.datasets[P].linkType, t.linkType, P, L, {
                            nullvalue: null
                        }) && (i.lineTo(l[P][l[P][L].prevNotMissing].xPos + x * (l[P][l[P][L - 1].nextNotMissing].xPos - l[P][l[P][L].prevNotMissing].xPos), l[P][L].yAxisPos), i.lineTo(l[P][T].xPos, l[P][T].xAxisPosY - l[P][0].zeroY), i.closePath(), i.fillStyle = setOptionValue(1, "COLOR", i, a, l, a.datasets[P].fillColor, t.defaultFillColor, P, L, {
                            animationValue: A.mainVal,
                            xPosLeft: l[P][0].xPos,
                            yPosBottom: Math.max(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lminvalue_offset),
                            xPosRight: l[P][a.datasets[P].data.length - 1].xPos,
                            yPosTop: Math.min(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lmaxvalue_offset)
                        }), i.fill(), T = -1)) : "undefined" != typeof l[P][L].value && (r(M, i, l[P][L - 1].xPos + prevAnimPc.subVal * (l[P][L].xPos - l[P][L - 1].xPos), l[P][L].yAxisPos - prevAnimPc.mainVal * l[P][l[P][L - 1].nextNotMissing].yPosOffset, t, a, l, P, s(P, L, a, l)), c(M, i, t, P), i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                            nullvalue: null
                        }))), i.stroke(), i.setLineDash([]), i.strokeStyle = "rgba(0,0,0,0)", t.datasetFill && 1 != setOptionValue(1, "LINKTYPE", i, a, l, a.datasets[P].linkType, t.linkType, P, L, {
                            nullvalue: null
                        }) && (i.lineTo(l[P][L - 1].xPos + prevAnimPc.subVal * (l[P][L].xPos - l[P][L - 1].xPos), l[P][L].yAxisPos), i.lineTo(l[P][T].xPos, l[P][T].xAxisPosY - l[P][0].zeroY), i.closePath(), i.fillStyle = setOptionValue(1, "COLOR", i, a, l, a.datasets[P].fillColor, t.defaultFillColor, P, L, {
                            animationValue: A.mainVal,
                            xPosLeft: l[P][0].xPos,
                            yPosBottom: Math.max(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lminvalue_offset),
                            xPosRight: l[P][a.datasets[P].data.length - 1].xPos,
                            yPosTop: Math.min(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lmaxvalue_offset)
                        }), i.fill())), prevAnimPc = A;
                        else switch (0 == A.totVal ? (i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                            nullvalue: null
                        }))), i.stroke(), i.setLineDash([]), i.strokeStyle = "rgba(0,0,0,0)") : (i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                            nullvalue: null
                        }))), i.stroke(), i.setLineDash([]), i.strokeStyle = setOptionValue(1, "STROKECOLOR", i, a, l, a.datasets[P].strokeColor, t.defaultStrokeColor, P, L, {
                            nullvalue: null
                        })), prevAnimPc = A, typeof a.datasets[P].data[L]) {
                            case "undefined":
                                if (t.extrapolateMissingData) A.subVal > 0 && (v = l[P][L].xPos + A.subVal * (l[P][L + 1].xPos - l[P][L].xPos), u = l[P][l[P][L + 1].prevNotMissing].yAxisPos - l[P][l[P][L + 1].prevNotMissing].yPosOffset, p = l[P][l[P][L].nextNotMissing].yAxisPos - l[P][l[P][L].nextNotMissing].yPosOffset, g = l[P][L].nextNotMissing - l[P][L + 1].prevNotMissing, f = L - l[P][L + 1].prevNotMissing, x = (f + prevAnimPc.subVal) / g, S = u + x * (p - u), r(M, i, l[P][l[P][L].prevNotMissing].xPos + x * (l[P][l[P][L - 1].nextNotMissing].xPos - l[P][l[P][L].prevNotMissing].xPos), S, t, a, l, P, s(P, L, a, l)));
                                else {
                                    if (-1 == T) continue;
                                    c(M, i, t, P), i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                                        nullvalue: null
                                    }))), i.stroke(), i.setLineDash([]), a.datasets[P].datasetFill && -1 != T && 1 != setOptionValue(1, "LINKTYPE", i, a, l, a.datasets[P].linkType, t.linkType, P, L, {
                                        nullvalue: null
                                    }) && (v = -1, i.strokeStyle = "rgba(0,0,0,0)", i.lineTo(l[P][L - 1].xPos, l[P][L - 1].yAxisPos), i.lineTo(l[P][T].xPos, l[P][T].yAxisPos), i.closePath(), i.fillStyle = setOptionValue(1, "COLOR", i, a, l, a.datasets[P].fillColor, t.defaultFillColor, P, L, {
                                        animationValue: A.mainVal,
                                        xPosLeft: l[P][0].xPos,
                                        yPosBottom: Math.max(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lminvalue_offset),
                                        xPosRight: l[P][a.datasets[P].data.length - 1].xPos,
                                        yPosTop: Math.min(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lmaxvalue_offset)
                                    }), i.fill()), i.beginPath(), prevAnimPc = {
                                        mainVal: 0,
                                        subVal: 0
                                    }, T = -1
                                }
                                break;
                            default:
                                i.lineWidth = Math.ceil(i.chartLineScale * setOptionValue(1, "LINEWIDTH", i, a, l, a.datasets[P].datasetStrokeWidth, t.datasetStrokeWidth, P, L, {
                                        nullvalue: null
                                    })), -1 == T ? (T = L, i.beginPath(), 1 == setOptionValue(1, "LINKTYPE", i, a, l, a.datasets[P].linkType, t.linkType, P, L, {
                                    nullvalue: null
                                }) ? ("undefined" != typeof l[P][L].yPosOffsetOrigin ? i.moveTo(l[P][L].xPos, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffsetOrigin) : i.moveTo(l[P][T].xPos, l[P][T].xAxisPosY - l[P][0].zeroY), i.lineTo(l[P][L].xPos, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset)) : i.moveTo(l[P][L].xPos, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset), o(M, l[P][L].xPos, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset, P), v = l[P][L].xPos) : (v = l[P][L].xPos, r(M, i, l[P][L].xPos, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset, t, a, l, P, s(P, L, a, l))), A.subVal > 0 && -1 != l[P][L].nextNotMissing && (t.extrapolateMissing || l[P][L].nextNotMissing == L + 1) && (v = l[P][L].xPos + A.subVal * (l[P][L + 1].xPos - l[P][L].xPos), u = l[P][l[P][L + 1].prevNotMissing].yAxisPos - l[P][l[P][L + 1].prevNotMissing].yPosOffset, p = l[P][l[P][L].nextNotMissing].yAxisPos - l[P][l[P][L].nextNotMissing].yPosOffset, S = u + A.subVal * (p - u), r(M, i, l[P][L].xPos + A.subVal * (l[P][l[P][L].nextNotMissing].xPos - l[P][L].xPos), S, t, a, l, P, s(P, L, a, l)))

                                if ("undefined" != typeof a.datasets[P].data[L] && (A = animationCorrection(e, a, t, P, L, 0), A.mainVal > 0 || !t.animationLeftToRight)) {
                                    i.beginPath(), i.fillStyle = setOptionValue(1, "MARKERFILLCOLOR", i, a, l, a.datasets[P].pointColor, t.defaultStrokeColor, P, L, {
                                        nullvalue: !0
                                    }), i.strokeStyle = setOptionValue(1, "MARKERSTROKESTYLE", i, a, l, a.datasets[P].pointStrokeColor, t.defaultStrokeColor, P, L, {
                                        nullvalue: !0
                                    }), i.lineWidth = setOptionValue(i.chartLineScale, "MARKERLINEWIDTH", i, a, l, a.datasets[P].pointDotStrokeWidth, t.pointDotStrokeWidth, P, L, {
                                        nullvalue: !0
                                    });
                                    var D = setOptionValue(1, "MARKERSHAPE", i, a, l, a.datasets[P].markerShape, t.markerShape, P, L, {
                                            nullvalue: !0
                                        }),
                                        y = setOptionValue(i.chartSpaceScale, "MARKERRADIUS", i, a, l, a.datasets[P].pointDotRadius, t.pointDotRadius, P, L, {
                                            nullvalue: !0
                                        }),
                                        V = setOptionValue(1, "MARKERSTROKESTYLE", i, a, l, a.datasets[P].pointDotStrokeStyle, t.pointDotStrokeStyle, P, L, {
                                            nullvalue: !0
                                        });
                                    drawMarker(i, l[P][L].xPos, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset, D, y, V)
                                }
                        }
                if (c(M, i, t, P), i.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", i, a, l, a.datasets[P].datasetStrokeStyle, t.datasetStrokeStyle, P, L, {
                        nullvalue: null
                    }))), a.datasets[P].datasetFill && T >= 0 && (i.strokeStyle = "rgba(0,0,0,0)", i.lineTo(v, l[P][0].xAxisPosY - l[P][0].zeroY), i.lineTo(l[P][T].xPos, l[P][T].xAxisPosY - l[P][0].zeroY), i.closePath(), i.fillStyle = setOptionValue(1, "COLOR", i, a, l, a.datasets[P].fillColor, t.defaultFillColor, P, -1, {
                        animationValue: A.mainVal,
                        xPosLeft: l[P][0].xPos,
                        yPosBottom: Math.max(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lminvalue_offset),
                        xPosRight: l[P][a.datasets[P].data.length - 1].xPos,
                        yPosTop: Math.min(l[P][0].yAxisPos, l[P][0].yAxisPos - (t.animationLeftToRight ? 1 : 1 * A.mainVal) * l[P][0].lmaxvalue_offset)
                    }), i.fill()), i.restore(), t.pointDot && e >= 1)
                    if (e >= t.animationStopValue)
                        for (L = 0; L < a.datasets[P].data.length; L++)
                            if ("undefined" != typeof a.datasets[P].data[L] && (jsGraphAnnotate[i.ChartNewId][jsGraphAnnotate[i.ChartNewId].length] = ["POINT", P, L, l, setOptionValue(1, "ANNOTATEDISPLAY", i, a, l, a.datasets[P].annotateDisplay, t.annotateDisplay, P, L, {
                                    nullValue: !0
                                })], setOptionValue(1, "INGRAPHDATASHOW", i, a, l, a.datasets[P].inGraphDataShow, t.inGraphDataShow, P, L, {
                                    nullValue: !0
                                }))) {
                                i.save(), i.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", i, a, l, void 0, t.inGraphDataAlign, P, L, {
                                    nullValue: !0
                                }), i.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", i, a, l, void 0, t.inGraphDataVAlign, P, L, {
                                    nullValue: !0
                                }), i.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", i, a, l, void 0, t.inGraphDataFontStyle, P, L, {
                                        nullValue: !0
                                    }) + " " + setOptionValue(i.chartTextScale, "INGRAPHDATAFONTSIZE", i, a, l, void 0, t.inGraphDataFontSize, P, L, {
                                        nullValue: !0
                                    }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", i, a, l, void 0, t.inGraphDataFontFamily, P, L, {
                                        nullValue: !0
                                    }), i.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", i, a, l, void 0, t.inGraphDataFontColor, P, L, {
                                    nullValue: !0
                                });
                                var b = setOptionValue(i.chartSpaceScale, "INGRAPHDATAPADDINGX", i, a, l, void 0, t.inGraphDataPaddingX, P, L, {
                                        nullValue: !0
                                    }),
                                    I = setOptionValue(i.chartSpaceScale, "INGRAPHDATAPADDINGY", i, a, l, void 0, t.inGraphDataPaddingY, P, L, {
                                        nullValue: !0
                                    }),
                                    O = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", i, a, l, void 0, t.inGraphDataTmpl, P, L, {
                                        nullValue: !0
                                    }), l[P][L], t);
                                i.translate(l[P][L].xPos + b, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset - I);
                                var B = setOptionValue(1, "INGRAPHDATAROTATE", i, a, l, void 0, t.inGraphDataRotate, P, L, {
                                        nullValue: !0
                                    }) * (Math.PI / 180);
                                i.rotate(B), setTextBordersAndBackground(i, O, setOptionValue(i.chartTextScale, "INGRAPHDATAFONTSIZE", i, a, l, void 0, t.inGraphDataFontSize, P, L, {
                                    nullValue: !0
                                }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", i, a, l, void 0, t.inGraphDataBorders, P, L, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", i, a, l, void 0, t.inGraphDataBordersColor, P, L, {
                                    nullValue: !0
                                }), setOptionValue(i.chartLineScale, "INGRAPHDATABORDERSWIDTH", i, a, l, void 0, t.inGraphDataBordersWidth, P, L, {
                                    nullValue: !0
                                }), setOptionValue(i.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", i, a, l, void 0, t.inGraphDataBordersXSpace, P, L, {
                                    nullValue: !0
                                }), setOptionValue(i.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", i, a, l, void 0, t.inGraphDataBordersYSpace, P, L, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", i, a, l, void 0, t.inGraphDataBordersStyle, P, L, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", i, a, l, void 0, t.inGraphDataBackgroundColor, P, L, {
                                    nullValue: !0
                                }), "INGRAPHDATA"), i.fillTextMultiLine(O, 0, 0, i.textBaseline, setOptionValue(i.chartTextScale, "INGRAPHDATAFONTSIZE", i, a, l, void 0, t.inGraphDataFontSize, P, L, {
                                    nullValue: !0
                                }), !0, t.detectMouseOnText, i, "INGRAPHDATA_TEXTMOUSE", B, l[P][L].xPos + b, l[P][L].yAxisPos - A.mainVal * l[P][L].yPosOffset - I, P, L), i.restore()
                            }
            }
        i.setLineDash([])
    }

    function log10(e) {
        return Math.log(e) / Math.LN10
    }

    function setRect(e, a) {
        a.clearRect ? a.multiGraph || (clear(e), e.clearRect(0, 0, width, height)) : (clear(e), e.clearRect(0, 0, width, height), e.fillStyle = a.savePngBackgroundColor, e.strokeStyle = a.savePngBackgroundColor, e.beginPath(), e.moveTo(0, 0), e.lineTo(0, e.canvas.height), e.lineTo(e.canvas.width, e.canvas.height), e.lineTo(e.canvas.width, 0), e.lineTo(0, 0), e.stroke(), e.fill())
    }

    function chartJsMouseDown(e, a, t, i, l) {
        1 == e.which && "function" == typeof t.mouseDownLeft ? t.mouseDownLeft(e, a, t, i, l) : 2 == e.which && "function" == typeof t.mouseDownMiddle ? t.mouseDownMiddle(e, a, t, i, l) : 3 == e.which && "function" == typeof t.mouseDownRight && t.mouseDownRight(e, a, t, i, l)
    }

    function chartJsMouseUp(e, a, t, i, l) {
        1 == e.which && "function" == typeof t.mouseUpLeft ? t.mouseUpLeft(e, a, t, i, l) : 2 == e.which && "function" == typeof t.mouseUpMiddle ? t.mouseUpMiddle(e, a, t, i, l) : 3 == e.which && "function" == typeof t.mouseUpRight && t.mouseUpRight(e, a, t, i, l)
    }

    function chartJsMouseWheel(e, a, t, i, l) {
        1 == e.which && "function" == typeof t.mouseWheel ? t.mouseWheel(e, a, t, i, l) : "";
    }

    function defMouse(e, a, t) {
        function i(i, l, n) {
            function o(i) {
                (null == n || n(i)) && doMouseAction(t, e, i, a, "mouseaction", l)
            }
            if ("function" == typeof l) {
                var s = i + " " + l.name;
                s in e._eventListeners && (e.canvas.removeEventListener ? e.canvas.removeEventListener(i, e._eventListeners[s]) : e.canvas.detachEvent && e.canvas.detachEvent(i, e._eventListeners[s])), e._eventListeners[s] = o, e.canvas.addEventListener ? ("mousewheel" == i, e.canvas.addEventListener(i, o, !1)) : e.canvas.attachEvent && e.canvas.attachEvent("on" + i, o)
            }
        }
        isBooleanOptionTrue(void 0, t.annotateDisplay) && (0 == cursorDivCreated && (oCursor = new makeCursorObj("divCursor")), isIE() < 9 && 0 != isIE() ? e.canvas.attachEvent("on" + t.annotateFunction.split(" ")[0], function(i) {
            ("left" == t.annotateFunction.split(" ")[1] && 1 == i.which || "middle" == t.annotateFunction.split(" ")[1] && 2 == i.which || "right" == t.annotateFunction.split(" ")[1] && 3 == i.which || "string" != typeof t.annotateFunction.split(" ")[1]) && doMouseAction(t, e, i, a, "annotate", t.mouseDownRight)
        }) : e.canvas.addEventListener(t.annotateFunction.split(" ")[0], function(i) {
            ("left" == t.annotateFunction.split(" ")[1] && 1 == i.which || "middle" == t.annotateFunction.split(" ")[1] && 2 == i.which || "right" == t.annotateFunction.split(" ")[1] && 3 == i.which || "string" != typeof t.annotateFunction.split(" ")[1]) && doMouseAction(t, e, i, a, "annotate", t.mouseDownRight)
        }, !1)), t.savePng && (isIE() < 9 && 0 != isIE() ? e.canvas.attachEvent("on" + t.savePngFunction.split(" ")[0], function(i) {
            ("left" == t.savePngFunction.split(" ")[1] && 1 == i.which || "middle" == t.savePngFunction.split(" ")[1] && 2 == i.which || "right" == t.savePngFunction.split(" ")[1] && 3 == i.which || "string" != typeof t.savePngFunction.split(" ")[1]) && saveCanvas(e, a, t)
        }) : e.canvas.addEventListener(t.savePngFunction.split(" ")[0], function(i) {
            ("left" == t.savePngFunction.split(" ")[1] && 1 == i.which || "middle" == t.savePngFunction.split(" ")[1] && 2 == i.which || "right" == t.savePngFunction.split(" ")[1] && 3 == i.which || "string" != typeof t.savePngFunction.split(" ")[1]) && saveCanvas(e, a, t)
        }, !1)), isIE() < 9 && 0 != isIE() ? e.canvas.attachEvent("onmousewheel", function(e) {
            cursorDivCreated && (document.getElementById("divCursor").style.display = "none")
        }) : e.canvas.addEventListener("DOMMouseScroll", function(e) {
            cursorDivCreated && (document.getElementById("divCursor").style.display = "none")
        }, !1), "function" == typeof t.mouseDownRight ? i("mousedown", chartJsMouseDown, function(e) {
            return 1 == e.which || 2 == e.which || 3 == e.which
        }) : "function" == typeof t.mouseDownLeft ? i("mousedown", chartJsMouseDown, function(e) {
            return 1 == e.which || 2 == e.which || 3 == e.which
        }) : "function" == typeof t.mouseDownMiddle && i("mousedown", chartJsMouseDown, function(e) {
            return 1 == e.which || 2 == e.which || 3 == e.which
        }), i("mousemove", t.mouseMove), i("mouseout", t.mouseOut), i("mousewheel", chartJsMouseWheel), i("mouseup", chartJsMouseUp)
    }
    var chart = this,
        animationOptions = {
            linear: function(e) {
                return e
            },
            easeInQuad: function(e) {
                return e * e
            },
            easeOutQuad: function(e) {
                return -1 * e * (e - 2)
            },
            easeInOutQuad: function(e) {
                return (e /= .5) < 1 ? .5 * e * e : -0.5 * (--e * (e - 2) - 1)
            },
            easeInCubic: function(e) {
                return e * e * e
            },
            easeOutCubic: function(e) {
                return 1 * ((e = e / 1 - 1) * e * e + 1)
            },
            easeInOutCubic: function(e) {
                return (e /= .5) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2)
            },
            easeInQuart: function(e) {
                return e * e * e * e
            },
            easeOutQuart: function(e) {
                return -1 * ((e = e / 1 - 1) * e * e * e - 1)
            },
            easeInOutQuart: function(e) {
                return (e /= .5) < 1 ? .5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2)
            },
            easeInQuint: function(e) {
                return 1 * (e /= 1) * e * e * e * e
            },
            easeOutQuint: function(e) {
                return 1 * ((e = e / 1 - 1) * e * e * e * e + 1)
            },
            easeInOutQuint: function(e) {
                return (e /= .5) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2)
            },
            easeInSine: function(e) {
                return -1 * Math.cos(e / 1 * (Math.PI / 2)) + 1
            },
            easeOutSine: function(e) {
                return 1 * Math.sin(e / 1 * (Math.PI / 2))
            },
            easeInOutSine: function(e) {
                return -0.5 * (Math.cos(Math.PI * e / 1) - 1)
            },
            easeInExpo: function(e) {
                return 0 == e ? 1 : 1 * Math.pow(2, 10 * (e / 1 - 1))
            },
            easeOutExpo: function(e) {
                return 1 == e ? 1 : 1 * (-Math.pow(2, -10 * e / 1) + 1)
            },
            easeInOutExpo: function(e) {
                return 0 == e ? 0 : 1 == e ? 1 : (e /= .5) < 1 ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (-Math.pow(2, -10 * --e) + 2)
            },
            easeInCirc: function(e) {
                return e >= 1 ? e : -1 * (Math.sqrt(1 - (e /= 1) * e) - 1)
            },
            easeOutCirc: function(e) {
                return 1 * Math.sqrt(1 - (e = e / 1 - 1) * e)
            },
            easeInOutCirc: function(e) {
                return (e /= .5) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
            },
            easeInElastic: function(e) {
                var a = 1.70158,
                    t = 0,
                    i = 1;
                return 0 == e ? 0 : 1 == (e /= 1) ? 1 : (t || (t = .3), i < Math.abs(1) ? (i = 1, a = t / 4) : a = t / (2 * Math.PI) * Math.asin(1 / i), -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin((1 * e - a) * (2 * Math.PI) / t)))
            },
            easeOutElastic: function(e) {
                var a = 1.70158,
                    t = 0,
                    i = 1;
                return 0 == e ? 0 : 1 == (e /= 1) ? 1 : (t || (t = .3), i < Math.abs(1) ? (i = 1, a = t / 4) : a = t / (2 * Math.PI) * Math.asin(1 / i), i * Math.pow(2, -10 * e) * Math.sin((1 * e - a) * (2 * Math.PI) / t) + 1)
            },
            easeInOutElastic: function(e) {
                var a = 1.70158,
                    t = 0,
                    i = 1;
                return 0 == e ? 0 : 2 == (e /= .5) ? 1 : (t || (t = 1 * (.3 * 1.5)), i < Math.abs(1) ? (i = 1, a = t / 4) : a = t / (2 * Math.PI) * Math.asin(1 / i), 1 > e ? -.5 * (i * Math.pow(2, 10 * (e -= 1)) * Math.sin((1 * e - a) * (2 * Math.PI) / t)) : i * Math.pow(2, -10 * (e -= 1)) * Math.sin((1 * e - a) * (2 * Math.PI) / t) * .5 + 1)
            },
            easeInBack: function(e) {
                var a = 1.70158;
                return 1 * (e /= 1) * e * ((a + 1) * e - a)
            },
            easeOutBack: function(e) {
                var a = 1.70158;
                return 1 * ((e = e / 1 - 1) * e * ((a + 1) * e + a) + 1)
            },
            easeInOutBack: function(e) {
                var a = 1.70158;
                return (e /= .5) < 1 ? .5 * (e * e * (((a *= 1.525) + 1) * e - a)) : .5 * ((e -= 2) * e * (((a *= 1.525) + 1) * e + a) + 2)
            },
            easeInBounce: function(e) {
                return 1 - animationOptions.easeOutBounce(1 - e)
            },
            easeOutBounce: function(e) {
                return (e /= 1) < 1 / 2.75 ? 1 * (7.5625 * e * e) : 2 / 2.75 > e ? 1 * (7.5625 * (e -= 1.5 / 2.75) * e + .75) : 2.5 / 2.75 > e ? 1 * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 1 * (7.5625 * (e -= 2.625 / 2.75) * e + .984375)
            },
            easeInOutBounce: function(e) {
                return .5 > e ? .5 * animationOptions.easeInBounce(2 * e) : .5 * animationOptions.easeOutBounce(2 * e - 1) + .5
            }
        },
        width = context.canvas.width,
        height = context.canvas.height;
    window.devicePixelRatio && (context.canvas.style.width = width + "px", context.canvas.style.height = height + "px", context.canvas.height = height * window.devicePixelRatio, context.canvas.width = width * window.devicePixelRatio, context.scale(window.devicePixelRatio, window.devicePixelRatio)), this.PolarArea = function(e, a) {
        chart.PolarArea.defaults = {
            inGraphDataShow: !1,
            inGraphDataPaddingRadius: 5,
            inGraphDataPaddingAngle: 0,
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            inGraphDataAlign: "off-center",
            inGraphDataVAlign: "off-center",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataRadiusPosition: 3,
            inGraphDataAnglePosition: 2,
            scaleOverlay: !0,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleGridLinesStep: 1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleShowLine: !0,
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineWidth: 1,
            scaleLineStyle: "solid",
            scaleShowLabels: !0,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowLabelBackdrop: !0,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            segmentShowStroke: !0,
            segmentStrokeColor: "#fff",
            segmentStrokeStyle: "solid",
            segmentStrokeWidth: 2,
            animation: !0,
            animationByData: "ByArc",
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: !0,
            animateScale: !1,
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
            startAngle: 90,
            totalAmplitude: 360,
            radiusScale: 1
        }, isIE() < 9 && 0 != isIE() && (chart.PolarArea.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.PolarArea.defaults)), chart.PolarArea.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.PolarArea.defaults), chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptions), chart.PolarArea.defaults = mergeChartConfig(chart.PolarArea.defaults, charJSPersonalDefaultOptionsPolarArea);
        var t = a ? mergeChartConfig(chart.PolarArea.defaults, a) : chart.PolarArea.defaults;
        return new PolarArea(e, t, context)
    }, this.Radar = function(e, a) {
        chart.Radar.defaults = {
            inGraphDataShow: !1,
            inGraphDataPaddingRadius: 5,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign: "off-center",
            inGraphDataVAlign: "off-center",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataRadiusPosition: 3,
            yAxisMinimumInterval: "none",
            scaleGridLinesStep: 1,
            scaleOverlay: !1,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleShowLine: !0,
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineStyle: "solid",
            scaleLineWidth: 1,
            scaleShowLabels: !1,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowLabelBackdrop: !0,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            angleShowLineOut: !0,
            angleLineColor: "rgba(0,0,0,.1)",
            angleLineStyle: "solid",
            angleLineWidth: 1,
            pointLabelFontFamily: "'Arial'",
            pointLabelFontStyle: "normal",
            pointLabelFontSize: 12,
            pointLabelFontColor: "#666",
            pointDot: !0,
            pointDotRadius: 3,
            pointDotStrokeWidth: 1,
            pointDotStrokeStyle: "solid",
            datasetFill: !0,
            datasetStrokeWidth: 2,
            datasetStrokeStyle: "solid",
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
            pointHitDetectionRadius: 10,
            startAngle: 90
        }, isIE() < 9 && 0 != isIE() && (chart.Radar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Radar.defaults)), chart.Radar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Radar.defaults), chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptions), chart.Radar.defaults = mergeChartConfig(chart.Radar.defaults, charJSPersonalDefaultOptionsRadar);
        var t = a ? mergeChartConfig(chart.Radar.defaults, a) : chart.Radar.defaults;
        return new Radar(e, t, context)
    }, this.Pie = function(e, a) {
        chart.Pie.defaults = chart.defaults.PieAndDoughnut, isIE() < 9 && 0 != isIE() && (chart.Pie.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Pie.defaults)), chart.Pie.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Pie.defaults), chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptions), chart.Pie.defaults = mergeChartConfig(chart.Pie.defaults, charJSPersonalDefaultOptionsPie);
        var t = a ? mergeChartConfig(chart.Pie.defaults, a) : chart.Pie.defaults;
        return new Pie(e, t, context)
    }, this.Doughnut = function(e, a) {
        chart.Doughnut.defaults = chart.defaults.PieAndDoughnut, isIE() < 9 && 0 != isIE() && (chart.Doughnut.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Doughnut.defaults)), chart.Doughnut.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Doughnut.defaults), chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptions), chart.Doughnut.defaults = mergeChartConfig(chart.Doughnut.defaults, charJSPersonalDefaultOptionsDoughnut);
        var t = a ? mergeChartConfig(chart.Doughnut.defaults, a) : chart.Doughnut.defaults;
        return new Doughnut(e, t, context)
    }, this.Line = function(e, a) {
        chart.Line.defaults = {
            inGraphDataShow: !1,
            inGraphDataPaddingX: 3,
            inGraphDataPaddingY: 3,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign: "left",
            inGraphDataVAlign: "bottom",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            drawXScaleLine: [{
                position: "bottom"
            }],
            scaleOverlay: !1,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleSteps2: null,
            scaleStepWidth2: null,
            scaleStartValue2: null,
            scaleLabel2: "<%=value%>",
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineStyle: "solid",
            scaleLineWidth: 1,
            scaleShowLabels: !0,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: !0,
            scaleXGridLinesStep: 1,
            scaleYGridLinesStep: 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineStyle: "solid",
            scaleGridLineWidth: 1,
            showYAxisMin: !0,
            rotateLabels: "smart",
            logarithmic: !1,
            logarithmic2: !1,
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            bezierCurve: !0,
            linkType: 0,
            bezierCurveTension: .4,
            pointDot: !0,
            pointDotRadius: 4,
            pointDotStrokeStyle: "solid",
            pointDotStrokeWidth: 2,
            datasetStrokeStyle: "solid",
            datasetStrokeWidth: 2,
            datasetFill: !0,
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            extrapolateMissingData: !0,
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>",
            pointHitDetectionRadius: 10
        }, isIE() < 9 && 0 != isIE() && (chart.Line.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Line.defaults)), chart.Line.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Line.defaults), chart.Line.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Line.defaults), chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptions), chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptionsLine);
        var t = a ? mergeChartConfig(chart.Line.defaults, a) : chart.Line.defaults;
        return new Line(e, t, context)
    }, this.StackedBar = function(e, a) {
        chart.StackedBar.defaults = {
            annotateBarMinimumDetectionHeight: 0,
            inGraphDataShow: !1,
            inGraphDataPaddingX: 0,
            inGraphDataPaddingY: -3,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign: "center",
            inGraphDataVAlign: "top",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition: 2,
            inGraphDataYPosition: 3,
            scaleOverlay: !1,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineStyle: "solid",
            scaleLineWidth: 1,
            scaleShowLabels: !0,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: !0,
            scaleXGridLinesStep: 1,
            scaleYGridLinesStep: 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineStyle: "solid",
            scaleGridLineWidth: 1,
            showYAxisMin: !0,
            rotateLabels: "smart",
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            pointDot: !0,
            pointDotRadius: 4,
            pointDotStrokeStyle: "solid",
            pointDotStrokeWidth: 2,
            barShowStroke: !0,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            spaceBetweenBar: 0,
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            bezierCurve: !0,
            linkType: 0,
            bezierCurveTension: .4,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
            pointHitDetectionRadius: 10
        }, isIE() < 9 && 0 != isIE() && (chart.StackedBar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.StackedBar.defaults)), chart.StackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.StackedBar.defaults), chart.StackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.StackedBar.defaults), chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptions), chart.StackedBar.defaults = mergeChartConfig(chart.StackedBar.defaults, charJSPersonalDefaultOptionsStackedBar);
        var t = a ? mergeChartConfig(chart.StackedBar.defaults, a) : chart.StackedBar.defaults;
        return new StackedBar(e, t, context)
    }, this.HorizontalStackedBar = function(e, a) {
        chart.HorizontalStackedBar.defaults = {
            annotateBarMinimumDetectionHeight: 0,
            inGraphDataShow: !1,
            inGraphDataPaddingX: -3,
            inGraphDataPaddingY: 0,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign: "right",
            inGraphDataVAlign: "middle",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition: 3,
            inGraphDataYPosition: 2,
            scaleOverlay: !1,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineStyle: "solid",
            scaleLineWidth: 1,
            scaleShowLabels: !0,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: !0,
            scaleXGridLinesStep: 1,
            scaleYGridLinesStep: 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineStyle: "solid",
            scaleGridLineWidth: 1,
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            showYAxisMin: !0,
            rotateLabels: "smart",
            barShowStroke: !0,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            spaceBetweenBar: 0,
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
            reverseOrder: !1
        }, isIE() < 9 && 0 != isIE() && (chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.HorizontalStackedBar.defaults)), chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalStackedBar.defaults), chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalStackedBar.defaults), chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptions), chart.HorizontalStackedBar.defaults = mergeChartConfig(chart.HorizontalStackedBar.defaults, charJSPersonalDefaultOptionsHorizontalStackedBar);
        var t = a ? mergeChartConfig(chart.HorizontalStackedBar.defaults, a) : chart.HorizontalStackedBar.defaults;
        return new HorizontalStackedBar(e, t, context)
    }, this.Bar = function(e, a) {
        chart.Bar.defaults = {
            annotateBarMinimumDetectionHeight: 0,
            inGraphDataShow: !1,
            inGraphDataPaddingX: 0,
            inGraphDataPaddingY: 3,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign: "center",
            inGraphDataVAlign: "bottom",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition: 2,
            inGraphDataYPosition: 3,
            scaleOverlay: !1,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleSteps2: null,
            scaleStepWidth2: null,
            scaleStartValue2: null,
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineStyle: "solid",
            scaleLineWidth: 1,
            scaleShowLabels: !0,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleLabel2: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: !0,
            scaleXGridLinesStep: 1,
            scaleYGridLinesStep: 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleGridLineStyle: "solid",
            showYAxisMin: !0,
            rotateLabels: "smart",
            logarithmic: !1,
            logarithmic2: !1,
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            barShowStroke: !0,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            barBorderRadius: 0,
            pointDot: !0,
            pointDotRadius: 4,
            pointDotStrokeStyle: "solid",
            pointDotStrokeWidth: 2,
            extrapolateMissingData: !0,
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            bezierCurve: !0,
            linkType: 0,
            bezierCurveTension: .4,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
            pointHitDetectionRadius: 10
        }, isIE() < 9 && 0 != isIE() && (chart.Bar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.Bar.defaults)), chart.Bar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Bar.defaults), chart.Bar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Bar.defaults), chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptions), chart.Bar.defaults = mergeChartConfig(chart.Bar.defaults, charJSPersonalDefaultOptionsBar);
        var t = a ? mergeChartConfig(chart.Bar.defaults, a) : chart.Bar.defaults;
        return new Bar(e, t, context)
    }, this.HorizontalBar = function(e, a) {
        chart.HorizontalBar.defaults = {
            annotateBarMinimumDetectionHeight: 0,
            inGraphDataShow: !1,
            inGraphDataPaddingX: 3,
            inGraphDataPaddingY: 0,
            inGraphDataTmpl: "<%=v3%>",
            inGraphDataAlign: "left",
            inGraphDataVAlign: "middle",
            inGraphDataRotate: 0,
            inGraphDataFontFamily: "'Arial'",
            inGraphDataFontSize: 12,
            inGraphDataFontStyle: "normal",
            inGraphDataFontColor: "#666",
            inGraphDataXPosition: 3,
            inGraphDataYPosition: 2,
            scaleOverlay: !1,
            scaleOverride: !1,
            scaleOverride2: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,1)",
            scaleLineStyle: "solid",
            scaleLineWidth: 1,
            scaleShowLabels: !0,
            scaleShowLabels2: !0,
            scaleLabel: "<%=value%>",
            scaleFontFamily: "'Arial'",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            scaleShowGridLines: !0,
            scaleXGridLinesStep: 1,
            scaleYGridLinesStep: 1,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineStyle: "solid",
            scaleGridLineWidth: 1,
            scaleTickSizeLeft: 5,
            scaleTickSizeRight: 5,
            scaleTickSizeBottom: 5,
            scaleTickSizeTop: 5,
            showYAxisMin: !0,
            rotateLabels: "smart",
            barShowStroke: !0,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            barBorderRadius: 0,
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            onAnimationComplete: null,
            annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3 + ' (' + v6 + ' %)'%>",
            reverseOrder: !1
        }, isIE() < 9 && 0 != isIE() && (chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.IExplorer8, chart.HorizontalBar.defaults)), chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.HorizontalBar.defaults), chart.HorizontalBar.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.HorizontalBar.defaults), chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptions), chart.HorizontalBar.defaults = mergeChartConfig(chart.HorizontalBar.defaults, charJSPersonalDefaultOptionsHorizontalBar);
        var t = a ? mergeChartConfig(chart.HorizontalBar.defaults, a) : chart.HorizontalBar.defaults;
        return new HorizontalBar(e, t, context)
    }, chart.defaults = {}, chart.defaults.IExplorer8 = {
        annotateBackgroundColor: "black",
        annotateFontColor: "white"
    }, chart.defaults.commonOptions = {
        chartTextScale: 1,
        chartLineScale: 1,
        chartSpaceScale: 1,
        multiGraph: !1,
        clearRect: !0,
        dynamicDisplay: !0,
        graphSpaceBefore: 5,
        graphSpaceAfter: 5,
        canvasBorders: !1,
        canvasBackgroundColor: "none",
        canvasBordersWidth: 3,
        canvasBordersStyle: "solid",
        canvasBordersColor: "black",
        zeroValue: 1e-10,
        graphTitle: "",
        graphTitleFontFamily: "'Arial'",
        graphTitleFontSize: 24,
        graphTitleFontStyle: "bold",
        graphTitleFontColor: "#666",
        graphTitleSpaceBefore: 5,
        graphTitleSpaceAfter: 5,
        graphTitleBorders: !1,
        graphTitleBordersColor: "black",
        graphTitleBordersXSpace: 3,
        graphTitleBordersYSpace: 3,
        graphTitleBordersWidth: 1,
        graphTitleBordersStyle: "solid",
        graphTitleBackgroundColor: "none",
        graphSubTitle: "",
        graphSubTitleFontFamily: "'Arial'",
        graphSubTitleFontSize: 18,
        graphSubTitleFontStyle: "normal",
        graphSubTitleFontColor: "#666",
        graphSubTitleSpaceBefore: 5,
        graphSubTitleSpaceAfter: 5,
        graphSubTitleBorders: !1,
        graphSubTitleBordersColor: "black",
        graphSubTitleBordersXSpace: 3,
        graphSubTitleBordersYSpace: 3,
        graphSubTitleBordersWidth: 1,
        graphSubTitleBordersStyle: "solid",
        graphSubTitleBackgroundColor: "none",
        footNote: "",
        footNoteFontFamily: "'Arial'",
        footNoteFontSize: 8,
        footNoteFontStyle: "bold",
        footNoteFontColor: "#666",
        footNoteSpaceBefore: 5,
        footNoteSpaceAfter: 5,
        footNoteBorders: !1,
        footNoteBordersColor: "black",
        footNoteBordersXSpace: 3,
        footNoteBordersYSpace: 3,
        footNoteBordersWidth: 1,
        footNoteBordersStyle: "solid",
        footNoteBackgroundColor: "none",
        legend: !1,
        showSingleLegend: !1,
        maxLegendCols: 999,
        legendPosY: 4,
        legendPosX: -2,
        legendFontFamily: "'Arial'",
        legendFontSize: 12,
        legendFontStyle: "normal",
        legendFontColor: "#666",
        legendBlockSize: 15,
        legendBorders: !0,
        legendBordersStyle: "solid",
        legendBordersWidth: 1,
        legendBordersColors: "#666",
        legendBordersSpaceBefore: 5,
        legendBordersSpaceAfter: 5,
        legendBordersSpaceLeft: 5,
        legendBordersSpaceRight: 5,
        legendSpaceBeforeText: 5,
        legendSpaceAfterText: 5,
        legendSpaceLeftText: 5,
        legendSpaceRightText: 5,
        legendSpaceBetweenTextVertical: 5,
        legendSpaceBetweenTextHorizontal: 5,
        legendSpaceBetweenBoxAndText: 5,
        legendFillColor: "rgba(0,0,0,0)",
        legendXPadding: 0,
        legendYPadding: 0,
        inGraphDataBorders: !1,
        inGraphDataBordersColor: "black",
        inGraphDataBordersXSpace: 3,
        inGraphDataBordersYSpace: 3,
        inGraphDataBordersWidth: 1,
        inGraphDataBordersStyle: "solid",
        inGraphDataBackgroundColor: "none",
        annotateDisplay: !1,
        annotateRelocate: !1,
        savePng: !1,
        savePngOutput: "NewWindow",
        savePngFunction: "mousedown right",
        savePngBackgroundColor: "WHITE",
        annotateFunction: "mousemove",
        annotateFontFamily: "'Arial'",
        annotateBorder: "none",
        annotateBorderRadius: "2px",
        annotateBackgroundColor: "rgba(0,0,0,0.8)",
        annotateFontSize: 12,
        annotateFontColor: "white",
        annotateFontStyle: "normal",
        annotatePadding: "3px",
        annotateClassName: "",
        annotateFunctionIn: null,
        annotateFunctionOut: null,
        detectMouseOnText: !0,
        crossText: [""],
        crossTextIter: ["all"],
        crossTextOverlay: [!0],
        crossTextFontFamily: ["'Arial'"],
        crossTextFontSize: [12],
        crossTextFontStyle: ["normal"],
        crossTextFontColor: ["rgba(220,220,220,1)"],
        crossTextRelativePosX: [2],
        crossTextRelativePosY: [2],
        crossTextBaseline: ["middle"],
        crossTextAlign: ["center"],
        crossTextPosX: [0],
        crossTextPosY: [0],
        crossTextAngle: [0],
        crossTextFunction: null,
        crossTextBorders: [!1],
        crossTextBordersColor: ["black"],
        crossTextBordersXSpace: [3],
        crossTextBordersYSpace: [3],
        crossTextBordersWidth: [1],
        crossTextBordersStyle: ["solid"],
        crossTextBackgroundColor: ["none"],
        crossImage: [void 0],
        crossImageIter: ["all"],
        crossImageOverlay: [!0],
        crossImageRelativePosX: [2],
        crossImageRelativePosY: [2],
        crossImageBaseline: ["middle"],
        crossImageAlign: ["center"],
        crossImagePosX: [0],
        crossImagePosY: [0],
        crossImageAngle: [0],
        spaceTop: 0,
        spaceBottom: 0,
        spaceRight: 0,
        spaceLeft: 0,
        decimalSeparator: ".",
        thousandSeparator: "",
        roundNumber: "none",
        roundPct: -1,
        templatesOpenTag: "<%=",
        templatesCloseTag: "%>",
        fmtV1: "none",
        fmtV2: "none",
        fmtV3: "none",
        fmtV4: "none",
        fmtV5: "none",
        fmtV6: "none",
        fmtV6T: "none",
        fmtV7: "none",
        fmtV8: "none",
        fmtV8T: "none",
        fmtV9: "none",
        fmtV10: "none",
        fmtV11: "none",
        fmtV12: "none",
        fmtV13: "none",
        fmtXLabel: "none",
        fmtYLabel: "none",
        fmtYLabel2: "none",
        fmtLegend: "none",
        animationStartValue: 0,
        animationStopValue: 1,
        animationCount: 1,
        animationPauseTime: 5,
        animationBackward: !1,
        animationStartWithDataset: 1,
        animationStartWithData: 1,
        animationLeftToRight: !1,
        animationByDataset: !1,
        defaultStrokeColor: "rgba(220,220,220,1)",
        defaultFillColor: "rgba(220,220,220,0.5)",
        defaultLineWidth: 1,
        graphMaximized: !1,
        contextMenu: !0,
        mouseDownRight: null,
        mouseDownLeft: null,
        mouseDownMiddle: null,
        mouseUp: null,
        mouseMove: null,
        mouseOut: null,
        mouseWheel: null,
        savePngName: "canvas",
        responsive: !1,
        responsiveMinWidth: 0,
        responsiveMinHeight: 0,
        responsiveMaxWidth: 9999999,
        responsiveMaxHeight: 9999999,
        maintainAspectRatio: !0,
        responsiveScaleContent: !1,
        responsiveWindowInitialWidth: !1,
        pointMarker: "circle",
        initFunction: null,
        beforeDrawFunction: null,
        endDrawDataFunction: null,
        endDrawScaleFunction: null
    }, chart.defaults.PieAndDoughnut = {
        inGraphDataShow: !1,
        inGraphDataPaddingRadius: 5,
        inGraphDataPaddingAngle: 0,
        inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
        inGraphDataAlign: "off-center",
        inGraphDataVAlign: "off-center",
        inGraphDataRotate: 0,
        inGraphDataFontFamily: "'Arial'",
        inGraphDataFontSize: 12,
        inGraphDataFontStyle: "normal",
        inGraphDataFontColor: "#666",
        inGraphDataRadiusPosition: 3,
        inGraphDataAnglePosition: 2,
        inGraphDataMinimumAngle: 0,
        segmentShowStroke: !0,
        segmentStrokeColor: "#fff",
        segmentStrokeStyle: "solid",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 50,
        animation: !0,
        animationByData: !1,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: !0,
        animateScale: !1,
        onAnimationComplete: null,
        annotateLabel: "<%=(v1 == ''? '' : v1+':')+ v2 + ' (' + v6 + ' %)'%>",
        startAngle: 90,
        totalAmplitude: 360,
        radiusScale: 1
    }, chart.defaults.xyAxisCommonOptions = {
        maxBarWidth: -1,
        yAxisMinimumInterval: "none",
        yAxisMinimumInterval2: "none",
        yScaleLabelsMinimumWidth: 0,
        xScaleLabelsMinimumWidth: 0,
        yAxisLeft: !0,
        yAxisRight: !1,
        xAxisBottom: !0,
        xAxisTop: !1,
        xAxisSpaceBetweenLabels: 5,
        fullWidthGraph: !1,
        yAxisLabel: "",
        yAxisLabel2: "",
        yAxisFontFamily: "'Arial'",
        yAxisFontSize: 16,
        yAxisFontStyle: "normal",
        yAxisFontColor: "#666",
        yAxisLabelSpaceRight: 5,
        yAxisLabelSpaceLeft: 5,
        yAxisSpaceRight: 5,
        yAxisSpaceLeft: 5,
        yAxisLabelBorders: !1,
        yAxisLabelBordersColor: "black",
        yAxisLabelBordersXSpace: 3,
        yAxisLabelBordersYSpace: 3,
        yAxisLabelBordersWidth: 1,
        yAxisLabelBordersStyle: "solid",
        yAxisLabelBackgroundColor: "none",
        xAxisLabel: "",
        xAxisFontFamily: "'Arial'",
        xAxisFontSize: 16,
        xAxisFontStyle: "normal",
        xAxisFontColor: "#666",
        xAxisLabelSpaceBefore: 5,
        xAxisLabelSpaceAfter: 5,
        xAxisSpaceBefore: 5,
        xAxisSpaceAfter: 5,
        xAxisLabelBorders: !1,
        xAxisLabelBordersColor: "black",
        xAxisLabelBordersXSpace: 3,
        xAxisLabelBordersYSpace: 3,
        xAxisLabelBordersWidth: 1,
        xAxisLabelBordersStyle: "solid",
        xAxisLabelBackgroundColor: "none",
        showXLabels: 1,
        firstLabelToShow: 1,
        showYLabels: 1,
        firstYLabelToShow: 1,
        yAxisUnit: "",
        yAxisUnit2: "",
        yAxisUnitFontFamily: "'Arial'",
        yAxisUnitFontSize: 8,
        yAxisUnitFontStyle: "normal",
        yAxisUnitFontColor: "#666",
        yAxisUnitSpaceBefore: 5,
        yAxisUnitSpaceAfter: 5,
        yAxisUnitBorders: !1,
        yAxisUnitBordersColor: "black",
        yAxisUnitBordersXSpace: 3,
        yAxisUnitBordersYSpace: 3,
        yAxisUnitBordersWidth: 1,
        yAxisUnitBordersStyle: "solid",
        yAxisUnitBackgroundColor: "none"
    };
    var clear = function(e) {
            e.clearRect(0, 0, width, height)
        },
        PolarArea = function(e, a, t) {
            function i(i) {
                for (var l = 0; l < e.length; l++) {
                    var n = 1,
                        r = 1;
                    if (a.animation && (a.animateScale && (n = i), a.animateRotate && (r = i)), correctedRotateAnimation = animationCorrection(r, e, a, l, -1, 0).mainVal, "undefined" != typeof e[l].value) {
                        if (t.beginPath(), "ByArc" == a.animationByData) endAngle = m[l].startAngle + correctedRotateAnimation * m[l].segmentAngle, t.arc(p, S, n * m[l].radiusOffset, m[l].startAngle, endAngle, !1);
                        else if (a.animationByData) {
                            if (!(m[l].startAngle - m[l].firstAngle < 2 * correctedRotateAnimation * Math.PI)) continue;
                            endAngle = m[l].endAngle, m[l].endAngle - m[l].firstAngle > 2 * correctedRotateAnimation * Math.PI && (endAngle = m[l].firstAngle + 2 * correctedRotateAnimation * Math.PI), t.arc(p, S, n * m[l].radiusOffset, m[l].startAngle, endAngle, !1)
                        } else t.arc(p, S, n * m[l].radiusOffset, m[l].firstAngle + correctedRotateAnimation * (m[l].startAngle - m[l].firstAngle), m[l].firstAngle + correctedRotateAnimation * (m[l].endAngle - m[l].firstAngle));
                        t.lineTo(p, S), t.closePath(), t.fillStyle = setOptionValue(1, "COLOR", t, e, m, e[l].color, a.defaultFillColor, l, -1, {
                            animationDecimal: i,
                            scaleAnimation: n
                        }), t.fill(), "merge" == a.segmentShowStroke ? (t.lineWidth = 0, t.strokeStyle = setOptionValue(1, "COLOR", t, e, m, e[l].color, a.defaultFillColor, l, -1, {
                            animationDecimal: i,
                            scaleAnimation: n
                        }), t.setLineDash([]), t.stroke()) : a.segmentShowStroke && (t.strokeStyle = a.segmentStrokeColor, t.lineWidth = Math.ceil(t.chartLineScale * a.segmentStrokeWidth), t.setLineDash(lineStyleFn(setOptionValue(1, "SEGMENTSTROKESTYLE", t, e, m, e[l].segmentStrokeStyle, a.segmentStrokeStyle, l, -1, {
                            animationDecimal: i,
                            scaleAnimation: n
                        }))), t.stroke(), t.setLineDash([]))
                    }
                }
                if (i >= a.animationStopValue)
                    for (l = 0; l < e.length; l++)
                        if ("undefined" != typeof e[l].value && (jsGraphAnnotate[t.ChartNewId][jsGraphAnnotate[t.ChartNewId].length] = ["ARC", l, -1, m, setOptionValue(1, "ANNOTATEDISPLAY", t, e, m, e[l].annotateDisplay, a.annotateDisplay, l, -1, {
                                nullValue: !0
                            })], setOptionValue(1, "INGRAPHDATASHOW", t, e, m, e[l].inGraphDataShow, a.inGraphDataShow, l, -1, {
                                nullValue: !0
                            }))) {
                            1 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", t, e, m, void 0, a.inGraphDataAnglePosition, l, -1, {
                                nullValue: !0
                            }) ? posAngle = m[l].realStartAngle + setOptionValue(1, "INGRAPHDATAPADDINANGLE", t, e, m, void 0, a.inGraphDataPaddingAngle, l, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180) : 2 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", t, e, m, void 0, a.inGraphDataAnglePosition, l, -1, {
                                nullValue: !0
                            }) ? posAngle = (2 * m[l].realStartAngle - m[l].segmentAngle) / 2 + setOptionValue(1, "INGRAPHDATAPADDINANGLE", t, e, m, void 0, a.inGraphDataPaddingAngle, l, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180) : 3 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", t, e, m, void 0, a.inGraphDataAnglePosition, l, -1, {
                                nullValue: !0
                            }) && (posAngle = m[l].realStartAngle - m[l].segmentAngle + setOptionValue(1, "INGRAPHDATAPADDINANGLE", t, e, m, void 0, a.inGraphDataPaddingAngle, l, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180)), 1 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, m, void 0, a.inGraphDataRadiusPosition, l, -1, {
                                nullValue: !0
                            }) ? labelRadius = 0 + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, m, void 0, a.inGraphDataPaddingRadius, l, -1, {
                                    nullValue: !0
                                }) : 2 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, m, void 0, a.inGraphDataRadiusPosition, l, -1, {
                                nullValue: !0
                            }) ? labelRadius = m[l].radiusOffset / 2 + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, m, void 0, a.inGraphDataPaddingRadius, l, -1, {
                                    nullValue: !0
                                }) : 3 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, m, void 0, a.inGraphDataRadiusPosition, l, -1, {
                                nullValue: !0
                            }) ? labelRadius = m[l].radiusOffset + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, m, void 0, a.inGraphDataPaddingRadius, l, -1, {
                                    nullValue: !0
                                }) : 4 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, m, void 0, a.inGraphDataRadiusPosition, l, -1, {
                                nullValue: !0
                            }) && (labelRadius = o * s.steps + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, m, void 0, a.inGraphDataPaddingRadius, l, -1, {
                                    nullValue: !0
                                })), t.save(), "off-center" == setOptionValue(1, "INGRAPHDATAALIGN", t, e, m, void 0, a.inGraphDataAlign, l, -1, {
                                nullValue: !0
                            }) ? "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, l, -1, {
                                nullValue: !0
                            }) || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2 ? t.textAlign = "left" : t.textAlign = "right" : "to-center" == setOptionValue(1, "INGRAPHDATAALIGN", t, e, m, void 0, a.inGraphDataAlign, l, -1, {
                                nullValue: !0
                            }) ? "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, l, -1, {
                                nullValue: !0
                            }) || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2 ? t.textAlign = "right" : t.textAlign = "left" : t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, m, void 0, a.inGraphDataAlign, l, -1, {
                                nullValue: !0
                            }), "off-center" == setOptionValue(1, "INGRAPHDATAVALIGN", t, e, m, void 0, a.inGraphDataVAlign, l, -1, {
                                nullValue: !0
                            }) ? (posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI ? t.textBaseline = "top" : t.textBaseline = "bottom" : "to-center" == setOptionValue(1, "INGRAPHDATAVALIGN", t, e, m, void 0, a.inGraphDataVAlign, l, -1, {
                                nullValue: !0
                            }) ? (posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI ? t.textBaseline = "bottom" : t.textBaseline = "top" : t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, m, void 0, a.inGraphDataVAlign, l, -1, {
                                nullValue: !0
                            }), t.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", t, e, m, void 0, a.inGraphDataFontStyle, l, -1, {
                                    nullValue: !0
                                }) + " " + setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, l, -1, {
                                    nullValue: !0
                                }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", t, e, m, void 0, a.inGraphDataFontFamily, l, -1, {
                                    nullValue: !0
                                }), t.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", t, e, m, void 0, a.inGraphDataFontColor, l, -1, {
                                nullValue: !0
                            });
                            var c = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", t, e, m, void 0, a.inGraphDataTmpl, l, -1, {
                                nullValue: !0
                            }), m[l], a);
                            t.translate(p + labelRadius * Math.cos(posAngle), S - labelRadius * Math.sin(posAngle));
                            var h = 0;
                            h = "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, l, -1, {
                                nullValue: !0
                            }) ? 2 * Math.PI - posAngle : "inRadiusAxisRotateLabels" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, l, -1, {
                                nullValue: !0
                            }) ? (posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2 ? 3 * Math.PI - posAngle : 2 * Math.PI - posAngle : setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, l, -1, {
                                nullValue: !0
                            }) * (Math.PI / 180), t.rotate(h), setTextBordersAndBackground(t, c, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, l, -1, {
                                nullValue: !0
                            }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", t, e, m, void 0, a.inGraphDataBorders, l, -1, {
                                nullValue: !0
                            }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", t, e, m, void 0, a.inGraphDataBordersColor, l, -1, {
                                nullValue: !0
                            }), setOptionValue(t.chartLineScale, "INGRAPHDATABORDERSWIDTH", t, e, m, void 0, a.inGraphDataBordersWidth, l, -1, {
                                nullValue: !0
                            }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", t, e, m, void 0, a.inGraphDataBordersXSpace, l, -1, {
                                nullValue: !0
                            }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", t, e, m, void 0, a.inGraphDataBordersYSpace, l, -1, {
                                nullValue: !0
                            }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", t, e, m, void 0, a.inGraphDataBordersStyle, l, -1, {
                                nullValue: !0
                            }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", t, e, m, void 0, a.inGraphDataBackgroundColor, l, -1, {
                                nullValue: !0
                            }), "INGRAPHDATA"), t.fillTextMultiLine(c, 0, 0, t.textBaseline, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, l, -1, {
                                nullValue: !0
                            }), !0, a.detectMouseOnText, t, "INGRAPHDATA_TEXTMOUSE", h, p + labelRadius * Math.cos(posAngle), S - labelRadius * Math.sin(posAngle), l, -1), t.restore()
                        }
                u.legendMsr.dispLegend && drawLegend(u.legendMsr, e, a, t, "PolarArea")
            }

            function l() {
                for (var e = 0; e < s.steps; e++)
                    if (a.scaleShowLine && (e + 1) % a.scaleGridLinesStep == 0 && (t.beginPath(), t.arc(p, S, o * (e + 1), 4 * Math.PI - x, 4 * Math.PI - A, !0), t.strokeStyle = a.scaleLineColor, t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.stroke(), t.setLineDash([])), a.scaleShowLabels) {
                        Math.abs(a.totalAmplitude - 360) < a.zeroValue ? scaleAngle = Math.PI / 2 : scaleAngle = (x + A) / 2, t.textAlign = "center", t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily;
                        var i = s.labels[e + 1];
                        if (a.scaleShowLabelBackdrop) {
                            var l = t.measureTextMultiLine(i, Math.ceil(t.chartTextScale * a.scaleFontSize));
                            t.fillStyle = a.scaleBackdropColor, t.beginPath(), t.rect(Math.round(p + Math.cos(scaleAngle) * (o * (e + 1)) - l / 2 - Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingX)), Math.round(S - Math.sin(scaleAngle) * (o * (e + 1)) - .5 * Math.ceil(t.chartTextScale * a.scaleFontSize) - Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingY)), Math.round(l + 2 * Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingX)), Math.round(Math.ceil(t.chartTextScale * a.scaleFontSize) + 2 * Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingY))), t.fill()
                        }
                        t.textBaseline = "middle", t.fillStyle = a.scaleFontColor, t.fillTextMultiLine(i, p + Math.cos(scaleAngle) * (o * (e + 1)), S - Math.sin(scaleAngle) * (o * (e + 1)), t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "SCALE_TEXTMOUSE", 0, 0, 0, e, -1)
                    }
            }

            function n() {
                for (var i = -Number.MAX_VALUE, l = Number.MAX_VALUE, n = 0; n < e.length; n++) "undefined" != typeof e[n].value && (1 * e[n].value > i && (i = 1 * e[n].value), 1 * e[n].value < l && (l = 1 * e[n].value));
                l > i && (i = 0, l = 0), Math.abs(i - l) < a.zeroValue && (Math.abs(i) < a.zeroValue && (i = .9), i > 0 ? (i = 1.1 * i, l = .9 * l) : (i = .9 * i, l = 1.1 * l)), "function" == typeof a.graphMin ? l = setOptionValue(1, "GRAPHMIN", t, e, m, void 0, a.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMin) || (l = a.graphMin), "function" == typeof a.graphMax ? i = setOptionValue(1, "GRAPHMAX", t, e, m, void 0, a.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMax) || (i = a.graphMax);
                var o = Math.floor(c / (.66 * r)),
                    s = Math.floor(c / r * .5);
                return l > i && (l = i - 1), {
                    maxValue: i,
                    minValue: l,
                    maxSteps: o,
                    minSteps: s
                }
            }
            var o, s, r, c, h, d, u, p, S;
            if (t.tpchart = "PolarArea", t.tpdata = 1, init_and_start(t, e, a)) {
                var g = ((a.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI),
                    f = ((a.totalAmplitude * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
                f <= a.zeroValue && (f = 2 * Math.PI);
                var x = (g - f + 4 * Math.PI) % (2 * Math.PI),
                    A = x + f,
                    m = initPassVariableData_part1(e, a, t);
                if (h = n(), a.logarithmic = !1, a.logarithmic2 = !1, d = a.scaleShowLabels ? a.scaleLabel : "", a.scaleOverride) {
                    var M = setOptionValue(1, "SCALESTARTVALUE", t, e, m, void 0, a.scaleStartValue, -1, -1, {
                            nullValue: !0
                        }),
                        P = setOptionValue(1, "SCALESTEPS", t, e, m, void 0, a.scaleSteps, -1, -1, {
                            nullValue: !0
                        }),
                        T = setOptionValue(1, "SCALESTEPWIDTH", t, e, m, void 0, a.scaleStepWidth, -1, -1, {
                            nullValue: !0
                        });
                    s = {
                        steps: P,
                        stepValue: T,
                        graphMin: M,
                        graphMax: M + P * T,
                        labels: []
                    }, populateLabels(1, a, d, s.labels, s.steps, M, s.graphMax, T), u = setMeasures(e, a, t, height, width, s.labels, null, !0, !1, !1, !1, !0, "PolarArea")
                } else s = calculateScale(1, a, h.maxSteps, h.minSteps, h.maxValue, h.minValue, d), u = setMeasures(e, a, t, height, width, s.labels, null, !0, !1, !1, !1, !0, "PolarArea");
                var v = s.graphMin + s.steps * s.stepValue,
                    L = calculatePieDrawingSize(t, u, a, e, m);
                p = L.midPieX, S = L.midPieY, o = Math.floor(L.radius / s.steps), o > 0 ? (initPassVariableData_part2(m, e, a, t, {
                    midPosX: p,
                    midPosY: S,
                    int_radius: 0,
                    ext_radius: o * s.steps,
                    calculatedScale: s,
                    scaleHop: o,
                    outerVal: v
                }), animationLoop(a, l, i, t, u.clrx, u.clry, u.clrwidth, u.clrheight, p, S, p - (Min([u.availableHeight, u.availableWidth]) / 2 - 5), S + (Min([u.availableHeight, u.availableWidth]) / 2 - 5), e, m)) : testRedraw(t, e, a)
            }
        },
        Radar = function(e, a, t) {
            function i(i) {
                var l = 2 * Math.PI / e.datasets[0].data.length;
                t.save();
                for (var n = 0; n < e.datasets.length; n++) {
                    for (var o = -1, s = 0; s < e.datasets[n].data.length; s++) {
                        var r = animationCorrection(i, e, a, n, s, 1).animVal;
                        r > 1 && (r -= 1), "undefined" != typeof e.datasets[n].data[s] && (-1 == o ? (t.beginPath(), t.moveTo(g + r * x[n][s].offsetX, f - r * x[n][s].offsetY), o = s) : t.lineTo(g + r * x[n][s].offsetX, f - r * x[n][s].offsetY))
                    }
                    if (t.closePath(), e.datasets[n].datasetFill ? t.fillStyle = setOptionValue(1, "COLOR", t, e, x, e.datasets[n].fillColor, a.defaultFillColor, n, -1, {
                            animationValue: r,
                            midPosX: x[n][0].midPosX,
                            midPosY: x[n][0].midPosY,
                            ext_radius: (a.animationLeftToRight ? 1 : r) * x[n][0].calculated_offset_max
                        }) : t.fillStyle = "rgba(0,0,0,0)", t.strokeStyle = setOptionValue(1, "STROKECOLOR", t, e, x, e.datasets[n].strokeColor, a.defaultStrokeColor, n, -1, {
                            nullvalue: null
                        }), t.lineWidth = Math.ceil(t.chartLineScale * setOptionValue(1, "LINEWIDTH", t, e, x, e.datasets[n].datasetStrokeWidth, a.datasetStrokeWidth, n, -1, {
                                nullvalue: null
                            })), t.fill(), t.setLineDash(lineStyleFn(setOptionValue(1, "LINEDASH", t, e, x, e.datasets[n].datasetStrokeStyle, a.datasetStrokeStyle, n, s, {
                            nullvalue: null
                        }))), t.stroke(), t.setLineDash([]), a.pointDot && (!a.animationLeftToRight || a.animationLeftToRight && i >= 1)) {
                        t.beginPath(), t.fillStyle = setOptionValue(1, "MARKERFILLCOLOR", t, e, x, e.datasets[n].pointColor, a.defaultStrokeColor, n, -1, {
                            nullvalue: !0
                        }), t.strokeStyle = setOptionValue(1, "MARKERSTROKESTYLE", t, e, x, e.datasets[n].pointStrokeColor, a.defaultStrokeColor, n, -1, {
                            nullvalue: !0
                        }), t.lineWidth = setOptionValue(t.chartLineScale, "MARKERLINEWIDTH", t, e, x, e.datasets[n].pointDotStrokeWidth, a.pointDotStrokeWidth, n, -1, {
                            nullvalue: !0
                        });
                        for (var c = 0; c < e.datasets[n].data.length; c++)
                            if ("undefined" != typeof e.datasets[n].data[c]) {
                                t.beginPath();
                                var h = setOptionValue(1, "MARKERSHAPE", t, e, x, e.datasets[n].markerShape, a.markerShape, n, c, {
                                        nullvalue: !0
                                    }),
                                    d = setOptionValue(t.chartSpaceScale, "MARKERRADIUS", t, e, x, e.datasets[n].pointDotRadius, a.pointDotRadius, n, c, {
                                        nullvalue: !0
                                    }),
                                    u = setOptionValue(1, "MARKERSTROKESTYLE", t, e, x, e.datasets[n].pointDotStrokeStyle, a.pointDotStrokeStyle, n, c, {
                                        nullvalue: !0
                                    });
                                drawMarker(t, g + r * x[n][c].offsetX, f - r * x[n][c].offsetY, h, d, u)
                            }
                    }
                }
                if (t.restore(), i >= a.animationStopValue)
                    for (n = 0; n < e.datasets.length; n++)
                        for (s = 0; s < e.datasets[n].data.length; s++)
                            if ("undefined" != typeof e.datasets[n].data[s] && (jsGraphAnnotate[t.ChartNewId][jsGraphAnnotate[t.ChartNewId].length] = ["POINT", n, s, x, setOptionValue(1, "ANNOTATEDISPLAY", t, e, x, e.datasets[n].annotateDisplay, a.annotateDisplay, n, s, {
                                    nullValue: !0
                                })], setOptionValue(1, "INGRAPHDATASHOW", t, e, x, e.datasets[n].inGraphDataShow, a.inGraphDataShow, n, s, {
                                    nullValue: !0
                                }))) {
                                t.save(), t.beginPath(), t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, x, void 0, a.inGraphDataAlign, n, -1, {
                                    nullValue: !0
                                }), t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, x, void 0, a.inGraphDataVAlign, n, -1, {
                                    nullValue: !0
                                }), "off-center" == setOptionValue(1, "INGRAPHDATAALIGN", t, e, x, void 0, a.inGraphDataAlign, n, -1, {
                                    nullValue: !0
                                }) ? "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, x, void 0, a.inGraphDataRotate, n, -1, {
                                    nullValue: !0
                                }) || (a.startAngle * Math.PI / 180 - s * l + 4 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (a.startAngle * Math.PI / 180 - s * l + 4 * Math.PI) % (2 * Math.PI) <= Math.PI / 2 ? t.textAlign = "left" : t.textAlign = "right" : "to-center" == setOptionValue(1, "INGRAPHDATAALIGN", t, e, x, void 0, a.inGraphDataAlign, n, -1, {
                                    nullValue: !0
                                }) ? "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, x, void 0, a.inGraphDataRotate, n, -1, {
                                    nullValue: !0
                                }) || (a.startAngle * Math.PI / 180 - s * l + 4 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (a.startAngle * Math.PI / 180 - s * l + 4 * Math.PI) % (2 * Math.PI) < Math.PI / 2 ? t.textAlign = "right" : t.textAlign = "left" : t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, x, void 0, a.inGraphDataAlign, n, -1, {
                                    nullValue: !0
                                }), "off-center" == setOptionValue(1, "INGRAPHDATAVALIGN", t, e, x, void 0, a.inGraphDataVAlign, n, -1, {
                                    nullValue: !0
                                }) ? (a.startAngle * Math.PI / 180 - s * l + 4 * Math.PI) % (2 * Math.PI) > Math.PI ? t.textBaseline = "bottom" : t.textBaseline = "top" : "to-center" == setOptionValue(1, "INGRAPHDATAVALIGN", t, e, x, void 0, a.inGraphDataVAlign, n, -1, {
                                    nullValue: !0
                                }) ? (a.startAngle * Math.PI / 180 - s * l + 4 * Math.PI) % (2 * Math.PI) > Math.PI ? t.textBaseline = "top" : t.textBaseline = "bottom" : t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, x, void 0, a.inGraphDataVAlign, n, -1, {
                                    nullValue: !0
                                }), t.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", t, e, x, void 0, a.inGraphDataFontStyle, n, -1, {
                                        nullValue: !0
                                    }) + " " + setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, x, void 0, a.inGraphDataFontSize, n, -1, {
                                        nullValue: !0
                                    }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", t, e, x, void 0, a.inGraphDataFontFamily, n, -1, {
                                        nullValue: !0
                                    }), t.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", t, e, x, void 0, a.inGraphDataFontColor, n, -1, {
                                    nullValue: !0
                                });
                                var p;
                                1 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, x, void 0, a.inGraphDataRadiusPosition, n, -1, {
                                    nullValue: !0
                                }) ? p = 0 + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, x, void 0, a.inGraphDataPaddingRadius, n, -1, {
                                        nullValue: !0
                                    }) : 2 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, x, void 0, a.inGraphDataRadiusPosition, n, -1, {
                                    nullValue: !0
                                }) ? p = x[n][s].calculated_offset / 2 + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, x, void 0, a.inGraphDataPaddingRadius, n, -1, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, x, void 0, a.inGraphDataRadiusPosition, n, -1, {
                                    nullValue: !0
                                }) && (p = x[n][s].calculated_offset + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, x, void 0, a.inGraphDataPaddingRadius, n, -1, {
                                        nullValue: !0
                                    }));
                                var A, m;
                                x[n][s].calculated_offset > 0 ? (A = g + x[n][s].offsetX * (p / x[n][s].calculated_offset), m = f - x[n][s].offsetY * (p / x[n][s].calculated_offset)) : (A = g, m = f), t.translate(A, m);
                                var M = 0;
                                M = "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, x, void 0, a.inGraphDataRotate, n, -1, {
                                    nullValue: !0
                                }) ? s * l : "inRadiusAxisRotateLabels" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, x, void 0, a.inGraphDataRotate, n, -1, {
                                    nullValue: !0
                                }) ? (s * l + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (s * l + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2 ? 3 * Math.PI + s * l : 2 * Math.PI + s * l : setOptionValue(1, "INGRAPHDATAROTATE", t, e, x, void 0, a.inGraphDataRotate, n, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180), t.rotate(M);
                                var P = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", t, e, x, void 0, a.inGraphDataTmpl, n, -1, {
                                    nullValue: !0
                                }), x[n][s], a);
                                setTextBordersAndBackground(t, P, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, x, void 0, a.inGraphDataFontSize, n, -1, {
                                    nullValue: !0
                                }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", t, e, x, void 0, a.inGraphDataBorders, n, -1, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", t, e, x, void 0, a.inGraphDataBordersColor, n, -1, {
                                    nullValue: !0
                                }), setOptionValue(t.chartLineScale, "INGRAPHDATABORDERSWIDTH", t, e, x, void 0, a.inGraphDataBordersWidth, n, -1, {
                                    nullValue: !0
                                }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", t, e, x, void 0, a.inGraphDataBordersXSpace, n, -1, {
                                    nullValue: !0
                                }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", t, e, x, void 0, a.inGraphDataBordersYSpace, n, -1, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", t, e, x, void 0, a.inGraphDataBordersStyle, n, -1, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", t, e, x, void 0, a.inGraphDataBackgroundColor, n, -1, {
                                    nullValue: !0
                                }), "INGRAPHDATA"), t.fillTextMultiLine(P, 0, 0, t.textBaseline, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, x, void 0, a.inGraphDataFontSize, n, -1, {
                                    nullValue: !0
                                }), !0, a.detectMouseOnText, t, "INGRAPHDATA_TEXTMOUSE", M, A, m, n, s), t.restore()
                            }
                S.legendMsr.dispLegend && drawLegend(S.legendMsr, e, a, t, "Radar")
            }

            function l() {
                var i = 2 * Math.PI / e.datasets[0].data.length;
                if (t.save(), t.translate(g, f), t.rotate((90 - a.startAngle) * Math.PI / 180), a.angleShowLineOut) {
                    t.strokeStyle = a.angleLineColor, t.lineWidth = Math.ceil(t.chartLineScale * a.angleLineWidth);
                    for (var l = 0; l < e.datasets[0].data.length; l++) t.rotate(i), t.beginPath(), t.moveTo(0, 0), t.lineTo(0, -s), t.setLineDash(lineStyleFn(setOptionValue(1, "ANGLELINESTYLE", t, e, x, void 0, a.angleLineStyle, l, -1, {
                        nullValue: !0
                    }))), t.stroke(), t.setLineDash([])
                }
                for (var n = 0; n < c.steps; n++)
                    if (t.beginPath(), a.scaleShowLine && (n + 1) % a.scaleGridLinesStep == 0) {
                        t.strokeStyle = a.scaleLineColor, t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.moveTo(0, -r * (n + 1));
                        for (var o = 0; o < e.datasets[0].data.length; o++) t.rotate(i), t.lineTo(0, -r * (n + 1));
                        t.closePath(), t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.stroke(), t.setLineDash([])
                    }
                if (t.rotate(-(90 - a.startAngle) * Math.PI / 180), a.scaleShowLabels)
                    for (n = 0; n < c.steps; n++) {
                        if (t.textAlign = "center", t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, t.textBaseline = "middle", a.scaleShowLabelBackdrop) {
                            var h = t.measureTextMultiLine(c.labels[n + 1], Math.ceil(t.chartTextScale * a.scaleFontSize)).textWidth;
                            t.fillStyle = a.scaleBackdropColor, t.beginPath(), t.rect(Math.round(Math.cos(a.startAngle * Math.PI / 180) * (r * (n + 1)) - h / 2 - Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingX)), Math.round(-Math.sin(a.startAngle * Math.PI / 180) * r * (n + 1) - .5 * Math.ceil(t.chartTextScale * a.scaleFontSize) - Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingY)), Math.round(h + 2 * Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingX)), Math.round(Math.ceil(t.chartTextScale * a.scaleFontSize) + 2 * Math.ceil(t.chartSpaceScale * a.scaleBackdropPaddingY))), t.fill()
                        }
                        t.fillStyle = a.scaleFontColor, t.fillTextMultiLine(c.labels[n + 1], Math.cos(a.startAngle * Math.PI / 180) * (r * (n + 1)), -Math.sin(a.startAngle * Math.PI / 180) * r * (n + 1), t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "SCALE_TEXTMOUSE", 0, g, f, n, -1)
                    }
                for (var d = 0; d < e.labels.length; d++) {
                    t.font = a.pointLabelFontStyle + " " + Math.ceil(t.chartTextScale * a.pointLabelFontSize).toString() + "px " + a.pointLabelFontFamily, t.fillStyle = a.pointLabelFontColor;
                    for (var u = Math.sin((90 - a.startAngle) * Math.PI / 180 + i * d) * (s + Math.ceil(t.chartTextScale * a.pointLabelFontSize)), p = Math.cos((90 - a.startAngle) * Math.PI / 180 + i * d) * (s + Math.ceil(t.chartTextScale * a.pointLabelFontSize)), S = (90 - a.startAngle) * Math.PI / 180 + i * d; 0 > S;) S += 2 * Math.PI;
                    for (; S > 2 * Math.PI;) S -= 2 * Math.PI;
                    S == Math.PI || 0 == S ? t.textAlign = "center" : S > Math.PI ? t.textAlign = "right" : t.textAlign = "left", t.textBaseline = "middle", t.fillTextMultiLine(e.labels[d], u, -p, t.textBaseline, Math.ceil(t.chartTextScale * a.pointLabelFontSize), !0, a.detectMouseOnText, t, "LABEL_TEXTMOUSE", 0, g, f, d, -1)
                }
                t.restore()
            }

            function n() {
                var i, l, n, o, r, c, d, u, p, f, x = 2 * Math.PI / e.datasets[0].data.length,
                    A = a.startAngle * Math.PI / 180;
                if (t.font = a.pointLabelFontStyle + " " + Math.ceil(t.chartTextScale * a.pointLabelFontSize).toString() + "px " + a.pointLabelFontFamily, a.graphMaximized)
                    for (o = S.availableWidth / 2, n = S.availableWidth / 2, c = 40, p = 0; p < e.labels.length; p++) f = t.measureTextMultiLine(e.labels[p], Math.ceil(t.chartTextScale * a.scaleFontSize)).textWidth + t.measureTextMultiLine(e.labels[p], Math.ceil(t.chartTextScale * a.scaleFontSize)).textHeight, l = (S.availableWidth - f) / (1 + Math.abs(Math.cos(A))), A < Math.PI / 2 && A > -Math.PI / 2 || A > 3 * Math.PI / 2 ? o > l && (o = l) : 0 != Math.cos(A) && n > l && (n = l), A -= x;
                else o = S.availableWidth / 2, n = S.availableWidth / 2, c = 1;
                for (d = 0, u = 0, g = o + S.leftNotUsableSize, i = o, r = 0; c > r; ++r, i += (S.availableWidth - n - o) / c) {
                    for (s = Max([i, S.availableWidth - i]), A = a.startAngle * Math.PI / 180, l = S.available, p = 0; p < e.labels.length; p++) f = t.measureTextMultiLine(e.labels[p], Math.ceil(t.chartTextScale * a.scaleFontSize)).textWidth + t.measureTextMultiLine(e.labels[p], Math.ceil(t.chartTextScale * a.scaleFontSize)).textHeight, A < Math.PI / 2 && A > -Math.PI / 2 || A > 3 * Math.PI / 2 ? l = (S.availableWidth - i - f) / Math.abs(Math.cos(A)) : Math.cos(0 != A) && (l = (i - f) / Math.abs(Math.cos(A))), s > l && (s = l), Math.sin(A) * S.availableHeight / 2 > S.availableHeight / 2 - 2 * Math.ceil(t.chartTextScale * a.scaleFontSize) && (l = Math.sin(A) * S.availableHeight / 2 - 1.5 * Math.ceil(t.chartTextScale * a.scaleFontSize), s > l && (s = l)), A -= x;
                    s > d && (d = s, g = i + S.leftNotUsableSize)
                }
                s = d - Math.ceil(t.chartTextScale * a.scaleFontSize) / 2, h = Default(h, 5)
            }

            function o() {
                for (var i = -Number.MAX_VALUE, l = Number.MAX_VALUE, n = 0; n < e.datasets.length; n++)
                    for (var o = 0; o < e.datasets[n].data.length; o++) "undefined" != typeof e.datasets[n].data[o] && (1 * e.datasets[n].data[o] > i && (i = 1 * e.datasets[n].data[o]), 1 * e.datasets[n].data[o] < l && (l = 1 * e.datasets[n].data[o]));
                l > i && (i = 0, l = 0), Math.abs(i - l) < a.zeroValue && (Math.abs(i) < a.zeroValue && (i = .9, l = -.9), i > 0 ? (i = 1.1 * i, l = .9 * l) : (i = .9 * i, l = 1.1 * l)), "function" == typeof a.graphMin ? l = setOptionValue(1, "GRAPHMIN", t, e, x, void 0, a.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMin) || (l = a.graphMin), "function" == typeof a.graphMax ? i = setOptionValue(1, "GRAPHMAX", t, e, x, void 0, a.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMax) || (i = a.graphMax);
                var s = Math.floor(d / (.66 * h)),
                    r = Math.floor(d / h * .5);
                return l > i && (l = i - 1), {
                    maxValue: i,
                    minValue: l,
                    maxSteps: s,
                    minSteps: r
                }
            }
            var s, r, c, h, d, u, p, S, g, f;
            if (t.tpchart = "Radar", t.tpdata = 0, init_and_start(t, e, a)) {
                var x = initPassVariableData_part1(e, a, t);
                if (u = o(), a.logarithmic = !1, a.logarithmic2 = !1, e.labels || (e.labels = []), p = a.scaleShowLabels ? a.scaleLabel : "", a.scaleOverride) {
                    var A = setOptionValue(1, "SCALESTARTVALUE", t, e, x, void 0, a.scaleStartValue, -1, -1, {
                            nullValue: !0
                        }),
                        m = setOptionValue(1, "SCALESTEPS", t, e, x, void 0, a.scaleSteps, -1, -1, {
                            nullValue: !0
                        }),
                        M = setOptionValue(1, "SCALESTEPWIDTH", t, e, x, void 0, a.scaleStepWidth, -1, -1, {
                            nullValue: !0
                        });
                    c = {
                        steps: m,
                        stepValue: M,
                        graphMin: A,
                        graphMax: A + m * M,
                        labels: []
                    }, populateLabels(1, a, p, c.labels, c.steps, A, c.graphMax, M), S = setMeasures(e, a, t, height, width, c.labels, null, !0, !1, !1, !0, a.datasetFill, "Radar")
                } else c = calculateScale(1, a, u.maxSteps, u.minSteps, u.maxValue, u.minValue, p), S = setMeasures(e, a, t, height, width, c.labels, null, !0, !1, !1, !0, a.datasetFill, "Radar");
                n(), f = S.topNotUsableSize + S.availableHeight / 2, r = s / c.steps, initPassVariableData_part2(x, e, a, t, {
                    midPosX: g,
                    midPosY: f,
                    calculatedScale: c,
                    scaleHop: r,
                    maxSize: s,
                    outerVal: -1
                }), animationLoop(a, l, i, t, S.clrx, S.clry, S.clrwidth, S.clrheight, g, f, g - s, f + s, e, x)
            }
        },
        Pie = function(e, a, t) {
            return t.tpchart = "Pie", Doughnut(e, a, t)
        },
        Doughnut = function(e, a, t) {
            function i(i) {
                for (var c, d, u = (((-a.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), 0); u < e.length; u++) {
                    var p = 1,
                        S = 1;
                    if (c = "Pie" == t.tpchart ? h : h - (s - h) * setOptionValue(1, "EXPANDINRADIUS", t, e, r, e[u].expandInRadius, 0, u, -1, {
                            animationDecimal: i,
                            scaleAnimation: p
                        }), d = s + (s - h) * setOptionValue(1, "EXPANDOUTRADIUS", t, e, r, e[u].expandOutRadius, 0, u, -1, {
                                animationDecimal: i,
                                scaleAnimation: p
                            }), a.animation && (a.animateScale && (p = i), a.animateRotate && (S = i)), correctedRotateAnimation = animationCorrection(S, e, a, u, -1, 0).mainVal, "undefined" != typeof e[u].value && 1 * e[u].value >= 0) {
                        if (t.beginPath(), t.lineWidth = Math.ceil(t.chartLineScale * a.segmentStrokeWidth), t.strokeStyle = "rgba(0,0,0,0)", "ByArc" == a.animationByData) endAngle = r[u].startAngle + correctedRotateAnimation * r[u].segmentAngle, t.arc(n, o, p * d, r[u].startAngle, endAngle, !1), t.arc(n, o, p * c, endAngle, r[u].startAngle, !0);
                        else if (a.animationByData) {
                            if (!(r[u].startAngle - r[u].firstAngle < 2 * correctedRotateAnimation * Math.PI)) continue;
                            endAngle = r[u].endAngle, r[u].endAngle - r[u].firstAngle > 2 * correctedRotateAnimation * Math.PI && (endAngle = r[u].firstAngle + 2 * correctedRotateAnimation * Math.PI), t.arc(n, o, p * d, r[u].startAngle, endAngle, !1), t.arc(n, o, p * c, endAngle, r[u].startAngle, !0)
                        } else t.arc(n, o, p * d, r[u].firstAngle + correctedRotateAnimation * (r[u].startAngle - r[u].firstAngle), r[u].firstAngle + correctedRotateAnimation * (r[u].endAngle - r[u].firstAngle), !1), t.arc(n, o, p * c, r[u].firstAngle + correctedRotateAnimation * (r[u].endAngle - r[u].firstAngle), r[u].firstAngle + correctedRotateAnimation * (r[u].startAngle - r[u].firstAngle), !0);
                        t.closePath(), t.fillStyle = setOptionValue(1, "COLOR", t, e, r, e[u].color, a.defaultFillColor, u, -1, {
                            animationDecimal: i,
                            scaleAnimation: p
                        }), t.fill(), "merge" == a.segmentShowStroke ? (t.lineWidth = 1.5, t.strokeStyle = setOptionValue(1, "COLOR", t, e, r, e[u].color, a.defaultFillColor, u, -1, {
                            animationDecimal: i,
                            scaleAnimation: p
                        }), t.setLineDash([]), t.stroke()) : a.segmentShowStroke && (t.lineWidth = Math.ceil(t.chartLineScale * a.segmentStrokeWidth), t.strokeStyle = a.segmentStrokeColor, t.setLineDash(lineStyleFn(setOptionValue(1, "SEGMENTSTROKESTYLE", t, e, r, e[u].segmentStrokeStyle, a.segmentStrokeStyle, u, -1, {
                            animationDecimal: i,
                            scaleAnimation: p
                        }))), t.stroke(), t.setLineDash([]))
                    }
                }
                if (i >= a.animationStopValue)
                    for (u = 0; u < e.length; u++)
                        if ("Pie" == t.tpchart ? dataCutOutRadius = h : c = h - (s - h) * setOptionValue(1, "EXPANDINRADIUS", t, e, r, e[u].expandInRadius, 0, u, -1, {
                                    animationDecimal: i,
                                    scaleAnimation: p
                                }), d = s + (s - h) * setOptionValue(1, "EXPANDOUTRADIUS", t, e, r, e[u].expandOutRadius, 0, u, -1, {
                                    animationDecimal: i,
                                    scaleAnimation: p
                                }), !("undefined" == typeof e[u].value || 1 * e[u].value < 0) && (jsGraphAnnotate[t.ChartNewId][jsGraphAnnotate[t.ChartNewId].length] = ["ARC", u, -1, r, setOptionValue(1, "ANNOTATEDISPLAY", t, e, r, e[u].annotateDisplay, a.annotateDisplay, u, -1, {
                                nullValue: !0
                            })], setOptionValue(1, "INGRAPHDATASHOW", t, e, r, e[u].inGraphDataShow, a.inGraphDataShow, u, -1, {
                                nullValue: !0
                            }) && r[u].segmentAngle >= Math.PI / 180 * setOptionValue(1, "INGRAPHDATAMINIMUMANGLE", t, e, r, void 0, a.inGraphDataMinimumAngle, u, -1, {
                                nullValue: !0
                            }))) {
                            1 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", t, e, r, void 0, a.inGraphDataAnglePosition, u, -1, {
                                nullValue: !0
                            }) ? posAngle = r[u].realStartAngle + setOptionValue(1, "INGRAPHDATAPADDINANGLE", t, e, r, void 0, a.inGraphDataPaddingAngle, u, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180) : 2 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", t, e, r, void 0, a.inGraphDataAnglePosition, u, -1, {
                                nullValue: !0
                            }) ? posAngle = r[u].realStartAngle - r[u].segmentAngle / 2 + setOptionValue(1, "INGRAPHDATAPADDINANGLE", t, e, r, void 0, a.inGraphDataPaddingAngle, u, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180) : 3 == setOptionValue(1, "INGRAPHDATAANGLEPOSITION", t, e, r, void 0, a.inGraphDataAnglePosition, u, -1, {
                                nullValue: !0
                            }) && (posAngle = r[u].realStartAngle - r[u].segmentAngle + setOptionValue(1, "INGRAPHDATAPADDINANGLE", t, e, r, void 0, a.inGraphDataPaddingAngle, u, -1, {
                                    nullValue: !0
                                }) * (Math.PI / 180)), 1 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, r, void 0, a.inGraphDataRadiusPosition, u, -1, {
                                nullValue: !0
                            }) ? labelRadius = c + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, r, void 0, a.inGraphDataPaddingRadius, u, -1, {
                                    nullValue: !0
                                }) : 2 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, r, void 0, a.inGraphDataRadiusPosition, u, -1, {
                                nullValue: !0
                            }) ? labelRadius = c + (d - c) / 2 + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, r, void 0, a.inGraphDataPaddingRadius, u, -1, {
                                    nullValue: !0
                                }) : 3 == setOptionValue(1, "INGRAPHDATARADIUSPOSITION", t, e, r, void 0, a.inGraphDataRadiusPosition, u, -1, {
                                nullValue: !0
                            }) && (labelRadius = d + setOptionValue(1, "INGRAPHDATAPADDINGRADIUS", t, e, r, void 0, a.inGraphDataPaddingRadius, u, -1, {
                                    nullValue: !0
                                })), t.save(), "off-center" == setOptionValue(1, "INGRAPHDATAALIGN", t, e, r, void 0, a.inGraphDataAlign, u, -1, {
                                nullValue: !0
                            }) ? "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, r, void 0, a.inGraphDataRotate, u, -1, {
                                nullValue: !0
                            }) || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2 ? t.textAlign = "left" : t.textAlign = "right" : "to-center" == setOptionValue(1, "INGRAPHDATAALIGN", t, e, r, void 0, a.inGraphDataAlign, u, -1, {
                                nullValue: !0
                            }) ? "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, r, void 0, a.inGraphDataRotate, u, -1, {
                                nullValue: !0
                            }) || (posAngle + 2 * Math.PI) % (2 * Math.PI) > 3 * Math.PI / 2 || (posAngle + 2 * Math.PI) % (2 * Math.PI) < Math.PI / 2 ? t.textAlign = "right" : t.textAlign = "left" : t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, r, void 0, a.inGraphDataAlign, u, -1, {
                                nullValue: !0
                            }), "off-center" == setOptionValue(1, "INGRAPHDATAVALIGN", t, e, r, void 0, a.inGraphDataVAlign, u, -1, {
                                nullValue: !0
                            }) ? (posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI ? t.textBaseline = "top" : t.textBaseline = "bottom" : "to-center" == setOptionValue(1, "INGRAPHDATAVALIGN", t, e, r, void 0, a.inGraphDataVAlign, u, -1, {
                                nullValue: !0
                            }) ? (posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI ? t.textBaseline = "bottom" : t.textBaseline = "top" : t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, r, void 0, a.inGraphDataVAlign, u, -1, {
                                nullValue: !0
                            }), t.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", t, e, r, void 0, a.inGraphDataFontStyle, u, -1, {
                                    nullValue: !0
                                }) + " " + setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, r, void 0, a.inGraphDataFontSize, u, -1, {
                                    nullValue: !0
                                }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", t, e, r, void 0, a.inGraphDataFontFamily, u, -1, {
                                    nullValue: !0
                                }), t.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", t, e, r, void 0, a.inGraphDataFontColor, u, -1, {
                                nullValue: !0
                            });
                            var g = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", t, e, r, void 0, a.inGraphDataTmpl, u, -1, {
                                nullValue: !0
                            }), r[u], a);
                            t.translate(n + labelRadius * Math.cos(posAngle), o - labelRadius * Math.sin(posAngle));
                            var f = 0;
                            f = "inRadiusAxis" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, r, void 0, a.inGraphDataRotate, u, -1, {
                                nullValue: !0
                            }) ? 2 * Math.PI - posAngle : "inRadiusAxisRotateLabels" == setOptionValue(1, "INGRAPHDATAROTATE", t, e, r, void 0, a.inGraphDataRotate, u, -1, {
                                nullValue: !0
                            }) ? (posAngle + 2 * Math.PI) % (2 * Math.PI) > Math.PI / 2 && (posAngle + 2 * Math.PI) % (2 * Math.PI) < 3 * Math.PI / 2 ? 3 * Math.PI - posAngle : 2 * Math.PI - posAngle : setOptionValue(1, "INGRAPHDATAROTATE", t, e, r, void 0, a.inGraphDataRotate, u, -1, {
                                nullValue: !0
                            }) * (Math.PI / 180), t.rotate(f), setTextBordersAndBackground(t, g, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, r, void 0, a.inGraphDataFontSize, u, -1, {
                                nullValue: !0
                            }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", t, e, r, void 0, a.inGraphDataBorders, u, -1, {
                                nullValue: !0
                            }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", t, e, r, void 0, a.inGraphDataBordersColor, u, -1, {
                                nullValue: !0
                            }), setOptionValue(t.chartLineScale, "INGRAPHDATABORDERSWIDTH", t, e, r, void 0, a.inGraphDataBordersWidth, u, -1, {
                                nullValue: !0
                            }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", t, e, r, void 0, a.inGraphDataBordersXSpace, u, -1, {
                                nullValue: !0
                            }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", t, e, r, void 0, a.inGraphDataBordersYSpace, u, -1, {
                                nullValue: !0
                            }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", t, e, r, void 0, a.inGraphDataBordersStyle, u, -1, {
                                nullValue: !0
                            }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", t, e, r, void 0, a.inGraphDataBackgroundColor, u, -1, {
                                nullValue: !0
                            }), "INGRAPHDATA"), t.fillTextMultiLine(g, 0, 0, t.textBaseline, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, r, void 0, a.inGraphDataFontSize, u, -1, {
                                nullValue: !0
                            }), !0, a.detectMouseOnText, t, "INGRAPHDATA_TEXTMOUSE", f, n + labelRadius * Math.cos(posAngle), o - labelRadius * Math.sin(posAngle), u, -1), t.restore()
                        }
                l.legendMsr.dispLegend && drawLegend(l.legendMsr, e, a, t, "Doughnut")
            }
            var l, n, o, s;
            if ("undefined" == typeof t.tpchart && (t.tpchart = "Doughnut"), t.tpdata = 1, init_and_start(t, e, a)) {
                var r = initPassVariableData_part1(e, a, t);
                ((a.startAngle * (Math.PI / 180) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
                a.logarithmic = !1, a.logarithmic2 = !1, l = setMeasures(e, a, t, height, width, "none", null, !0, !1, !1, !1, !0, "Doughnut");
                var c = calculatePieDrawingSize(t, l, a, e, r);
                n = c.midPieX, o = c.midPieY, s = c.radius;
                var h;
                h = "Pie" == t.tpchart ? 0 : s * (a.percentageInnerCutout / 100), s > 0 ? (initPassVariableData_part2(r, e, a, t, {
                    midPosX: n,
                    midPosY: o,
                    int_radius: h,
                    ext_radius: s,
                    outerVal: -1
                }), animationLoop(a, null, i, t, l.clrx, l.clry, l.clrwidth, l.clrheight, n, o, n - s, o + s, e, r)) : testRedraw(t, e, a)
            }
        },
        Line = function(data, config, ctx) {
            function drawLines(e) {
                drawLinesDataset(e, data, config, ctx, statData, {
                    xAxisPosY: xAxisPosY,
                    yAxisPosX: yAxisPosX,
                    valueHop: valueHop,
                    nbValueHop: data.labels.length - 1
                }), e >= 1 && "function" == typeof drawMath && drawMath(ctx, config, data, msr, {
                    xAxisPosY: xAxisPosY,
                    yAxisPosX: yAxisPosX,
                    valueHop: valueHop,
                    scaleHop: scaleHop,
                    zeroY: zeroY,
                    calculatedScale: calculatedScale,
                    calculateOffset: calculateOffset,
                    statData: statData
                }), msr.legendMsr.dispLegend && drawLegend(msr.legendMsr, data, config, ctx, "Line")
            }

            function drawScale() {
                if (config.drawXScaleLine !== !1)
                    for (var e = 0; e < config.drawXScaleLine.length; e++) {
                        ctx.lineWidth = config.drawXScaleLine[e].lineWidth ? config.drawXScaleLine[e].lineWidth : Math.ceil(ctx.chartLineScale * config.scaleLineWidth), ctx.strokeStyle = config.drawXScaleLine[e].lineColor ? config.drawXScaleLine[e].lineColor : config.scaleLineColor, ctx.beginPath();
                        var a;
                        switch (config.drawXScaleLine[e].position) {
                            case "bottom":
                                a = xAxisPosY;
                                break;
                            case "top":
                                a = xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop);
                                break;
                            case "0":
                            case 0:
                                0 != zeroY && (a = xAxisPosY - zeroY)
                        }
                        ctx.moveTo(yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), a), ctx.lineTo(yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), a), ctx.setLineDash(lineStyleFn(config.scaleLineStyle)), ctx.stroke(), ctx.setLineDash([])
                    }
                for (var t = 0; t < data.labels.length; t++) ctx.beginPath(), ctx.moveTo(yAxisPosX + t * valueHop, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom)), ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), ctx.strokeStyle = config.scaleGridLineColor, config.scaleShowGridLines && t > 0 && t % config.scaleXGridLinesStep == 0 ? ctx.lineTo(yAxisPosX + t * valueHop, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop)) : ctx.lineTo(yAxisPosX + t * valueHop, xAxisPosY), ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle)), ctx.stroke(), ctx.setLineDash([]);
                ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleLineWidth), ctx.strokeStyle = config.scaleLineColor, ctx.beginPath(), ctx.moveTo(yAxisPosX, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom)), ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop)), ctx.setLineDash(lineStyleFn(config.scaleLineStyle)), ctx.stroke(), ctx.setLineDash([]);
                for (var i = 0; i < calculatedScale.steps; i++) ctx.beginPath(), ctx.moveTo(yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY - (i + 1) * scaleHop), ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), ctx.strokeStyle = config.scaleGridLineColor, config.scaleShowGridLines && (i + 1) % config.scaleYGridLinesStep == 0 ? ctx.lineTo(yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), xAxisPosY - (i + 1) * scaleHop) : ctx.lineTo(yAxisPosX, xAxisPosY - (i + 1) * scaleHop), ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle)), ctx.stroke(), ctx.setLineDash([])
            }

            function drawLabels() {
                if (ctx.font = config.scaleFontStyle + " " + Math.ceil(ctx.chartTextScale * config.scaleFontSize).toString() + "px " + config.scaleFontFamily, (config.xAxisTop || config.xAxisBottom) && (ctx.textBaseline = "top", msr.rotateLabels > 90 ? (ctx.save(), ctx.textAlign = "left") : msr.rotateLabels > 0 ? (ctx.save(), ctx.textAlign = "right") : ctx.textAlign = "center", ctx.fillStyle = config.scaleFontColor, config.xAxisBottom))
                    for (var e = 0; e < data.labels.length; e++) showLabels(ctx, data, config, e) && (ctx.save(), msr.rotateLabels > 0 ? (ctx.translate(yAxisPosX + e * valueHop - msr.highestXLabel / 2, msr.xLabelPos), ctx.rotate(-(msr.rotateLabels * (Math.PI / 180))), ctx.fillTextMultiLine(fmtChartJS(config, data.labels[e], config.fmtXLabel), 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "XSCALE_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + e * valueHop - msr.highestXLabel / 2, msr.xLabelPos, e, -1)) : ctx.fillTextMultiLine(fmtChartJS(config, data.labels[e], config.fmtXLabel), yAxisPosX + e * valueHop, msr.xLabelPos, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "XSCALE_TEXTMOUSE", 0, 0, 0, e, -1), ctx.restore());
                ctx.textAlign = "right", ctx.textBaseline = "middle";
                for (var a = config.showYAxisMin ? -1 : 0; a < calculatedScale.steps; a++) config.scaleShowLabels && showYLabels(ctx, data, config, a + 1, calculatedScale.labels[a + 1]) && (config.yAxisLeft && (ctx.textAlign = "right", ctx.fillTextMultiLine(parseFloat(calculatedScale.labels[a + 1]).toFixed(config.yAxisFormat), yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (a + 1) * scaleHop, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, a)), config.yAxisRight && !valueBounds.dbAxis && (ctx.textAlign = "left", ctx.fillTextMultiLine(calculatedScale.labels[a + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (a + 1) * scaleHop, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, a)));
                if (config.yAxisRight && valueBounds.dbAxis)
                    for (a = config.showYAxisMin ? -1 : 0; a < calculatedScale2.steps; a++) config.scaleShowLabels && (ctx.textAlign = "left", ctx.fillTextMultiLine(calculatedScale2.labels[a + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (a + 1) * scaleHop2, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, a))
            }

            function getValueBounds() {
                for (var upperValue = -Number.MAX_VALUE, lowerValue = Number.MAX_VALUE, upperValue2 = -Number.MAX_VALUE, lowerValue2 = Number.MAX_VALUE, secondAxis = !1, firstAxis = !1, mathValueHeight, i = 0; i < data.datasets.length; i++) {
                    var mathFctName = data.datasets[i].drawMathDeviation,
                        mathValueHeight = 0, mathValueHeightVal;
                    if ("function" == typeof eval(mathFctName)) {
                        var parameter = {
                            data: data,
                            datasetNr: i
                        };
                        mathValueHeightVal = window[mathFctName](parameter)
                    } else mathValueHeightVal = 0;
                    for (var j = 0; j < data.datasets[i].data.length; j++) mathValueHeight = "object" == typeof mathValueHeightVal ? mathValueHeightVal[Math.min(mathValueHeightVal.length, j)] : mathValueHeightVal, "undefined" != typeof data.datasets[i].data[j] && (2 == data.datasets[i].axis ? (secondAxis = !0, 1 * data.datasets[i].data[j] + mathValueHeight > upperValue2 && (upperValue2 = 1 * data.datasets[i].data[j] + mathValueHeight), 1 * data.datasets[i].data[j] - mathValueHeight < lowerValue2 && (lowerValue2 = 1 * data.datasets[i].data[j] - mathValueHeight)) : (firstAxis = !0, 1 * data.datasets[i].data[j] + mathValueHeight > upperValue && (upperValue = 1 * data.datasets[i].data[j] + mathValueHeight), 1 * data.datasets[i].data[j] - mathValueHeight < lowerValue && (lowerValue = 1 * data.datasets[i].data[j] - mathValueHeight)))
                }
                lowerValue > upperValue && (upperValue = 0, lowerValue = 0), Math.abs(upperValue - lowerValue) < config.zeroValue && (Math.abs(upperValue) < config.zeroValue && (upperValue = .9), upperValue > 0 ? (upperValue = 1.1 * upperValue, lowerValue = .9 * lowerValue) : (upperValue = .9 * upperValue, lowerValue = 1.1 * lowerValue)), "function" == typeof config.graphMin ? lowerValue = setOptionValue(1, "GRAPHMIN", ctx, data, statData, void 0, config.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMin) || (lowerValue = config.graphMin), "function" == typeof config.graphMax ? upperValue = setOptionValue(1, "GRAPHMAX", ctx, data, statData, void 0, config.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMax) || (upperValue = config.graphMax), secondAxis && (lowerValue2 > upperValue2 && (upperValue2 = 0, lowerValue2 = 0), Math.abs(upperValue2 - lowerValue2) < config.zeroValue && (Math.abs(upperValue2) < config.zeroValue && (upperValue2 = .9), upperValue2 > 0 ? (upperValue2 = 1.1 * upperValue2, lowerValue2 = .9 * lowerValue2) : (upperValue2 = .9 * upperValue2, lowerValue2 = 1.1 * lowerValue2)), "function" == typeof config.graphMin2 ? lowerValue2 = setOptionValue(1, "GRAPHMIN", ctx, data, statData, void 0, config.graphMin2, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMin2) || (lowerValue2 = config.graphMin2), "function" == typeof config.graphMax2 ? upperValue2 = setOptionValue(1, "GRAPHMAX", ctx, data, statData, void 0, config.graphMax2, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMax2) || (upperValue2 = config.graphMax2)), !firstAxis && secondAxis && (upperValue = upperValue2, lowerValue = lowerValue2), labelHeight = Math.ceil(ctx.chartTextScale * config.scaleFontSize), scaleHeight = msr.availableHeight;
                var maxSteps = Math.floor(scaleHeight / (.66 * labelHeight)),
                    minSteps = Math.floor(scaleHeight / labelHeight * .5);
                return lowerValue > upperValue && (lowerValue = upperValue - 1), lowerValue2 > upperValue2 && (lowerValue2 = upperValue2 - 1), {
                    maxValue: config.yMaximum == "smart" ? upperValue : config.yMaximum,
                    minValue: config.yMinimum == "smart" ? lowerValue : config.yMinimum,
                    maxValue2: config.yMaximum == "smart" ? upperValue2 : config.yMaximum,
                    minValue2: config.yMinimum == "smart" ? lowerValue2 : config.yMinimum,
                    dbAxis: secondAxis,
                    maxSteps: maxSteps,
                    minSteps: minSteps
                }
            }
            var maxSize, scaleHop, scaleHop2, calculatedScale, calculatedScale2, labelHeight, scaleHeight, valueBounds, labelTemplateString, labelTemplateString2, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, rotateLabels = 0,
                msr, zeroY = 0,
                zeroY2 = 0;

            if (ctx.tpchart = "Line", ctx.tpdata = 0, init_and_start(ctx, data, config)) {
                for (var mxlgt = 0, i = 0; i < data.datasets.length; i++) mxlgt = Max([mxlgt, data.datasets[i].data.length]);
                if (1 == mxlgt) {
                    for ("string" == typeof data.labels[0] && (data.labels = ["", data.labels[0], ""], data.times = [undefined, data.times[0], undefined]), i = 0; i < data.datasets.length; i++) data.datasets[i].data = [void 0, data.datasets[i].data[0], void 0];
                    mxlgt = 3
                }
                var statData = initPassVariableData_part1(data, config, ctx);
                for (i = 0; i < data.datasets.length; i++) statData[i][0].tpchart = "Line";
                msr = setMeasures(data, config, ctx, height, width, "nihil", [""], !1, !1, !0, !0, config.datasetFill, "Line"), valueBounds = getValueBounds(), config.logarithmic !== !1 && valueBounds.minValue <= 0 && (config.logarithmic = !1), config.logarithmic2 !== !1 && valueBounds.minValue2 <= 0 && (config.logarithmic2 = !1);
                var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
                ("fuzzy" == config.logarithmic && 4 > OrderOfMagnitude || config.scaleOverride) && (config.logarithmic = !1);
                var OrderOfMagnitude2 = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue2) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue2)));
                if (("fuzzy" == config.logarithmic2 && 4 > OrderOfMagnitude2 || config.scaleOverride2) && (config.logarithmic2 = !1), labelTemplateString = config.scaleShowLabels ? config.scaleLabel : "", labelTemplateString2 = config.scaleShowLabels2 ? config.scaleLabel2 : "", config.scaleOverride) {
                    var scaleStartValue = setOptionValue(1, "SCALESTARTVALUE", ctx, data, statData, void 0, config.scaleStartValue, -1, -1, {
                            nullValue: !0
                        }),
                        scaleSteps = setOptionValue(1, "SCALESTEPS", ctx, data, statData, void 0, config.scaleSteps, -1, -1, {
                            nullValue: !0
                        }),
                        scaleStepWidth = setOptionValue(1, "SCALESTEPWIDTH", ctx, data, statData, void 0, config.scaleStepWidth, -1, -1, {
                            nullValue: !0
                        });
                    calculatedScale = {
                        steps: scaleSteps,
                        stepValue: scaleStepWidth,
                        graphMin: scaleStartValue,
                        graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
                        labels: []
                    }, populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth)
                } else valueBounds.maxSteps > 0 && valueBounds.minSteps > 0 && (calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString));
                if (valueBounds.dbAxis)
                    if (config.scaleOverride2) {
                        var scaleStartValue2 = setOptionValue(1, "SCALESTARTVALUE2", ctx, data, statData, void 0, config.scaleStartValue2, -1, -1, {
                                nullValue: !0
                            }),
                            scaleSteps2 = setOptionValue(1, "SCALESTEPS2", ctx, data, statData, void 0, config.scaleSteps2, -1, -1, {
                                nullValue: !0
                            }),
                            scaleStepWidth2 = setOptionValue(1, "SCALESTEPWIDTH2", ctx, data, statData, void 0, config.scaleStepWidth2, -1, -1, {
                                nullValue: !0
                            });
                        calculatedScale2 = {
                            steps: scaleSteps2,
                            stepValue: scaleStepWidth2,
                            graphMin: scaleStartValue2,
                            graphMax: scaleStartValue2 + scaleSteps2 * scaleStepWidth2,
                            labels: []
                        }, populateLabels(2, config, labelTemplateString2, calculatedScale2.labels, calculatedScale2.steps, scaleStartValue2, calculatedScale2.graphMax, scaleStepWidth2)
                    } else valueBounds.maxSteps > 0 && valueBounds.minSteps > 0 && (calculatedScale2 = calculateScale(2, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue2, valueBounds.minValue2, labelTemplateString2));
                else calculatedScale2 = {
                    steps: 0,
                    stepValue: 0,
                    graphMin: 0,
                    graphMax: 0,
                    labels: null
                };
                if (valueBounds.maxSteps > 0 && valueBounds.minSteps > 0) {
                    msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, calculatedScale2.labels, !1, !1, !0, !0, config.datasetFill, "Line");
                    var prevHeight = msr.availableHeight;
                    msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop), msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps), scaleHop2 = Math.floor(msr.availableHeight / calculatedScale2.steps), valueHop = Math.floor(msr.availableWidth / (data.labels.length - 1)), (0 == valueHop || config.fullWidthGraph) && (valueHop = msr.availableWidth / (data.labels.length - 1)), msr.clrwidth = msr.clrwidth - (msr.availableWidth - (data.labels.length - 1) * valueHop), msr.availableWidth = (data.labels.length - 1) * valueHop, msr.xLabelPos += Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop) - (prevHeight - msr.availableHeight), msr.clrheight += Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop) - (prevHeight - msr.availableHeight), yAxisPosX = msr.leftNotUsableSize + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY = msr.topNotUsableSize + msr.availableHeight + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop), drawLabels(), valueBounds.minValue < 0 && (zeroY = calculateOffset(config.logarithmic, 0, calculatedScale, scaleHop)), valueBounds.minValue2 < 0 && (zeroY2 = calculateOffset(config.logarithmic2, 0, calculatedScale2, scaleHop2)), initPassVariableData_part2(statData, data, config, ctx, {
                        xAxisPosY: xAxisPosY,
                        yAxisPosX: yAxisPosX,
                        valueHop: valueHop,
                        nbValueHop: data.labels.length - 1,
                        scaleHop: scaleHop,
                        zeroY: zeroY,
                        calculatedScale: calculatedScale,
                        logarithmic: config.logarithmic,
                        scaleHop2: scaleHop2,
                        zeroY2: zeroY2,
                        msr: msr,
                        calculatedScale2: calculatedScale2,
                        logarithmic2: config.logarithmic2
                    }), animationLoop(config, drawScale, drawLines, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData)
                } else testRedraw(ctx, data, config)
            }
        },
        StackedBar = function(e, a, t) {
            function i(i) {
                t.lineWidth = Math.ceil(t.chartLineScale * a.barStrokeWidth);
                for (var l = 0; l < e.datasets.length; l++)
                    if ("Line" != e.datasets[l].type)
                        for (var n = 0; n < e.datasets[l].data.length; n++) {
                            var o = animationCorrection(i, e, a, l, n, 1).animVal;
                            if (o > 1 && (o -= 1), "undefined" != typeof e.datasets[l].data[n] && 1 * e.datasets[l].data[n] != 0) {
                                var s, r;
                                a.animationByDataset ? (s = A[l][n].yPosBottom, r = A[l][n].yPosTop, r = s + o * (r - s)) : (s = A[A[l][n].firstNotMissing][n].yPosBottom - o * (A[A[l][n].firstNotMissing][n].yPosBottom - A[l][n].yPosBottom), r = A[A[l][n].firstNotMissing][n].yPosBottom - o * (A[A[l][n].firstNotMissing][n].yPosBottom - A[l][n].yPosTop)), t.fillStyle = setOptionValue(1, "COLOR", t, e, A, e.datasets[l].fillColor, a.defaultFillColor, l, n, {
                                    animationValue: o,
                                    xPosLeft: A[l][n].xPosLeft,
                                    yPosBottom: s,
                                    xPosRight: A[l][n].xPosRight,
                                    yPosTop: r
                                }), t.strokeStyle = setOptionValue(1, "STROKECOLOR", t, e, A, e.datasets[l].strokeColor, a.defaultStrokeColor, l, n, {
                                    nullvalue: null
                                }), 0 != o && s != r && (t.beginPath(), t.moveTo(A[l][n].xPosLeft, s), t.lineTo(A[l][n].xPosLeft, r), t.lineTo(A[l][n].xPosRight, r), t.lineTo(A[l][n].xPosRight, s), a.barShowStroke && (t.setLineDash(lineStyleFn(setOptionValue(1, "STROKESTYLE", t, e, A, e.datasets[l].datasetStrokeStyle, a.datasetStrokeStyle, l, n, {
                                    nullvalue: null
                                }))), t.stroke(), t.setLineDash([])), t.closePath(), t.fill())
                            }
                        }
                if (drawLinesDataset(i, e, a, t, A, {
                        xAxisPosY: g,
                        yAxisPosX: S,
                        valueHop: p,
                        nbValueHop: e.labels.length
                    }), i >= a.animationStopValue) {
                    var c = 0,
                        h = 0;
                    for (l = 0; l < e.datasets.length; l++)
                        for (n = 0; n < e.datasets[l].data.length; n++)
                            if ("undefined" != typeof e.datasets[l].data[n] && (jsGraphAnnotate[t.ChartNewId][jsGraphAnnotate[t.ChartNewId].length] = ["RECT", l, n, A, setOptionValue(1, "ANNOTATEDISPLAY", t, e, A, e.datasets[l].annotateDisplay, a.annotateDisplay, l, n, {
                                    nullValue: !0
                                })], setOptionValue(1, "INGRAPHDATASHOW", t, e, A, e.datasets[l].inGraphDataShow, a.inGraphDataShow, l, n, {
                                    nullValue: !0
                                }))) {
                                t.save(), t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, A, void 0, a.inGraphDataAlign, l, n, {
                                    nullValue: !0
                                }), t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, A, void 0, a.inGraphDataVAlign, l, n, {
                                    nullValue: !0
                                }), t.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", t, e, A, void 0, a.inGraphDataFontStyle, l, n, {
                                        nullValue: !0
                                    }) + " " + setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, A, void 0, a.inGraphDataFontSize, l, n, {
                                        nullValue: !0
                                    }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", t, e, A, void 0, a.inGraphDataFontFamily, l, n, {
                                        nullValue: !0
                                    }), t.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", t, e, A, void 0, a.inGraphDataFontColor, l, n, {
                                    nullValue: !0
                                });
                                var d = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", t, e, A, void 0, a.inGraphDataTmpl, l, n, {
                                    nullValue: !0
                                }), A[l][n], a);
                                if (t.beginPath(), t.beginPath(), c = 0, h = 0, 1 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, A, void 0, a.inGraphDataXPosition, l, n, {
                                        nullValue: !0
                                    }) ? h = A[l][n].xPosLeft + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, A, void 0, a.inGraphDataPaddingX, l, n, {
                                            nullValue: !0
                                        }) : 2 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, A, void 0, a.inGraphDataXPosition, l, n, {
                                        nullValue: !0
                                    }) ? h = A[l][n].xPosLeft + f / 2 + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, A, void 0, a.inGraphDataPaddingX, l, n, {
                                            nullValue: !0
                                        }) : 3 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, A, void 0, a.inGraphDataXPosition, l, n, {
                                        nullValue: !0
                                    }) && (h = A[l][n].xPosLeft + f + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, A, void 0, a.inGraphDataPaddingX, l, n, {
                                            nullValue: !0
                                        })), 1 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, A, void 0, a.inGraphDataYPosition, l, n, {
                                        nullValue: !0
                                    }) ? c = A[l][n].yPosBottom - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, A, void 0, a.inGraphDataPaddingY, l, n, {
                                            nullValue: !0
                                        }) : 2 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, A, void 0, a.inGraphDataYPosition, l, n, {
                                        nullValue: !0
                                    }) ? c = (A[l][n].yPosTop + A[l][n].yPosBottom) / 2 - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, A, void 0, a.inGraphDataPaddingY, l, n, {
                                            nullValue: !0
                                        }) : 3 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, A, void 0, a.inGraphDataYPosition, l, n, {
                                        nullValue: !0
                                    }) && (c = A[l][n].yPosTop - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, A, void 0, a.inGraphDataPaddingY, l, n, {
                                            nullValue: !0
                                        })), c > x.topNotUsableSize) {
                                    t.translate(h, c);
                                    var u = setOptionValue(1, "INGRAPHDATAROTATE", t, e, A, void 0, a.inGraphDataRotate, l, n, {
                                            nullValue: !0
                                        }) * (Math.PI / 180);
                                    t.rotate(u), setTextBordersAndBackground(t, d, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, A, void 0, a.inGraphDataFontSize, l, n, {
                                        nullValue: !0
                                    }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", t, e, A, void 0, a.inGraphDataBorders, l, n, {
                                        nullValue: !0
                                    }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", t, e, A, void 0, a.inGraphDataBordersColor, l, n, {
                                        nullValue: !0
                                    }), setOptionValue(t.chartLineScale, "INGRAPHDATABORDERSWIDTH", t, e, A, void 0, a.inGraphDataBordersWidth, l, n, {
                                        nullValue: !0
                                    }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", t, e, A, void 0, a.inGraphDataBordersXSpace, l, n, {
                                        nullValue: !0
                                    }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", t, e, A, void 0, a.inGraphDataBordersYSpace, l, n, {
                                        nullValue: !0
                                    }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", t, e, A, void 0, a.inGraphDataBordersStyle, l, n, {
                                        nullValue: !0
                                    }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", t, e, A, void 0, a.inGraphDataBackgroundColor, l, n, {
                                        nullValue: !0
                                    }), "INGRAPHDATA"), t.fillTextMultiLine(d, 0, 0, t.textBaseline, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, A, void 0, a.inGraphDataFontSize, l, n, {
                                        nullValue: !0
                                    }), !0, a.detectMouseOnText, t, "INGRAPHDATA_TEXTMOUSE", u, h, c, l, n)
                                }
                                t.restore()
                            }
                }
                x.legendMsr.dispLegend && drawLegend(x.legendMsr, e, a, t, "StackedBar")
            }

            function l() {
                t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.strokeStyle = a.scaleLineColor, t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.beginPath(), t.moveTo(S - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), g), t.lineTo(S + x.availableWidth + Math.ceil(t.chartLineScale * a.scaleTickSizeRight), g), t.stroke(), t.setLineDash([]), t.setLineDash(lineStyleFn(a.scaleGridLineStyle));
                for (var i = 0; i < e.labels.length; i++) t.beginPath(), t.moveTo(S + i * p, g + Math.ceil(t.chartLineScale * a.scaleTickSizeBottom)), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleGridLineWidth), t.strokeStyle = a.scaleGridLineColor, a.scaleShowGridLines && i > 0 && i % a.scaleXGridLinesStep == 0 ? t.lineTo(S + i * p, g - x.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeTop)) : t.lineTo(S + i * p, g), t.stroke();
                t.setLineDash([]), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.strokeStyle = a.scaleLineColor, t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.beginPath(), t.moveTo(S, g + Math.ceil(t.chartLineScale * a.scaleTickSizeBottom)), t.lineTo(S, g - x.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeTop)), t.stroke(), t.setLineDash([]), t.setLineDash(lineStyleFn(a.scaleGridLineStyle));
                for (var l = a.showYAxisMin ? -1 : 0; l < r.steps; l++) t.beginPath(), t.moveTo(S - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), g - (l + 1) * s), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleGridLineWidth), t.strokeStyle = a.scaleGridLineColor, a.scaleShowGridLines && (l + 1) % a.scaleYGridLinesStep == 0 ? t.lineTo(S + x.availableWidth + Math.ceil(t.chartLineScale * a.scaleTickSizeRight), g - (l + 1) * s) : t.lineTo(S, g - (l + 1) * s), t.stroke();
                t.setLineDash([])
            }

            function n() {
                if (t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, (a.xAxisTop || a.xAxisBottom) && (t.textBaseline = "top", x.rotateLabels > 90 ? (t.save(), t.textAlign = "left") : x.rotateLabels > 0 ? (t.save(), t.textAlign = "right") : t.textAlign = "center", t.fillStyle = a.scaleFontColor, a.xAxisBottom))
                    for (var i = 0; i < e.labels.length; i++) showLabels(t, e, a, i) && (t.save(), x.rotateLabels > 0 ? (t.translate(S + Math.ceil(t.chartSpaceScale * a.barValueSpacing) + i * p + D + f / 2 - x.highestXLabel / 2, x.xLabelPos), t.rotate(-(x.rotateLabels * (Math.PI / 180))), t.fillTextMultiLine(fmtChartJS(a, e.labels[i], a.fmtXLabel), 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "XAXIS_TEXTMOUSE", -(x.rotateLabels * (Math.PI / 180)), S + Math.ceil(t.chartSpaceScale * a.barValueSpacing) + i * p + D + f / 2 - x.highestXLabel / 2, x.xLabelPos, i, -1)) : t.fillTextMultiLine(fmtChartJS(a, e.labels[i], a.fmtXLabel), S + Math.ceil(t.chartSpaceScale * a.barValueSpacing) + i * p + D + f / 2, x.xLabelPos, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1), t.restore());
                t.textAlign = "right", t.textBaseline = "middle";
                for (var l = a.showYAxisMin ? -1 : 0; l < r.steps; l++) a.scaleShowLabels && showYLabels(t, e, a, l + 1, r.labels[l + 1]) && (a.yAxisLeft && (t.textAlign = "right", t.fillTextMultiLine(r.labels[l + 1], S - (Math.ceil(t.chartLineScale * a.scaleTickSizeLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), g - (l + 1) * s, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, l)), a.yAxisRight && (t.textAlign = "left", t.fillTextMultiLine(r.labels[l + 1], S + x.availableWidth + (Math.ceil(t.chartLineScale * a.scaleTickSizeRight) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), g - (l + 1) * s, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, l)))
            }

            function o() {
                for (var i = -Number.MAX_VALUE, l = Number.MAX_VALUE, n = -Number.MAX_VALUE, o = Number.MAX_VALUE, s = [], r = [], d = 0, u = 0, p = 0; p < e.datasets.length; p++)
                    for (var S = 0; S < e.datasets[p].data.length; S++) 1 * e.datasets[p].data[S] > 0 ? ("Bar" == A[p][0].tpchart ? ("undefined" == typeof s[S] && (s[S] = 0), s[S] += 1 * e.datasets[p].data[S], i = Math.max(i, s[S])) : i = Math.max(i, 1 * e.datasets[p].data[S]), l = Math.min(l, 1 * e.datasets[p].data[S]), d = 1) : "number" == typeof(1 * e.datasets[p].data[S]) && "undefined" != typeof e.datasets[p].data[S] && ("Bar" == A[p][0].tpchart ? ("undefined" == typeof r[S] && (r[S] = 0), r[S] += 1 * e.datasets[p].data[S], o = Math.min(o, r[S])) : o = Math.min(o, 1 * e.datasets[p].data[S]), n = Math.max(n, 1 * e.datasets[p].data[S]), u = 1);
                var g, f;
                0 == d ? (g = n, f = o) : 0 == u ? (g = i, f = l) : (g = i, f = o), "function" == typeof a.graphMin ? f = setOptionValue(1, "GRAPHMIN", t, e, A, void 0, a.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMin) || (f = a.graphMin), "function" == typeof a.graphMax ? g = setOptionValue(1, "GRAPHMAX", t, e, A, void 0, a.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMax) || (g = a.graphMax), f > g && (g = 0, f = 0), Math.abs(g - f) < a.zeroValue && (Math.abs(g) < a.zeroValue && (g = .9), g > 0 ? (g = 1.1 * g, f = .9 * f) : (g = .9 * g, f = 1.1 * f)), c = Math.ceil(t.chartTextScale * a.scaleFontSize), h = x.availableHeight;
                var m = Math.floor(h / (.66 * c)),
                    M = Math.floor(h / c * .5);
                return f > g && (f = g - 1), {
                    maxValue: g,
                    minValue: f,
                    maxSteps: m,
                    minSteps: M
                }
            }
            var s, r, c, h, d, u, p, S, g, f, x;
            if (t.tpchart = "StackedBar", t.tpdata = 0, init_and_start(t, e, a)) {
                for (var A = initPassVariableData_part1(e, a, t), m = e.datasets.length, M = 0; M < e.datasets.length; M++) "Line" == e.datasets[M].type ? (A[M][0].tpchart = "Line", m--) : A[M][0].tpchart = "Bar";
                if (a.logarithmic = !1, x = setMeasures(e, a, t, height, width, "nihil", [""], !0, !1, !0, !0, !0, "StackedBar"), d = o(), d.maxSteps > 0 && d.minSteps > 0) {
                    if (u = a.scaleShowLabels ? a.scaleLabel : "", a.scaleOverride) {
                        var P = setOptionValue(1, "SCALESTARTVALUE", t, e, A, void 0, a.scaleStartValue, -1, -1, {
                                nullValue: !0
                            }),
                            T = setOptionValue(1, "SCALESTEPS", t, e, A, void 0, a.scaleSteps, -1, -1, {
                                nullValue: !0
                            }),
                            v = setOptionValue(1, "SCALESTEPWIDTH", t, e, A, void 0, a.scaleStepWidth, -1, -1, {
                                nullValue: !0
                            });
                        r = {
                            steps: T,
                            stepValue: v,
                            graphMin: P,
                            labels: []
                        };
                        for (var M = 0; M <= r.steps; M++) u && r.labels.push(tmpl(u, {
                            value: fmtChartJS(a, 1 * (P + v * M).toFixed(getDecimalPlaces(v)), a.fmtYLabel)
                        }, a));
                        x = setMeasures(e, a, t, height, width, r.labels, null, !0, !1, !0, !0, !0, "StackedBar")
                    } else r = calculateScale(1, a, d.maxSteps, d.minSteps, d.maxValue, d.minValue, u), x = setMeasures(e, a, t, height, width, r.labels, null, !0, !1, !0, !0, !0, "StackedBar");
                    var L = x.availableHeight;
                    x.availableHeight = x.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeBottom) - Math.ceil(t.chartLineScale * a.scaleTickSizeTop), x.availableWidth = x.availableWidth - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft) - Math.ceil(t.chartLineScale * a.scaleTickSizeRight), s = Math.floor(x.availableHeight / r.steps), p = Math.floor(x.availableWidth / e.labels.length), (0 == p || a.fullWidthGraph) && (p = x.availableWidth / e.labels.length), x.clrwidth = x.clrwidth - (x.availableWidth - e.labels.length * p), x.availableWidth = e.labels.length * p, x.availableHeight = r.steps * s, x.xLabelPos += Math.ceil(t.chartLineScale * a.scaleTickSizeBottom) + Math.ceil(t.chartLineScale * a.scaleTickSizeTop) - (L - x.availableHeight), x.clrheight += Math.ceil(t.chartLineScale * a.scaleTickSizeBottom) + Math.ceil(t.chartLineScale * a.scaleTickSizeTop) - (L - x.availableHeight), S = x.leftNotUsableSize + Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), g = x.topNotUsableSize + x.availableHeight + Math.ceil(t.chartLineScale * a.scaleTickSizeTop), f = p - 2 * Math.ceil(t.chartLineScale * a.scaleGridLineWidth) - 2 * Math.ceil(t.chartSpaceScale * a.barValueSpacing) - (1 * Math.ceil(t.chartSpaceScale * a.barDatasetSpacing) - 1) - Math.ceil(t.chartLineScale * a.barStrokeWidth) / 2 - 1, f >= 0 && 1 >= f && (f = 1), 0 > f && f >= -1 && (f = -1);
                    var D;
                    1 * a.maxBarWidth > 0 && f > 1 * a.maxBarWidth ? (D = (f - 1 * a.maxBarWidth) / 2, f = 1 * a.maxBarWidth) : D = 0;
                    var y = 0,
                        V = 0;
                    d.minValue < 0 && (y = calculateOffset(!1, 0, r, s)), d.minValue2 < 0 && (V = calculateOffset(a.logarithmic2, 0, calculatedScale2, scaleHop2)), n(), initPassVariableData_part2(A, e, a, t, {
                        msr: x,
                        zeroY: y,
                        zeroY2: V,
                        logarithmic: !1,
                        logarithmic2: !1,
                        calculatedScale: r,
                        additionalSpaceBetweenBars: D,
                        scaleHop: s,
                        valueHop: p,
                        yAxisPosX: S,
                        xAxisPosY: g,
                        barWidth: f
                    }), animationLoop(a, l, i, t, x.clrx, x.clry, x.clrwidth, x.clrheight, S + x.availableWidth / 2, g - x.availableHeight / 2, S, g, e, A)
                } else testRedraw(t, e, a)
            }
        },
        HorizontalStackedBar = function(e, a, t) {
            function i(e, a, t) {
                var i = a.steps * a.stepValue,
                    l = e - a.graphMin,
                    n = CapValue(l / i, 1, 0);
                return t * a.steps * n
            }

            function l(i) {
                t.lineWidth = Math.ceil(t.chartLineScale * a.barStrokeWidth);
                for (var l = 0; l < e.datasets.length; l++)
                    for (var n = 0; n < e.datasets[l].data.length; n++) {
                        var o = animationCorrection(i, e, a, l, n, 1).animVal;
                        if (o > 1 && (o -= 1), "undefined" != typeof e.datasets[l].data[n] && 1 * e.datasets[l].data[n] != 0) {
                            var s, r;
                            a.animationByDataset ? (s = m[l][n].xPosLeft, r = m[l][n].xPosRight, r = s + o * (r - s)) : (s = m[m[l][n].firstNotMissing][n].xPosLeft + o * (m[l][n].xPosLeft - m[m[l][n].firstNotMissing][n].xPosLeft), r = m[m[l][n].firstNotMissing][n].xPosLeft + o * (m[l][n].xPosRight - m[m[l][n].firstNotMissing][n].xPosLeft)), t.fillStyle = setOptionValue(1, "COLOR", t, e, m, e.datasets[l].fillColor, a.defaultFillColor, l, n, {
                                animationValue: o,
                                xPosLeft: s,
                                yPosBottom: m[l][n].yPosBottom,
                                xPosRight: r,
                                yPosTop: m[l][n].yPosBottom
                            }), t.strokeStyle = setOptionValue(1, "STROKECOLOR", t, e, m, e.datasets[l].strokeColor, a.defaultStrokeColor, l, n, {
                                nullvalue: null
                            }), 0 != o && m[l][n].xPosLeft != m[l][n].xPosRight && (t.beginPath(), t.moveTo(s, m[l][n].yPosTop), t.lineTo(r, m[l][n].yPosTop), t.lineTo(r, m[l][n].yPosBottom), t.lineTo(s, m[l][n].yPosBottom), t.lineTo(s, m[l][n].yPosTop), a.barShowStroke && (t.setLineDash(lineStyleFn(setOptionValue(1, "STROKESTYLE", t, e, m, e.datasets[l].datasetStrokeStyle, a.datasetStrokeStyle, l, n, {
                                nullvalue: null
                            }))), t.stroke(), t.setLineDash([])), t.closePath(), t.fill())
                        }
                    }
                if (i >= a.animationStopValue) {
                    var c = 0,
                        h = 0;
                    for (l = 0; l < e.datasets.length; l++)
                        for (n = 0; n < e.datasets[l].data.length; n++)
                            if ("undefined" != typeof e.datasets[l].data[n] && (jsGraphAnnotate[t.ChartNewId][jsGraphAnnotate[t.ChartNewId].length] = ["RECT", l, n, m, setOptionValue(1, "ANNOTATEDISPLAY", t, e, m, e.datasets[l].annotateDisplay, a.annotateDisplay, l, n, {
                                    nullValue: !0
                                })], setOptionValue(1, "INGRAPHDATASHOW", t, e, m, e.datasets[l].inGraphDataShow, a.inGraphDataShow, l, n, {
                                    nullValue: !0
                                }))) {
                                t.save(), t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, m, void 0, a.inGraphDataAlign, l, n, {
                                    nullValue: !0
                                }), t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, m, void 0, a.inGraphDataVAlign, l, n, {
                                    nullValue: !0
                                }), t.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", t, e, m, void 0, a.inGraphDataFontStyle, l, n, {
                                        nullValue: !0
                                    }) + " " + setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, l, n, {
                                        nullValue: !0
                                    }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", t, e, m, void 0, a.inGraphDataFontFamily, l, n, {
                                        nullValue: !0
                                    }), t.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", t, e, m, void 0, a.inGraphDataFontColor, l, n, {
                                    nullValue: !0
                                });
                                var d = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", t, e, m, void 0, a.inGraphDataTmpl, l, n, {
                                    nullValue: !0
                                }), m[l][n], a);
                                t.beginPath(), c = 0, h = 0, 1 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, m, void 0, a.inGraphDataXPosition, l, n, {
                                    nullValue: !0
                                }) ? h = m[l][n].xPosLeft + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, m, void 0, a.inGraphDataPaddingX, l, n, {
                                        nullValue: !0
                                    }) : 2 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, m, void 0, a.inGraphDataXPosition, l, n, {
                                    nullValue: !0
                                }) ? h = m[l][n].xPosLeft + (m[l][n].xPosRight - m[l][n].xPosLeft) / 2 + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, m, void 0, a.inGraphDataPaddingX, l, n, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, m, void 0, a.inGraphDataXPosition, l, n, {
                                    nullValue: !0
                                }) && (h = m[l][n].xPosRight + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, m, void 0, a.inGraphDataPaddingX, l, n, {
                                        nullValue: !0
                                    })), 1 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, m, void 0, a.inGraphDataYPosition, l, n, {
                                    nullValue: !0
                                }) ? c = m[l][n].yPosBottom - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, m, void 0, a.inGraphDataPaddingY, l, n, {
                                        nullValue: !0
                                    }) : 2 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, m, void 0, a.inGraphDataYPosition, l, n, {
                                    nullValue: !0
                                }) ? c = m[l][n].yPosBottom - x / 2 - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, m, void 0, a.inGraphDataPaddingY, l, n, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, m, void 0, a.inGraphDataYPosition, l, n, {
                                    nullValue: !0
                                }) && (c = m[l][n].yPosTop - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, m, void 0, a.inGraphDataPaddingY, l, n, {
                                        nullValue: !0
                                    })), t.translate(h, c), rotateVal = setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, l, n, {
                                        nullValue: !0
                                    }) * (Math.PI / 180), t.rotate(rotateVal), setTextBordersAndBackground(t, d, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, l, n, {
                                    nullValue: !0
                                }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", t, e, m, void 0, a.inGraphDataBorders, l, n, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", t, e, m, void 0, a.inGraphDataBordersColor, l, n, {
                                    nullValue: !0
                                }), setOptionValue(t.chartLineScale, "INGRAPHDATABORDERSWIDTH", t, e, m, void 0, a.inGraphDataBordersWidth, l, n, {
                                    nullValue: !0
                                }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", t, e, m, void 0, a.inGraphDataBordersXSpace, l, n, {
                                    nullValue: !0
                                }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", t, e, m, void 0, a.inGraphDataBordersYSpace, l, n, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", t, e, m, void 0, a.inGraphDataBordersStyle, l, n, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", t, e, m, void 0, a.inGraphDataBackgroundColor, l, n, {
                                    nullValue: !0
                                }), "INGRAPHDATA"), t.fillTextMultiLine(d, 0, 0, t.textBaseline, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, l, n, {
                                    nullValue: !0
                                }), !0, a.detectMouseOnText, t, "INGRAPHDATA_TEXTMOUSE", rotateVal, h, c, l, n), t.restore()
                            }
                }
                A.legendMsr.dispLegend && drawLegend(A.legendMsr, e, a, t, "HorizontalStackedBar")
            }

            function n() {
                t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.strokeStyle = a.scaleLineColor, t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.beginPath(), t.moveTo(g - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), f), t.lineTo(g + A.availableWidth, f), t.stroke(), t.setLineDash([]), t.setLineDash(lineStyleFn(a.scaleGridLineStyle));
                for (var i = a.showYAxisMin ? -1 : 0; i < c.steps; i++) i >= 0 && (t.beginPath(), t.moveTo(g + i * S, f + Math.ceil(t.chartLineScale * a.scaleTickSizeBottom)), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleGridLineWidth), t.strokeStyle = a.scaleGridLineColor, a.scaleShowGridLines && i > 0 && i % a.scaleXGridLinesStep == 0 ? t.lineTo(g + i * S, f - A.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeTop)) : t.lineTo(g + i * S, f), t.stroke()), t.setLineDash([]);
                t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.strokeStyle = a.scaleLineColor, t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.beginPath(), t.moveTo(g, f + Math.ceil(t.chartLineScale * a.scaleTickSizeBottom)), t.lineTo(g, f - A.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeTop)), t.stroke(), t.setLineDash([]), t.setLineDash(lineStyleFn(a.scaleGridLineStyle));
                for (var l = 0; l < e.labels.length; l++) t.beginPath(), t.moveTo(g - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), f - (l + 1) * r), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleGridLineWidth), t.strokeStyle = a.scaleGridLineColor, a.scaleShowGridLines && (l + 1) % a.scaleYGridLinesStep == 0 ? t.lineTo(g + A.availableWidth, f - (l + 1) * r) : t.lineTo(g, f - (l + 1) * r), t.stroke();
                t.setLineDash([])
            }

            function o() {
                if (t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, a.scaleShowLabels && (a.xAxisTop || a.xAxisBottom) && (t.textBaseline = "top", A.rotateLabels > 90 ? (t.save(), t.textAlign = "left") : A.rotateLabels > 0 ? (t.save(), t.textAlign = "right") : t.textAlign = "center", t.fillStyle = a.scaleFontColor, a.xAxisBottom))
                    for (var i = a.showYAxisMin ? -1 : 0; i < c.steps; i++) showYLabels(t, e, a, i + 1, c.labels[i + 1]) && (t.save(), A.rotateLabels > 0 ? (t.translate(g + (i + 1) * S - A.highestXLabel / 2, A.xLabelPos), t.rotate(-(A.rotateLabels * (Math.PI / 180))), t.fillTextMultiLine(c.labels[i + 1], 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "XAXIS_TEXTMOUSE", -(A.rotateLabels * (Math.PI / 180)), g + (i + 1) * S - A.highestXLabel / 2, A.xLabelPos, i, -1)) : t.fillTextMultiLine(c.labels[i + 1], g + (i + 1) * S, A.xLabelPos, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1), t.restore());
                t.textAlign = "right", t.textBaseline = "middle";
                for (var l = 0; l < e.labels.length; l++) showLabels(t, e, a, l) && (a.yAxisLeft && (t.textAlign = "right", t.fillTextMultiLine(fmtChartJS(a, e.labels[l], a.fmtXLabel), g - (Math.ceil(t.chartLineScale * a.scaleTickSizeLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), f - (l + 1) * r + Math.ceil(t.chartSpaceScale * a.barValueSpacing) + L + x / 2, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, l)), a.yAxisRight && (t.textAlign = "left", t.fillTextMultiLine(fmtChartJS(a, e.labels[l], a.fmtXLabel), g + A.availableWidth + (Math.ceil(t.chartLineScale * a.scaleTickSizeRight) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), f - (l + 1) * r + L + x / 2, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, l)))
            }

            function s() {
                for (var i = -Number.MAX_VALUE, l = Number.MAX_VALUE, n = (new Array(e.datasets.length), new Array(e.datasets.length), 0); n < e.datasets.length; n++)
                    for (var o = 0; o < e.datasets[n].data.length; o++) {
                        var s = n,
                            r = 0,
                            c = 0;
                        for ("undefined" != typeof e.datasets[0].data[o] && (1 * e.datasets[0].data[o] > 0 ? (r += 1 * e.datasets[0].data[o], r > i && (i = r), l > r && (l = r)) : (c += 1 * e.datasets[0].data[o], c > i && (i = c), l > c && (l = c))); s > 0;) "undefined" != typeof e.datasets[s].data[o] && (1 * e.datasets[s].data[o] > 0 ? (r += 1 * e.datasets[s].data[o], r > i && (i = r), l > r && (l = r)) : (c += 1 * e.datasets[s].data[o], c > i && (i = c), l > c && (l = c))), s--
                    }
                "function" == typeof a.graphMin ? l = setOptionValue(1, "GRAPHMIN", t, e, m, void 0, a.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMin) || (l = a.graphMin), "function" == typeof a.graphMax ? i = setOptionValue(1, "GRAPHMAX", t, e, m, void 0, a.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMax) || (i = a.graphMax), l > i && (i = 0, l = 0), Math.abs(i - l) < a.zeroValue && (Math.abs(i) < a.zeroValue && (i = .9), i > 0 ? (i = 1.1 * i, l = .9 * l) : (i = .9 * i, l = 1.1 * l)), h = Math.ceil(t.chartTextScale * a.scaleFontSize), d = A.availableHeight;
                var u = Math.floor(d / (.66 * h)),
                    p = Math.floor(d / h * .5);
                return l > i && (l = i - 1), {
                    maxValue: i,
                    minValue: l,
                    maxSteps: u,
                    minSteps: p
                }
            }
            var r, c, h, d, u, p, S, g, f, x, A;
            if (a.reverseOrder && "undefined" == typeof t.reversed && (t.reversed = !0, e = reverseData(e)), t.tpchart = "HorizontalStackedBar", t.tpdata = 0, init_and_start(t, e, a)) {
                var m = initPassVariableData_part1(e, a, t);
                if (a.logarithmic = !1, A = setMeasures(e, a, t, height, width, "nihil", [""], !0, !0, !0, !0, !0, "HorizontalStackedBar"), u = s(), u.maxSteps > 0 && u.minSteps > 0) {
                    if (p = a.scaleShowLabels ? a.scaleLabel : "", a.scaleOverride) {
                        var M = setOptionValue(1, "SCALESTARTVALUE", t, e, m, void 0, a.scaleStartValue, -1, -1, {
                                nullValue: !0
                            }),
                            P = setOptionValue(1, "SCALESTEPS", t, e, m, void 0, a.scaleSteps, -1, -1, {
                                nullValue: !0
                            }),
                            T = setOptionValue(1, "SCALESTEPWIDTH", t, e, m, void 0, a.scaleStepWidth, -1, -1, {
                                nullValue: !0
                            });
                        c = {
                            steps: P,
                            stepValue: T,
                            graphMin: M,
                            labels: []
                        };
                        for (var v = 0; v <= c.steps; v++) p && c.labels.push(tmpl(p, {
                            value: fmtChartJS(a, 1 * (M + T * v).toFixed(getDecimalPlaces(T)), a.fmtYLabel)
                        }, a));
                        A = setMeasures(e, a, t, height, width, c.labels, null, !0, !0, !0, !0, !0, "HorizontalStackedBar")
                    } else c = calculateScale(1, a, u.maxSteps, u.minSteps, u.maxValue, u.minValue, p), A = setMeasures(e, a, t, height, width, c.labels, null, !0, !0, !0, !0, !0, "HorizontalStackedBar");
                    A.availableHeight = A.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeBottom) - Math.ceil(t.chartLineScale * a.scaleTickSizeTop), A.availableWidth = A.availableWidth - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft) - Math.ceil(t.chartLineScale * a.scaleTickSizeRight), r = Math.floor(A.availableHeight / e.labels.length), S = Math.floor(A.availableWidth / c.steps), (0 == S || a.fullWidthGraph) && (S = A.availableWidth / c.steps), A.clrwidth = A.clrwidth - (A.availableWidth - c.steps * S), A.availableWidth = c.steps * S, A.availableHeight = e.labels.length * r, g = A.leftNotUsableSize + Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), f = A.topNotUsableSize + A.availableHeight + Math.ceil(t.chartLineScale * a.scaleTickSizeTop), x = r - 2 * Math.ceil(t.chartLineScale * a.scaleGridLineWidth) - 2 * Math.ceil(t.chartSpaceScale * a.barValueSpacing) - (1 * Math.ceil(t.chartSpaceScale * a.barDatasetSpacing) - 1) - Math.ceil(t.chartLineScale * a.barStrokeWidth) / 2 - 1, x >= 0 && 1 >= x && (x = 1), 0 > x && x >= -1 && (x = -1);
                    var L;
                    1 * a.maxBarWidth > 0 && x > 1 * a.maxBarWidth ? (L = (x - 1 * a.maxBarWidth) / 2, x = 1 * a.maxBarWidth) : L = 0, o(), zeroY = i(0, c, r), initPassVariableData_part2(m, e, a, t, {
                        yAxisPosX: g,
                        additionalSpaceBetweenBars: L,
                        xAxisPosY: f,
                        barWidth: x,
                        zeroY: zeroY,
                        scaleHop: r,
                        valueHop: S,
                        calculatedScale: c
                    }), animationLoop(a, n, l, t, A.clrx, A.clry, A.clrwidth, A.clrheight, g + A.availableWidth / 2, f - A.availableHeight / 2, g, f, e, m)
                } else testRedraw(t, e, a)
            }
        },
        Bar = function(data, config, ctx) {
            function drawBars(e) {
                var a, t;
                ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.barStrokeWidth);
                for (var i = 0; i < data.datasets.length; i++)
                    if ("Line" != data.datasets[i].type)
                        for (var l = 0; l < data.datasets[i].data.length; l++)
                            if ("undefined" != typeof data.datasets[i].data[l]) {
                                var n = animationCorrection(e, data, config, i, l, 1).animVal;
                                n > 1 && (n -= 1);
                                var o = n * statData[i][l].barHeight + Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2;
                                ctx.fillStyle = setOptionValue(1, "COLOR", ctx, data, statData, data.datasets[i].fillColor, config.defaultFillColor, i, l, {
                                    animationValue: n,
                                    xPosLeft: statData[i][l].xPosLeft,
                                    yPosBottom: statData[i][l].yPosBottom,
                                    xPosRight: statData[i][l].xPosLeft + barWidth,
                                    yPosTop: statData[i][l].yPosBottom - o
                                }), ctx.strokeStyle = setOptionValue(1, "STROKECOLOR", ctx, data, statData, data.datasets[i].strokeColor, config.defaultStrokeColor, i, l, {
                                    nullvalue: null
                                }), roundRect(ctx, statData[i][l].xPosLeft, statData[i][l].yPosBottom, barWidth, o, config.barShowStroke, config.barBorderRadius, i, l, data.datasets[i].data[l] < 0 ? -1 : 1)
                            }
                if (drawLinesDataset(e, data, config, ctx, statData, {
                        xAxisPosY: xAxisPosY,
                        yAxisPosX: yAxisPosX,
                        valueHop: valueHop,
                        nbValueHop: data.labels.length
                    }), e >= config.animationStopValue)
                    for (i = 0; i < data.datasets.length; i++)
                        for (l = 0; l < data.datasets[i].data.length; l++)
                            if ("undefined" != typeof data.datasets[i].data[l] && "Line" != data.datasets[i].type && (jsGraphAnnotate[ctx.ChartNewId][jsGraphAnnotate[ctx.ChartNewId].length] = ["RECT", i, l, statData, setOptionValue(1, "ANNOTATEDISPLAY", ctx, data, statData, data.datasets[i].annotateDisplay, config.annotateDisplay, i, l, {
                                    nullValue: !0
                                })], setOptionValue(1, "INGRAPHDATASHOW", ctx, data, statData, data.datasets[i].inGraphDataShow, config.inGraphDataShow, i, l, {
                                    nullValue: !0
                                }))) {
                                ctx.save(), ctx.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", ctx, data, statData, void 0, config.inGraphDataAlign, i, l, {
                                    nullValue: !0
                                }), ctx.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", ctx, data, statData, void 0, config.inGraphDataVAlign, i, l, {
                                    nullValue: !0
                                }), ctx.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", ctx, data, statData, void 0, config.inGraphDataFontStyle, i, l, {
                                        nullValue: !0
                                    }) + " " + setOptionValue(ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, void 0, config.inGraphDataFontSize, i, l, {
                                        nullValue: !0
                                    }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", ctx, data, statData, void 0, config.inGraphDataFontFamily, i, l, {
                                        nullValue: !0
                                    }), ctx.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", ctx, data, statData, void 0, config.inGraphDataFontColor, i, l, {
                                    nullValue: !0
                                }), a = statData[i][l].yPosBottom, t = statData[i][l].yPosTop, ctx.beginPath();
                                var s = 0,
                                    r = 0;
                                1 == setOptionValue(1, "INGRAPHDATAXPOSITION", ctx, data, statData, void 0, config.inGraphDataXPosition, i, l, {
                                    nullValue: !0
                                }) ? r = statData[i][l].xPosLeft + setOptionValue(ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, void 0, config.inGraphDataPaddingX, i, l, {
                                        nullValue: !0
                                    }) : 2 == setOptionValue(1, "INGRAPHDATAXPOSITION", ctx, data, statData, void 0, config.inGraphDataXPosition, i, l, {
                                    nullValue: !0
                                }) ? r = statData[i][l].xPosLeft + barWidth / 2 + setOptionValue(ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, void 0, config.inGraphDataPaddingX, i, l, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATAXPOSITION", ctx, data, statData, void 0, config.inGraphDataXPosition, i, l, {
                                    nullValue: !0
                                }) && (r = statData[i][l].xPosLeft + barWidth + setOptionValue(ctx.chartSpaceScale, "INGRAPHDATAPADDINGX", ctx, data, statData, void 0, config.inGraphDataPaddingX, i, l, {
                                        nullValue: !0
                                    })), 1 == setOptionValue(1, "INGRAPHDATAYPOSITION", ctx, data, statData, void 0, config.inGraphDataYPosition, i, l, {
                                    nullValue: !0
                                }) ? s = statData[i][l].yPosBottom - setOptionValue(ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, void 0, config.inGraphDataPaddingY, i, l, {
                                        nullValue: !0
                                    }) : 2 == setOptionValue(1, "INGRAPHDATAYPOSITION", ctx, data, statData, void 0, config.inGraphDataYPosition, i, l, {
                                    nullValue: !0
                                }) ? s = (statData[i][l].yPosBottom + statData[i][l].yPosTop) / 2 - setOptionValue(ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, void 0, config.inGraphDataPaddingY, i, l, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATAYPOSITION", ctx, data, statData, void 0, config.inGraphDataYPosition, i, l, {
                                    nullValue: !0
                                }) && (s = statData[i][l].yPosTop - setOptionValue(ctx.chartSpaceScale, "INGRAPHDATAPADDINGY", ctx, data, statData, void 0, config.inGraphDataPaddingY, i, l, {
                                        nullValue: !0
                                    })), ctx.translate(r, s);
                                var c = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", ctx, data, statData, void 0, config.inGraphDataTmpl, i, l, {
                                    nullValue: !0
                                }), statData[i][l], config);
                                rotateVal = setOptionValue(1, "INGRAPHDATAROTATE", ctx, data, statData, void 0, config.inGraphDataRotate, i, l, {
                                        nullValue: !0
                                    }) * (Math.PI / 180), ctx.rotate(rotateVal), setTextBordersAndBackground(ctx, c, setOptionValue(ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, void 0, config.inGraphDataFontSize, i, l, {
                                    nullValue: !0
                                }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", ctx, data, statData, void 0, config.inGraphDataBorders, i, l, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", ctx, data, statData, void 0, config.inGraphDataBordersColor, i, l, {
                                    nullValue: !0
                                }), setOptionValue(ctx.chartLineScale, "INGRAPHDATABORDERSWIDTH", ctx, data, statData, void 0, config.inGraphDataBordersWidth, i, l, {
                                    nullValue: !0
                                }), setOptionValue(ctx.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", ctx, data, statData, void 0, config.inGraphDataBordersXSpace, i, l, {
                                    nullValue: !0
                                }), setOptionValue(ctx.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", ctx, data, statData, void 0, config.inGraphDataBordersYSpace, i, l, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", ctx, data, statData, void 0, config.inGraphDataBordersStyle, i, l, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", ctx, data, statData, void 0, config.inGraphDataBackgroundColor, i, l, {
                                    nullValue: !0
                                }), "INGRAPHDATA"), ctx.fillTextMultiLine(c, 0, 0, ctx.textBaseline, setOptionValue(ctx.chartTextScale, "INGRAPHDATAFONTSIZE", ctx, data, statData, void 0, config.inGraphDataFontSize, i, l, {
                                    nullValue: !0
                                }), !0, config.detectMouseOnText, ctx, "INGRAPHDATA_TEXTMOUSE", rotateVal, r, s, i, l), ctx.restore()
                            }
                e >= 1 && "function" == typeof drawMath && drawMath(ctx, config, data, msr, {
                    xAxisPosY: xAxisPosY,
                    yAxisPosX: yAxisPosX,
                    valueHop: valueHop,
                    scaleHop: scaleHop,
                    zeroY: zeroY,
                    calculatedScale: calculatedScale,
                    calculateOffset: calculateOffset,
                    additionalSpaceBetweenBars: additionalSpaceBetweenBars,
                    barWidth: barWidth
                }), msr.legendMsr.dispLegend && drawLegend(msr.legendMsr, data, config, ctx, "Bar")
            }

            function roundRect(e, a, t, i, l, n, o, s, r, c) {
                e.beginPath(), e.setLineDash(lineStyleFn(setOptionValue(1, "STROKESTYLE", e, data, statData, data.datasets[s].datasetStrokeStyle, config.datasetStrokeStyle, s, r, {
                    nullvalue: null
                }))), e.moveTo(a + o, t), e.lineTo(a + i - o, t), e.quadraticCurveTo(a + i, t, a + i, t), e.lineTo(a + i, t - l + c * o), e.quadraticCurveTo(a + i, t - l, a + i - o, t - l), e.lineTo(a + o, t - l), e.quadraticCurveTo(a, t - l, a, t - l + c * o), e.lineTo(a, t), e.quadraticCurveTo(a, t, a + o, t), n && e.stroke(), e.closePath(), e.fill(), e.setLineDash([])
            }

            function drawScale() {
                ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleLineWidth), ctx.strokeStyle = config.scaleLineColor, ctx.setLineDash(lineStyleFn(config.scaleLineStyle)), ctx.beginPath(), ctx.moveTo(yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY), ctx.lineTo(yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), xAxisPosY), ctx.stroke(), ctx.setLineDash([]), ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
                for (var e = 0; e < data.labels.length; e++) ctx.beginPath(), ctx.moveTo(yAxisPosX + e * valueHop, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom)), ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), ctx.strokeStyle = config.scaleGridLineColor, config.scaleShowGridLines && e > 0 && e % config.scaleXGridLinesStep == 0 ? ctx.lineTo(yAxisPosX + e * valueHop, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop)) : ctx.lineTo(yAxisPosX + e * valueHop, xAxisPosY), ctx.stroke();
                ctx.setLineDash([]), ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleLineWidth), ctx.strokeStyle = config.scaleLineColor, ctx.setLineDash(lineStyleFn(config.scaleLineStyle)), ctx.beginPath(), ctx.moveTo(yAxisPosX, xAxisPosY + Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom)), ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop)), ctx.stroke(), ctx.setLineDash([]), ctx.setLineDash(lineStyleFn(config.scaleGridLineStyle));
                for (var a = 0; a < calculatedScale.steps; a++) ctx.beginPath(), ctx.moveTo(yAxisPosX - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY - (a + 1) * scaleHop), ctx.lineWidth = Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth), ctx.strokeStyle = config.scaleGridLineColor, config.scaleShowGridLines && (a + 1) % config.scaleYGridLinesStep == 0 ? ctx.lineTo(yAxisPosX + msr.availableWidth + Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), xAxisPosY - (a + 1) * scaleHop) : ctx.lineTo(yAxisPosX, xAxisPosY - (a + 1) * scaleHop), ctx.stroke();
                ctx.setLineDash([])
            }

            function drawLabels() {
                if (ctx.font = config.scaleFontStyle + " " + Math.ceil(ctx.chartTextScale * config.scaleFontSize).toString() + "px " + config.scaleFontFamily, (config.xAxisTop || config.xAxisBottom) && (ctx.textBaseline = "top", msr.rotateLabels > 90 ? (ctx.save(), ctx.textAlign = "left") : msr.rotateLabels > 0 ? (ctx.save(), ctx.textAlign = "right") : ctx.textAlign = "center", ctx.fillStyle = config.scaleFontColor, config.xAxisBottom))
                    for (var e = 0; e < data.labels.length; e++) showLabels(ctx, data, config, e) && (ctx.save(), msr.rotateLabels > 0 ? (ctx.translate(yAxisPosX + e * valueHop + valueHop / 2 - msr.highestXLabel / 2, msr.xLabelPos), ctx.rotate(-(msr.rotateLabels * (Math.PI / 180))), ctx.fillTextMultiLine(fmtChartJS(config, data.labels[e], config.fmtXLabel), 0, 0, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", -(msr.rotateLabels * (Math.PI / 180)), yAxisPosX + e * valueHop + valueHop / 2 - msr.highestXLabel / 2, msr.xLabelPos, e, -1)) : ctx.fillTextMultiLine(fmtChartJS(config, data.labels[e], config.fmtXLabel), yAxisPosX + e * valueHop + valueHop / 2, msr.xLabelPos, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "XAXIS_TEXTMOUSE", 0, 0, 0, e, -1), ctx.restore());
                ctx.textAlign = "right", ctx.textBaseline = "middle";
                for (var a = config.showYAxisMin ? -1 : 0; a < calculatedScale.steps; a++) config.scaleShowLabels && showYLabels(ctx, data, config, a + 1, calculatedScale.labels[a + 1]) && (config.yAxisLeft && (ctx.textAlign = "right", ctx.fillTextMultiLine(parseFloat(calculatedScale.labels[a + 1]).toFixed(config.yAxisFormat), yAxisPosX - (Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (a + 1) * scaleHop, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, a)), config.yAxisRight && !valueBounds.dbAxis && (ctx.textAlign = "left", ctx.fillTextMultiLine(calculatedScale.labels[a + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (a + 1) * scaleHop, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, a)));
                if (config.yAxisRight && valueBounds.dbAxis)
                    for (a = config.showYAxisMin ? -1 : 0; a < calculatedScale2.steps; a++) config.scaleShowLabels && (ctx.textAlign = "left", ctx.fillTextMultiLine(calculatedScale2.labels[a + 1], yAxisPosX + msr.availableWidth + (Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight) + Math.ceil(ctx.chartSpaceScale * config.yAxisSpaceRight)), xAxisPosY - (a + 1) * scaleHop2, ctx.textBaseline, Math.ceil(ctx.chartTextScale * config.scaleFontSize), !0, config.detectMouseOnText, ctx, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, a))
            }

            function getValueBounds() {
                for (var upperValue = -Number.MAX_VALUE, lowerValue = Number.MAX_VALUE, upperValue2 = -Number.MAX_VALUE, lowerValue2 = Number.MAX_VALUE, secondAxis = !1, firstAxis = !1, mathValueHeight, i = 0; i < data.datasets.length; i++) {
                    var mathFctName = data.datasets[i].drawMathDeviation,
                        mathValueHeight = 0, mathValueHeightVal;
                    if ("function" == typeof eval(mathFctName)) {
                        var parameter = {
                            data: data,
                            datasetNr: i
                        };
                        mathValueHeightVal = window[mathFctName](parameter)
                    } else mathValueHeightVal = 0;
                    for (var j = 0; j < data.datasets[i].data.length; j++) mathValueHeight = "object" == typeof mathValueHeightVal ? mathValueHeightVal[Math.min(mathValueHeightVal.length, j)] : mathValueHeightVal, "undefined" != typeof data.datasets[i].data[j] && (2 == data.datasets[i].axis ? (secondAxis = !0, 1 * data.datasets[i].data[j] + mathValueHeight > upperValue2 && (upperValue2 = 1 * data.datasets[i].data[j] + mathValueHeight), 1 * data.datasets[i].data[j] - mathValueHeight < lowerValue2 && (lowerValue2 = 1 * data.datasets[i].data[j] - mathValueHeight)) : (firstAxis = !0, 1 * data.datasets[i].data[j] + mathValueHeight > upperValue && (upperValue = 1 * data.datasets[i].data[j] + mathValueHeight), 1 * data.datasets[i].data[j] - mathValueHeight < lowerValue && (lowerValue = 1 * data.datasets[i].data[j] - mathValueHeight)))
                }
                lowerValue > upperValue && (upperValue = 0, lowerValue = 0), Math.abs(upperValue - lowerValue) < config.zeroValue && (Math.abs(upperValue) < config.zeroValue && (upperValue = .9), upperValue > 0 ? (upperValue = 1.1 * upperValue, lowerValue = .9 * lowerValue) : (upperValue = .9 * upperValue, lowerValue = 1.1 * lowerValue)), "function" == typeof config.graphMin ? lowerValue = setOptionValue(1, "GRAPHMIN", ctx, data, statData, void 0, config.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMin) || (lowerValue = config.graphMin), "function" == typeof config.graphMax ? upperValue = setOptionValue(1, "GRAPHMAX", ctx, data, statData, void 0, config.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMax) || (upperValue = config.graphMax), secondAxis && (lowerValue2 > upperValue2 && (upperValue2 = 0, lowerValue2 = 0), Math.abs(upperValue2 - lowerValue2) < config.zeroValue && (Math.abs(upperValue2) < config.zeroValue && (upperValue2 = .9), upperValue2 > 0 ? (upperValue2 = 1.1 * upperValue2, lowerValue2 = .9 * lowerValue2) : (upperValue2 = .9 * upperValue2, lowerValue2 = 1.1 * lowerValue2)), "function" == typeof config.graphMin2 ? lowerValue2 = setOptionValue(1, "GRAPHMIN", ctx, data, statData, void 0, config.graphMin2, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMin2) || (lowerValue2 = config.graphMin2), "function" == typeof config.graphMax2 ? upperValue2 = setOptionValue(1, "GRAPHMAX", ctx, data, statData, void 0, config.graphMax2, -1, -1, {
                    nullValue: !0
                }) : isNaN(config.graphMax2) || (upperValue2 = config.graphMax2)), !firstAxis && secondAxis && (upperValue = upperValue2, lowerValue = lowerValue2), labelHeight = Math.ceil(ctx.chartTextScale * config.scaleFontSize), scaleHeight = msr.availableHeight;
                var maxSteps = Math.floor(scaleHeight / (.66 * labelHeight)),
                    minSteps = Math.floor(scaleHeight / labelHeight * .5);
                return lowerValue > upperValue && (lowerValue = upperValue - 1), lowerValue2 > upperValue2 && (lowerValue2 = upperValue2 - 1), {
                    maxValue: config.yMaximum == "smart" ? upperValue : config.yMaximum,
                    minValue: config.yMinimum == "smart" ? lowerValue : config.yMinimum,
                    maxValue2: config.yMaximum == "smart" ? upperValue2 : config.yMaximum,
                    minValue2: config.yMinimum == "smart" ? lowerValue2 : config.yMinimum,
                    dbAxis: secondAxis,
                    maxSteps: maxSteps,
                    minSteps: minSteps
                }
            }
            var maxSize, scaleHop, scaleHop2, calculatedScale, calculatedScale2, labelHeight, scaleHeight, valueBounds, labelTemplateString, labelTemplateString2, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, barWidth, rotateLabels = 0,
                msr;
            if (ctx.tpchart = "Bar", ctx.tpdata = 0, init_and_start(ctx, data, config)) {
                for (var statData = initPassVariableData_part1(data, config, ctx), nrOfBars = data.datasets.length, i = 0; i < data.datasets.length; i++) "Line" == data.datasets[i].type ? (statData[i][0].tpchart = "Line", nrOfBars--) : statData[i][0].tpchart = "Bar";
                var bufferDataset, l = 0;
                if (msr = setMeasures(data, config, ctx, height, width, "nihil", [""], !0, !1, !0, !0, !0, "Bar"), valueBounds = getValueBounds(), valueBounds.minValue <= 0 && (config.logarithmic = !1), valueBounds.maxSteps > 0 && valueBounds.minSteps > 0) {
                    config.logarithmic !== !1 && valueBounds.minValue <= 0 && (config.logarithmic = !1), config.logarithmic2 !== !1 && valueBounds.minValue2 <= 0 && (config.logarithmic2 = !1);
                    var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
                    ("fuzzy" == config.logarithmic && 4 > OrderOfMagnitude || config.scaleOverride) && (config.logarithmic = !1);
                    var OrderOfMagnitude2 = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue2) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue2)));
                    if (("fuzzy" == config.logarithmic2 && 4 > OrderOfMagnitude2 || config.scaleOverride2) && (config.logarithmic2 = !1), labelTemplateString = config.scaleShowLabels ? config.scaleLabel : "", labelTemplateString2 = config.scaleShowLabels2 ? config.scaleLabel2 : "", config.scaleOverride) {
                        var scaleStartValue = setOptionValue(1, "SCALESTARTVALUE", ctx, data, statData, void 0, config.scaleStartValue, -1, -1, {
                                nullValue: !0
                            }),
                            scaleSteps = setOptionValue(1, "SCALESTEPS", ctx, data, statData, void 0, config.scaleSteps, -1, -1, {
                                nullValue: !0
                            }),
                            scaleStepWidth = setOptionValue(1, "SCALESTEPWIDTH", ctx, data, statData, void 0, config.scaleStepWidth, -1, -1, {
                                nullValue: !0
                            });
                        calculatedScale = {
                            steps: scaleSteps,
                            stepValue: scaleStepWidth,
                            graphMin: scaleStartValue,
                            graphMax: scaleStartValue + scaleSteps * scaleStepWidth,
                            labels: []
                        }, populateLabels(1, config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, scaleStartValue, calculatedScale.graphMax, scaleStepWidth)
                    } else calculatedScale = calculateScale(1, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
                    if (valueBounds.dbAxis)
                        if (config.scaleOverride2) {
                            var scaleStartValue2 = setOptionValue(1, "SCALESTARTVALUE2", ctx, data, statData, void 0, config.scaleStartValue2, -1, -1, {
                                    nullValue: !0
                                }),
                                scaleSteps2 = setOptionValue(1, "SCALESTEPS2", ctx, data, statData, void 0, config.scaleSteps2, -1, -1, {
                                    nullValue: !0
                                }),
                                scaleStepWidth2 = setOptionValue(1, "SCALESTEPWIDTH2", ctx, data, statData, void 0, config.scaleStepWidth2, -1, -1, {
                                    nullValue: !0
                                });
                            calculatedScale2 = {
                                steps: scaleSteps2,
                                stepValue: scaleStepWidth2,
                                graphMin: scaleStartValue2,
                                graphMax: scaleStartValue2 + scaleSteps2 * scaleStepWidth2,
                                labels: []
                            }, populateLabels(2, config, labelTemplateString2, calculatedScale2.labels, calculatedScale2.steps, scaleStartValue2, calculatedScale2.graphMax, scaleStepWidth2)
                        } else calculatedScale2 = calculateScale(2, config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue2, valueBounds.minValue2, labelTemplateString2);
                    else calculatedScale2 = {
                        steps: 0,
                        stepValue: 0,
                        graphMin: 0,
                        graphMax: 0,
                        labels: null
                    };
                    msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, calculatedScale2.labels, !0, !1, !0, !0, !0, "Bar");
                    var prevHeight = msr.availableHeight;
                    msr.availableHeight = msr.availableHeight - Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop), msr.availableWidth = msr.availableWidth - Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft) - Math.ceil(ctx.chartLineScale * config.scaleTickSizeRight), scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps), scaleHop2 = Math.floor(msr.availableHeight / calculatedScale2.steps), valueHop = Math.floor(msr.availableWidth / data.labels.length), (0 == valueHop || config.fullWidthGraph) && (valueHop = msr.availableWidth / data.labels.length), msr.clrwidth = msr.clrwidth - (msr.availableWidth - data.labels.length * valueHop), msr.availableWidth = data.labels.length * valueHop, msr.xLabelPos += Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop) - (prevHeight - msr.availableHeight), msr.clrheight += Math.ceil(ctx.chartLineScale * config.scaleTickSizeBottom) + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop) - (prevHeight - msr.availableHeight), yAxisPosX = msr.leftNotUsableSize + Math.ceil(ctx.chartLineScale * config.scaleTickSizeLeft), xAxisPosY = msr.topNotUsableSize + msr.availableHeight + Math.ceil(ctx.chartLineScale * config.scaleTickSizeTop), barWidth = (valueHop - 2 * Math.ceil(ctx.chartLineScale * config.scaleGridLineWidth) - 2 * Math.ceil(ctx.chartSpaceScale * config.barValueSpacing) - (Math.ceil(ctx.chartSpaceScale * config.barDatasetSpacing) * nrOfBars - 1) - (Math.ceil(ctx.chartLineScale * config.barStrokeWidth) / 2 * nrOfBars - 1)) / nrOfBars, barWidth >= 0 && 1 >= barWidth && (barWidth = 1), 0 > barWidth && barWidth >= -1 && (barWidth = -1);
                    var additionalSpaceBetweenBars;
                    1 * config.maxBarWidth > 0 && barWidth > 1 * config.maxBarWidth ? (additionalSpaceBetweenBars = nrOfBars * (barWidth - 1 * config.maxBarWidth) / 2, barWidth = 1 * config.maxBarWidth) : additionalSpaceBetweenBars = 0;
                    var zeroY = 0,
                        zeroY2 = 0;
                    valueBounds.minValue < 0 && (zeroY = calculateOffset(config.logarithmic, 0, calculatedScale, scaleHop)), valueBounds.minValue2 < 0 && (zeroY2 = calculateOffset(config.logarithmic2, 0, calculatedScale2, scaleHop2)), initPassVariableData_part2(statData, data, config, ctx, {
                        msr: msr,
                        yAxisPosX: yAxisPosX,
                        xAxisPosY: xAxisPosY,
                        valueHop: valueHop,
                        nbValueHop: data.labels.length - 1,
                        barWidth: barWidth,
                        additionalSpaceBetweenBars: additionalSpaceBetweenBars,
                        zeroY: zeroY,
                        zeroY2: zeroY2,
                        calculatedScale: calculatedScale,
                        calculatedScale2: calculatedScale2,
                        scaleHop: scaleHop,
                        scaleHop2: scaleHop2
                    }), drawLabels(), animationLoop(config, drawScale, drawBars, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data, statData)
                } else testRedraw(ctx, data, config)
            }
        },
        HorizontalBar = function(e, a, t) {
            function i(i) {
                for (var n = 0; n < e.datasets.length; n++)
                    for (var o = 0; o < e.datasets[n].data.length; o++) {
                        t.lineWidth = Math.ceil(t.chartLineScale * a.barStrokeWidth);
                        var s = animationCorrection(i, e, a, n, o, 1).animVal;
                        s > 1 && (s -= 1);
                        var r = s * m[n][o].barWidth + Math.ceil(t.chartLineScale * a.barStrokeWidth) / 2;
                        t.fillStyle = setOptionValue(1, "COLOR", t, e, m, e.datasets[n].fillColor, a.defaultFillColor, n, o, {
                            animationValue: s,
                            xPosLeft: m[n][o].xPosLeft,
                            yPosBottom: m[n][o].yPosBottom,
                            xPosRight: m[n][o].xPosLeft + r,
                            yPosTop: m[n][o].yPosBottom
                        }), t.strokeStyle = setOptionValue(1, "STROKECOLOR", t, e, m, e.datasets[n].strokeColor, a.defaultStrokeColor, n, o, {
                            nullvalue: null
                        }), "undefined" != typeof e.datasets[n].data[o] && l(t, m[n][o].yPosTop, m[n][o].xPosLeft, x, r, a.barShowStroke, a.barBorderRadius, 0, n, o, e.datasets[n].data[o] < 0 ? -1 : 1)
                    }
                if (i >= a.animationStopValue)
                    for (n = 0; n < e.datasets.length; n++)
                        for (o = 0; o < e.datasets[n].data.length; o++)
                            if ("undefined" != typeof e.datasets[n].data[o] && (jsGraphAnnotate[t.ChartNewId][jsGraphAnnotate[t.ChartNewId].length] = ["RECT", n, o, m, setOptionValue(1, "ANNOTATEDISPLAY", t, e, m, e.datasets[n].annotateDisplay, a.annotateDisplay, n, o, {
                                    nullValue: !0
                                })], setOptionValue(1, "INGRAPHDATASHOW", t, e, m, e.datasets[n].inGraphDataShow, a.inGraphDataShow, n, o, {
                                    nullValue: !0
                                }))) {
                                t.save(), t.textAlign = setOptionValue(1, "INGRAPHDATAALIGN", t, e, m, void 0, a.inGraphDataAlign, n, o, {
                                    nullValue: !0
                                }), t.textBaseline = setOptionValue(1, "INGRAPHDATAVALIGN", t, e, m, void 0, a.inGraphDataVAlign, n, o, {
                                    nullValue: !0
                                }), t.font = setOptionValue(1, "INGRAPHDATAFONTSTYLE", t, e, m, void 0, a.inGraphDataFontStyle, n, o, {
                                        nullValue: !0
                                    }) + " " + setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, n, o, {
                                        nullValue: !0
                                    }) + "px " + setOptionValue(1, "INGRAPHDATAFONTFAMILY", t, e, m, void 0, a.inGraphDataFontFamily, n, o, {
                                        nullValue: !0
                                    }), t.fillStyle = setOptionValue(1, "INGRAPHDATAFONTCOLOR", t, e, m, void 0, a.inGraphDataFontColor, n, o, {
                                    nullValue: !0
                                }), t.beginPath();
                                var c = 0,
                                    h = 0;
                                1 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, m, void 0, a.inGraphDataYPosition, n, o, {
                                    nullValue: !0
                                }) ? c = m[n][o].yPosTop - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, m, void 0, a.inGraphDataPaddingY, n, o, {
                                        nullValue: !0
                                    }) + x : 2 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, m, void 0, a.inGraphDataYPosition, n, o, {
                                    nullValue: !0
                                }) ? c = m[n][o].yPosTop + x / 2 - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, m, void 0, a.inGraphDataPaddingY, n, o, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATAYPOSITION", t, e, m, void 0, a.inGraphDataYPosition, n, o, {
                                    nullValue: !0
                                }) && (c = m[n][o].yPosTop - setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGY", t, e, m, void 0, a.inGraphDataPaddingY, n, o, {
                                        nullValue: !0
                                    })), 1 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, m, void 0, a.inGraphDataXPosition, n, o, {
                                    nullValue: !0
                                }) ? h = m[n][o].xPosLeft + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, m, void 0, a.inGraphDataPaddingX, n, o, {
                                        nullValue: !0
                                    }) : 2 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, m, void 0, a.inGraphDataXPosition, n, o, {
                                    nullValue: !0
                                }) ? h = (m[n][o].xPosLeft + m[n][o].xPosRight) / 2 + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, m, void 0, a.inGraphDataPaddingX, n, o, {
                                        nullValue: !0
                                    }) : 3 == setOptionValue(1, "INGRAPHDATAXPOSITION", t, e, m, void 0, a.inGraphDataXPosition, n, o, {
                                    nullValue: !0
                                }) && (h = m[n][o].xPosRight + setOptionValue(t.chartSpaceScale, "INGRAPHDATAPADDINGX", t, e, m, void 0, a.inGraphDataPaddingX, n, o, {
                                        nullValue: !0
                                    })), t.translate(h, c);
                                var d = tmplbis(setOptionValue(1, "INGRAPHDATATMPL", t, e, m, void 0, a.inGraphDataTmpl, n, o, {
                                        nullValue: !0
                                    }), m[n][o], a),
                                    u = setOptionValue(1, "INGRAPHDATAROTATE", t, e, m, void 0, a.inGraphDataRotate, n, o, {
                                            nullValue: !0
                                        }) * (Math.PI / 180);
                                t.rotate(u), setTextBordersAndBackground(t, d, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, n, o, {
                                    nullValue: !0
                                }), 0, 0, setOptionValue(1, "INGRAPHDATABORDERS", t, e, m, void 0, a.inGraphDataBorders, n, o, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSCOLOR", t, e, m, void 0, a.inGraphDataBordersColor, n, o, {
                                    nullValue: !0
                                }), setOptionValue(t.chartLineScale, "INGRAPHDATABORDERSWIDTH", t, e, m, void 0, a.inGraphDataBordersWidth, n, o, {
                                    nullValue: !0
                                }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSXSPACE", t, e, m, void 0, a.inGraphDataBordersXSpace, n, o, {
                                    nullValue: !0
                                }), setOptionValue(t.chartSpaceScale, "INGRAPHDATABORDERSYSPACE", t, e, m, void 0, a.inGraphDataBordersYSpace, n, o, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABORDERSSTYLE", t, e, m, void 0, a.inGraphDataBordersStyle, n, o, {
                                    nullValue: !0
                                }), setOptionValue(1, "INGRAPHDATABACKGROUNDCOLOR", t, e, m, void 0, a.inGraphDataBackgroundColor, n, o, {
                                    nullValue: !0
                                }), "INGRAPHDATA"), t.fillTextMultiLine(d, 0, 0, t.textBaseline, setOptionValue(t.chartTextScale, "INGRAPHDATAFONTSIZE", t, e, m, void 0, a.inGraphDataFontSize, n, o, {
                                    nullValue: !0
                                }), !0, a.detectMouseOnText, t, "INGRAPHDATA_TEXTMOUSE", u, h, c, n, o), t.restore()
                            }
                A.legendMsr.dispLegend && drawLegend(A.legendMsr, e, a, t, "HorizontalBar")
            }

            function l(t, i, l, n, o, s, r, c, h, d, u) {
                t.beginPath(), t.moveTo(l + c, i + r), t.lineTo(l + c, i + n - r), t.quadraticCurveTo(l + c, i + n, l + c, i + n), t.lineTo(l + o - u * r, i + n), t.quadraticCurveTo(l + o, i + n, l + o, i + n - r), t.lineTo(l + o, i + r), t.quadraticCurveTo(l + o, i, l + o - u * r, i), t.lineTo(l + c, i), t.quadraticCurveTo(l + c, i, l + c, i + r), s && (t.setLineDash(lineStyleFn(setOptionValue(1, "STROKESTYLE", t, e, m, e.datasets[h].datasetStrokeStyle, a.datasetStrokeStyle, h, d, {
                    nullvalue: null
                }))), t.stroke(), t.setLineDash([])), t.closePath(), t.fill()
            }

            function n() {
                t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.strokeStyle = a.scaleLineColor, t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.beginPath(), t.moveTo(g - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), f), t.lineTo(g + A.availableWidth + Math.ceil(t.chartLineScale * a.scaleTickSizeRight), f), t.stroke(), t.setLineDash([]), t.setLineDash(lineStyleFn(a.scaleGridLineStyle));
                for (var i = a.showYAxisMin ? -1 : 0; i < c.steps; i++) i >= 0 && (t.beginPath(), t.moveTo(g + i * S, f + Math.ceil(t.chartLineScale * a.scaleTickSizeBottom)), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleGridLineWidth), t.strokeStyle = a.scaleGridLineColor, a.scaleShowGridLines && i > 0 && i % a.scaleXGridLinesStep == 0 ? t.lineTo(g + i * S, f - A.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeTop)) : t.lineTo(g + i * S, f), t.stroke());
                t.setLineDash([]), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleLineWidth), t.strokeStyle = a.scaleLineColor, t.setLineDash(lineStyleFn(a.scaleLineStyle)), t.beginPath(), t.moveTo(g, f + Math.ceil(t.chartLineScale * a.scaleTickSizeBottom)), t.lineTo(g, f - A.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeTop)), t.stroke(), t.setLineDash([]), t.setLineDash(lineStyleFn(a.scaleGridLineStyle));
                for (var l = 0; l < e.labels.length; l++) t.beginPath(), t.moveTo(g - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), f - (l + 1) * r), t.lineWidth = Math.ceil(t.chartLineScale * a.scaleGridLineWidth), t.strokeStyle = a.scaleGridLineColor, a.scaleShowGridLines && (l + 1) % a.scaleYGridLinesStep == 0 ? t.lineTo(g + A.availableWidth + Math.ceil(t.chartLineScale * a.scaleTickSizeRight), f - (l + 1) * r) : t.lineTo(g, f - (l + 1) * r), t.stroke();
                t.setLineDash([])
            }

            function o() {
                if (t.font = a.scaleFontStyle + " " + Math.ceil(t.chartTextScale * a.scaleFontSize).toString() + "px " + a.scaleFontFamily, a.scaleShowLabels && (a.xAxisTop || a.xAxisBottom) && (t.textBaseline = "top", A.rotateLabels > 90 ? (t.save(), t.textAlign = "left") : A.rotateLabels > 0 ? (t.save(), t.textAlign = "right") : t.textAlign = "center", t.fillStyle = a.scaleFontColor, a.xAxisBottom))
                    for (var i = a.showYAxisMin ? -1 : 0; i < c.steps; i++) showYLabels(t, e, a, i + 1, c.labels[i + 1]) && (t.save(), A.rotateLabels > 0 ? (t.translate(g + (i + 1) * S - A.highestXLabel / 2, A.xLabelPos), t.rotate(-(A.rotateLabels * (Math.PI / 180))), t.fillTextMultiLine(c.labels[i + 1], 0, 0, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "XAXIS_TEXTMOUSE", -(A.rotateLabels * (Math.PI / 180)), g + (i + 1) * S - A.highestXLabel / 2, A.xLabelPos, i, -1)) : t.fillTextMultiLine(c.labels[i + 1], g + (i + 1) * S, A.xLabelPos, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "XAXIS_TEXTMOUSE", 0, 0, 0, i, -1), t.restore());
                t.textAlign = "right", t.textBaseline = "middle";
                for (var l = 0; l < e.labels.length; l++) showLabels(t, e, a, l) && (a.yAxisLeft && (t.textAlign = "right", t.fillTextMultiLine(fmtChartJS(a, e.labels[l], a.fmtXLabel), g - (Math.ceil(t.chartLineScale * a.scaleTickSizeLeft) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), f - l * r - r / 2, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "YLEFTAXIS_TEXTMOUSE", 0, 0, 0, -1, l)), a.yAxisRight && (t.textAlign = "left", t.fillTextMultiLine(fmtChartJS(a, e.labels[l], a.fmtXLabel), g + A.availableWidth + (Math.ceil(t.chartLineScale * a.scaleTickSizeRight) + Math.ceil(t.chartSpaceScale * a.yAxisSpaceRight)), f - l * r - r / 2, t.textBaseline, Math.ceil(t.chartTextScale * a.scaleFontSize), !0, a.detectMouseOnText, t, "YRIGHTAXIS_TEXTMOUSE", 0, 0, 0, -1, l)))
            }

            function s() {
                for (var i = -Number.MAX_VALUE, l = Number.MAX_VALUE, n = 0; n < e.datasets.length; n++)
                    for (var o = 0; o < e.datasets[n].data.length; o++) "undefined" != typeof e.datasets[n].data[o] && (1 * e.datasets[n].data[o] > i && (i = 1 * e.datasets[n].data[o]), 1 * e.datasets[n].data[o] < l && (l = 1 * e.datasets[n].data[o]));
                l > i && (i = 0, l = 0), Math.abs(i - l) < a.zeroValue && (Math.abs(i) < a.zeroValue && (i = .9), i > 0 ? (i = 1.1 * i, l = .9 * l) : (i = .9 * i, l = 1.1 * l)), "function" == typeof a.graphMin ? l = setOptionValue(1, "GRAPHMIN", t, e, m, void 0, a.graphMin, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMin) || (l = a.graphMin), "function" == typeof a.graphMax ? i = setOptionValue(1, "GRAPHMAX", t, e, m, void 0, a.graphMax, -1, -1, {
                    nullValue: !0
                }) : isNaN(a.graphMax) || (i = a.graphMax), h = Math.ceil(t.chartTextScale * a.scaleFontSize), d = A.availableHeight;
                var s = Math.floor(d / (.66 * h)),
                    r = Math.floor(d / h * .5);
                return l > i && (l = i - 1), {
                    maxValue: i,
                    minValue: l,
                    maxSteps: s,
                    minSteps: r
                }
            }
            var r, c, h, d, u, p, S, g, f, x, A;
            if (t.tpchart = "HorizontalBar", t.tpdata = 0, init_and_start(t, e, a)) {
                a.reverseOrder && "undefined" == typeof t.reversed && (t.reversed = !0, e = reverseData(e));
                var m = initPassVariableData_part1(e, a, t);
                if (A = setMeasures(e, a, t, height, width, "nihil", [""], !0, !0, !0, !0, !0, "StackedBar"), u = s(), u.minValue <= 0 && (a.logarithmic = !1), u.maxSteps > 0 && u.minSteps > 0) {
                    if (a.logarithmic !== !1 && u.minValue <= 0 && (a.logarithmic = !1), p = a.scaleShowLabels ? a.scaleLabel : "", a.scaleOverride) {
                        var M = setOptionValue(1, "SCALESTARTVALUE", t, e, m, void 0, a.scaleStartValue, -1, -1, {
                                nullValue: !0
                            }),
                            P = setOptionValue(1, "SCALESTEPS", t, e, m, void 0, a.scaleSteps, -1, -1, {
                                nullValue: !0
                            }),
                            T = setOptionValue(1, "SCALESTEPWIDTH", t, e, m, void 0, a.scaleStepWidth, -1, -1, {
                                nullValue: !0
                            });
                        c = {
                            steps: P,
                            stepValue: T,
                            graphMin: M,
                            graphMax: M + P * T,
                            labels: []
                        }, populateLabels(1, a, p, c.labels, c.steps, M, c.graphMax, T), A = setMeasures(e, a, t, height, width, c.labels, null, !0, !0, !0, !0, !0, "HorizontalBar")
                    } else c = calculateScale(1, a, u.maxSteps, u.minSteps, u.maxValue, u.minValue, p), A = setMeasures(e, a, t, height, width, c.labels, null, !0, !0, !0, !0, !0, "HorizontalBar");
                    A.availableHeight = A.availableHeight - Math.ceil(t.chartLineScale * a.scaleTickSizeBottom) - Math.ceil(t.chartLineScale * a.scaleTickSizeTop), A.availableWidth = A.availableWidth - Math.ceil(t.chartLineScale * a.scaleTickSizeLeft) - Math.ceil(t.chartLineScale * a.scaleTickSizeRight), r = Math.floor(A.availableHeight / e.labels.length), S = Math.floor(A.availableWidth / c.steps), (0 == S || a.fullWidthGraph) && (S = A.availableWidth / c.steps), A.clrwidth = A.clrwidth - (A.availableWidth - c.steps * S), A.availableWidth = c.steps * S, A.availableHeight = e.labels.length * r, g = A.leftNotUsableSize + Math.ceil(t.chartLineScale * a.scaleTickSizeLeft), f = A.topNotUsableSize + A.availableHeight + Math.ceil(t.chartLineScale * a.scaleTickSizeTop), x = (r - 2 * Math.ceil(t.chartLineScale * a.scaleGridLineWidth) - 2 * Math.ceil(t.chartSpaceScale * a.barValueSpacing) - (Math.ceil(t.chartSpaceScale * a.barDatasetSpacing) * e.datasets.length - 1) - (Math.ceil(t.chartLineScale * a.barStrokeWidth) / 2 * e.datasets.length - 1)) / e.datasets.length, x >= 0 && 1 >= x && (x = 1), 0 > x && x >= -1 && (x = -1);
                    var v;
                    1 * a.maxBarWidth > 0 && x > 1 * a.maxBarWidth ? (v = e.datasets.length * (x - 1 * a.maxBarWidth) / 2, x = 1 * a.maxBarWidth) : v = 0;
                    var L = 0;
                    u.minValue < 0 && (L = calculateOffset(a.logarithmic, 0, c, S)), o(), initPassVariableData_part2(m, e, a, t, {
                        yAxisPosX: g,
                        xAxisPosY: f,
                        barWidth: x,
                        additionalSpaceBetweenBars: v,
                        zeroY: L,
                        scaleHop: r,
                        valueHop: S,
                        calculatedScale: c
                    }), animationLoop(a, n, i, t, A.clrx, A.clry, A.clrwidth, A.clrheight, g + A.availableWidth / 2, f - A.availableHeight / 2, g, f, e, m)
                } else testRedraw(t, e, a)
            }
        },
        requestAnimFrame = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
                    window.setTimeout(e, 1e3 / 60)
                }
        }(),
        cache = {}
};