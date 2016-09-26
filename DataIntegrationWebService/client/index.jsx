var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./views/App');
var Login = require('./views/Login');
var DataViewer = require('./views/DataViewer/DataViewer');
var DataManager = require('./views/DataManager/DataManager');
var Collection = require('./views/DataManager/Collection');
var Analysis = require('./views/DataManager/Analysis');
var View = require('./views/DataManager/View');
var {Router,browserHistory,IndexRoute,Route} = require('react-router')

let rootElement = document.getElementById('contents');

ReactDOM.render(<Router history = {browserHistory}>
    <Route path="/Login" component={Login}/>
    <Route path="/App" component = {App} >
        <Route path="DataViewer/:type" component={DataViewer}></Route>
        <Route path="DataManager" component={DataManager}>
            <Route path="Collection" component={Collection}/>
            <Route path="Analysis" component={Analysis}/>
            <Route path="View" component={DataManager}/>
        </Route>
    </Route>
</Router>, rootElement);