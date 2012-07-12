
var BaseModel = require('./BaseModel').BaseModel;

var Tag = function(dbms) {
    this.init(dbms, "tags");
}

Tag.prototype = new BaseModel();

exports.User = User;