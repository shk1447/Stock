var path = require('path');
var loginAPI = require('./modules/member');

module.exports = function(app) {
    loginAPI.secret(app.get('secret'));
    app.get('*', function(req, res){
        if(req.path != "/login") {
            if (req.cookies.accessToken) {
                loginAPI.verify(req.cookies.accessToken, function(_err, _profile) {
                    if (!_profile) {
                        res.clearCookie('accessToken');
                        res.redirect('/login');
                    }
                });
            } else {
                res.redirect('/login');
            }
        }
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
}