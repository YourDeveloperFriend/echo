
var BaseModel = require('./BaseModel').BaseModel;

var Device = function(dbms) {
    this.init(dbms, "devices");
};

Device.prototype = new BaseModel();

Device.prototype.findByAppId = function(app_id, callback) {
    this.find({application_id: app_id}, callback);
};

Device.prototype.getDevice = function(app_id, device_id, device_type, callback) {
    this.findOne({application_id: app_id, device_id: device_id, device_type: device_type}, callback);
};

Device.prototype.findDevices = function(app_id, devices, users, tags, callback) {
    var criteria = {application_id: app_id};
    criteria['$or'] = [];
    for(key in devices) {
        var device_id = devices[key];
        criteria['$or'].push({device_id: device_id});
    }
    for(key in users) {
        var user = users[key];
        criteria['$or'].push({user: user});
    }
    for(key in tags) {
        var tag = tags[key];
        criteria['$or'].push({tag: tag});
    }
    this.find(criteria, callback);
};

exports.Device = Device;