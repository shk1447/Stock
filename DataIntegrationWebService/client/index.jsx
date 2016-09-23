var React = require('react');
var ReactDOM = require('react-dom');
var DataViewer = require('./views/DataViewer');
var DataManager = require('./views/DataManager');
var Login = require('./views/Login');
var {Router,browserHistory,IndexRoute,Route} = require('react-router')

let rootElement = document.getElementById('contents');

ReactDOM.render(<Router history = {browserHistory}>
    <Route path="Login" component={Login}/>
    <Route path="DataViewer" component = {DataViewer} />
    <Route path="DataManager" component = {DataManager} />
</Router>, rootElement);