
var BaseModel = function() {
}

BaseModel.prototype.init = function(dbms, collection_name) {
    this.dbms = dbms;
    this.collection_name = collection_name;
}

/*BaseModel.prototype.getCollection= function(callback) {
    this.dbms.collection(this.collection_name, function(error, collection) {
        if( error ) callback(error);
        else callback(null, collection);
    });
}; */

BaseModel.prototype.findAll = function(callback) {
    this.dbms.findAll(this.collection_name, callback);
};

BaseModel.prototype.find = function(condition, callback) {
    this.dbms.find(this.collection_name, condition, callback);
};

BaseModel.prototype.findOne = function(condition, callback) {
    this.dbms.findOne(this.collection_name, condition, callback);
};

BaseModel.prototype.remove = function(condition, callback) {
    this.dbms.remove(this.collection_name, condition, callback);
};


BaseModel.prototype.findById = function(id, callback) {
    this.dbms.findById(this.collection_name, id, callback);
};

BaseModel.prototype.save = function(data, callback) {
    this.dbms.save(this.collection_name, data, callback);
};

BaseModel.prototype.insert = function(data, callback) {
    this.dbms.insert(this.collection_name, data, callback);
};

BaseModel.prototype.update = function(condition, data, callback) {
    this.dbms.update(this.collection_name, condition, data, callback);
};

exports.BaseModel = BaseModel;