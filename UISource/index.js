var express = require('express'), app = express();
var request = require('request');
var _ = require('lodash');
var jsonfromtable = require("./jsonfromtable");
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
				headers:{'Cookie':'NNB=RWW5GGCPUDKFE; npic=53eAXAIznIDf3UUo2oRoj0dLrE7nOVYhmdpFy4/jl4bojhyRPqnOnnT51rEbtKOaCA==; _ga=GA1.2.494051065.1446683975; nx_ssl=2; nid_iplevel=1; recent_board_read=51826764; page_uid=S8zXdwoRR2sssZDLjLGssssssss-443711; _naver_usersession_=qHX8ENMXlc6iNjIPNFCrVg==; naver_stock_codeList=080000%7C099830%7C038060%7C054940%7C007810%7C060230%7C051370%7C051780%7C021045%7C006345%7C037340%7C084690%7C112610%7C004130%7C123420%7C095610%7C086980%7C076610%7C003720%7C037400%7C049180%7C039240%7C013870%7C171120%7C159650%7C100700%7C029960%7C024900%7C005870%7C002710%7C; summary_item_type=recent; field_list=12|04008C12'},
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

Module.get("http://finance.naver.com/sise/sise_market_sum.nhn", {page:1}, function(a){
  var toto = jsonfromtable.convert(a.result);
});

var reqjson = {
	"base": "finance",
	"type": "000020",
	"rawdata": [{
		"high": "1000",
		"datetime": "156633423"
	}],
	"timefield": "datetime"
};

