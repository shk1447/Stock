var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./views/App');
var Login = require('./views/Login');
var DataView = require('./views/DataViewer/DataView');
var Collection = require('./views/DataManager/Collection');
var Analysis = require('./views/DataManager/Analysis');
var View = require('./views/DataManager/View');
var {Router,browserHistory,IndexRoute,Route} = require('react-router')

let rootElement = document.getElementById('contents');

ReactDOM.render(<Router history = {browserHistory}>
    <Route path="/Login" component={Login}/>
    <Route path="/App" component = {App} >
        <Route path="DataViewer/DataView" component={DataView}></Route>
        <Route path="DataManager/Collection" component={Collection}/>
        <Route path="DataManager/Analysis" component={Analysis}/>
        <Route path="DataManager/View" component={View}/>
    </Route>
</Router>, rootElement);