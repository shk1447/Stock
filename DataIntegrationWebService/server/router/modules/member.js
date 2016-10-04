var jwt = require('jsonwebtoken');
var secret = null;

module.exports = {
	secret: function(key){
		secret = key;
	},
	access: function(_profile) {
		if(_profile) {
			var profile = {
				id: _profile.member_id,
				password: _profile.password
			};

			_profile['token'] = jwt.sign(profile, secret, {
				expiresIn: '2 days'
			});
		}
		return _profile;
	},
	
	verify: function(_token, _callback) {
		// invalid token
		jwt.verify(_token, secret, _callback);
	},
	schema:function(data) {
		return data;
	},
	create:function(data) {
		return data;
	}
};