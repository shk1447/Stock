
var layout = require('./views/StockLayout/StockLayout.jsx');

n.Application.load({
  socket: true,
  routes: {
    path: '/',
    component: layout
  },
  ready: function () {
    return ReactDOM.render(<n.Application />, document.getElementById('contents'));
  }
});
