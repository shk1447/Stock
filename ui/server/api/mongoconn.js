/**
 * Created by shkim on 2016-06-27.
 */
var MongoClient = require('mongodb').MongoClient;

module.exports = {
    mongoUrl : "",
    setUrl : function(conf) {
        this.mongoUrl = conf.mongo.url;
    },
    insertDoc : function(name, document, _callback) {
        MongoClient.connect(this.mongoUrl, function(err, db) {
            if(err) throw err;
            var collection = db.collection(name);
            collection.insert(document, function (err, result) {
                _callback(result);
                db.close();
            });
        });
    },
    upsertDoc : function(name, document, _callback) {
        MongoClient.connect(this.mongoUrl, function(err, db) {
            if(err) throw err;
            var collection = db.collection(name);
            collection.insert(document, function (err, result) {
                _callback(result);
                db.close();
            });
        });
    },
    findDoc : function(name, document, _callback) {
        MongoClient.connect(this.mongoUrl, function(err, db) {
            if(err) throw err;
            var collection = db.collection(name);
            collection.find(document).toArray(function(err, documents) {
                _callback(documents);
                db.close();
            });
        });
    }
};