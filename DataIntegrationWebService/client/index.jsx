var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./views/App');
var Login = require('./views/Login');
var {Router,browserHistory,IndexRoute,Route} = require('react-router')

let rootElement = document.getElementById('contents');

ReactDOM.render(<Router history = {browserHistory}>
    <Route path="Login" component={Login}/>
    <Route path="App" component = {App} />
</Router>, rootElement);