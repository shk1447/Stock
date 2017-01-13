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
    execute : function(data, req){
        if(req.cellId) {
            data["cellId"] = req.cellId;
        }
        return data;
    },
    execute_item : function(data, req){
        if(req.title) {
            data["cellId"] = req.cellId;
            data["title"] = req.title;
        }
        return data;
    },
    download : function(data,req){
        return data;
    }
};