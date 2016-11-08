var fs = require('fs');

module.exports = {
    schema: function(res, req) {
        // var files = fs.readdirSync("/video");
        // console.log(files);
        return res;
    },
	getlist: function(data){
        return data;
    },
    create : function(data){
        return data;
    },
    modify : function(data) {
        return data;
    },
    delete : function(data) {
        return data;
    },
    execute : function(data){
        return data;
    },
    download : function(data){
        return data;
    }
};