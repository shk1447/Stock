var path = require('path');
var tokenAPI = require('./modules/AccessToken');

module.exports = function(app) {
    var secret = app.get('secret');
    app.get('/', function(req,res){
        if (req.cookies.accessToken) {
            tokenAPI.verify(req.cookies.accessToken, secret, function(_err, _profile) {
				if (_profile) {
					res.redirect('/login');
				} else {
					res.clearCookie('accessToken');
					res.redirect('/login');
				}
			});
        } else {
            res.redirect('/login');
        }
    });
    app.get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
}