

var Dbms = function(){
}

Dbms.prototype.save = function(collection_name, new_data, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.setDb = function(db_name, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.insert = function(collection_name, new_data, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.update = function(collection_name, condition, new_data, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.findAll = function(collection_name, callback) {
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.find = function(collection_name, condition, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.findById = function(collection_name, id, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.getCollection = function(collection_name, callback){
    callback("ERROR: unsupported dbms function");
}
Dbms.prototype.remove = function(collection_name, condition, callback){
    callback("ERROR: unsupported dbms function");
}

exports.Dbms = Dbms;

