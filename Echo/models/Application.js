
var BaseModel = require('./BaseModel').BaseModel;

var Application = function(dbms) {
    this.init(dbms, "applications");
};
Application.prototype = new BaseModel();

Application.prototype.findByAppId = function(app_id, callback) {
    this.findOne({application_id: app_id}, callback);
};
var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
var gen_guid = function() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

Application.prototype.generateAppId = function(callback) {
    var guid = gen_guid();
    this.findByAppId(guid, function(err, result) {
        if(err) callback(err);
        else {
            if(result != null) {
                this.generateAppId(callback);
            } else {
                callback(null, guid);
            }
        }
    })
};

exports.Application = Application;