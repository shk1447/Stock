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

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./views/App');
var Login = require('./views/Login');
var DataEditor = require('./views/DataEditor/DataEditor');
var DataView = require('./views/DataViewer/DataView');
var Collection = require('./views/DataManager/Collection');
var Analysis = require('./views/DataManager/Analysis');
var View = require('./views/DataManager/View');
var Input = require('./views/DataManager/Input');
var {Router,browserHistory,IndexRoute,Route} = require('react-router');
var cookies = require('browser-cookies');

let rootElement = document.getElementById('contents');

ReactDOM.render(<Router history = {browserHistory}>
    <Route path="/" component = {App} onEnter={requireAuth} />
    <Route path="/Login" component={Login}/>
    <Route path="/App" component = {App} onEnter={requireAuth} >
        <Route path="DataEditor/DataEditor" component={DataEditor}/>
        <Route path="DataViewer/DataView" component={DataView}/>
        <Route path="DataManager/Collection" component={Collection}/>
        <Route path="DataManager/Analysis" component={Analysis}/>
        <Route path="DataManager/View" component={View}/>
        <Route path="DataManager/Input" component={Input}/>
    </Route>
</Router>, rootElement);

function requireAuth(nextState,replaceState) {
    if(!sessionStorage['member_id']) {
        replaceState('/login');
    }
}
// $(window).unload(function() {
//     cookies.erase('accessToken');
// });