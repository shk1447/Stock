var jwt = require('jsonwebtoken');
var secret = null;
module.exports = {
	secret: function(key){
		secret = key;
	},
	access: function(_profile) {
		var profile = {
			id: _profile.member_id,
			password: _profile.password
		};

		return jwt.sign(profile, secret, {
			expiresIn: '2 days'
		});
	},
	
	verify: function(_token, _callback) {
		// invalid token
		jwt.verify(_token, secret, _callback);
	}
};