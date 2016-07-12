/**
 * Created by shkim on 2016-06-22.
 */
var path = require('path');
module.exports = {
    '/echo/:param' : function(req, res, next) {
        if (req.query) {
            res.send(req.query);
        } else {
            res.send(req.params.param);
        }
    },
    '*': function(req, res) {
        res.sendFile(path.join(__dirname, '../../../', 'index.html'));
    }
};