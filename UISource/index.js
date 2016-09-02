var express = require('express'), app = express();
var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');
var tabletojson = require("tabletojson");
var iconv  = require('iconv-lite');

app.use(express.static(__dirname + '/public'))

app.listen(5772, function() {
  console.log('Listening on port 3000...')
});

var Module = {
		get: function(_url, _params, _callback) {
			var paramString = '';
			var params = [];

			_.forEach(_params, function(value, key) {
				params.push(key + '=' + value);
			});

			paramString = params.join('&');

			var options = {
				url:  _url + '?' + paramString,
				method: 'GET',
        encoding: null,
				body: ''
			};

			request(options, function(err, res, body) {
        var strContents = new Buffer(body);
				_callback({
					success: true,
					result: iconv.decode(strContents, 'EUC-KR').toString()
				});
			});
		},

		post: function(_url, _body, _callback) {
			_body.SiteID = _body.SiteID ? _body.SiteID : 1;

			var options = {
				url: _url,
				method: 'POST',
				body: JSON.stringify(_body)
			};

			request(options, function(err, res, body) {
        if(err) { _callback({success:false})};
				_callback({
					success: true,
					result: body
				});
			});
		}
};

module.exports = {
	get: Module.get,
	post: Module.post
};

Module.get("http://finance.naver.com/sise/sise_market_sum.nhn", {}, function(a){
  var toto = tabletojson.convert(a.result);
})