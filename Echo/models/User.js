
var BaseModel = require('./BaseModel').BaseModel;

var User = function(dbms) {
    this.init(dbms, "users");
}

User.prototype = new BaseModel();

exports.User = User;