var jwt = require('jsonwebtoken');

module.exports = {
	create: function(_profile, secret) {
		var profile = {
			name: _profile.name,
			password: _profile.password
		};

		return jwt.sign(profile, secret, {
			expiresIn: '2 days'
		});
	},
	
	verify: function(_token, secret, _callback) {
		// invalid token
		jwt.verify(_token, secret, _callback);
	}
};