var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var Dbms = require('./dbms').Dbms;

MongoDbms = function(host, port) {
    this.server = new Server(host, port, {auto_reconnect: true}, {});
    this.dbs = new Array();
    this.db = null;
    this.connected_to_db = false;
};
MongoDbms.prototype = new Dbms();

MongoDbms.prototype.setDb = function(db_name, callback) {
    if(this.dbs[db_name]) {
        this.db = this.dbs[db_name];
        callback();
    } else {
        new_db = new Db(db_name, this.server);
        var self = this;
        new_db.open(function(err, db){
            if(err) {
                this.connection_error = err;
                callback("DB error" + err);
            } else {
                self.db = db;
                self.dbs[db_name] = db;
                self.connected_to_db = true;
                callback();
            }
        });
    }
}


MongoDbms.prototype.getCollection= function(collection_name, callback) {
    if(this.db == null) {
        throw new Error("No database selected!");
    } else {
        this.db.collection(collection_name, function(error, collection) {
            if( error ) callback(error);
            else callback(null, collection);
        });
    }
};

MongoDbms.prototype.findAll = function(collection_name, callback) {
    this.find(collection_name, null, callback);
};

MongoDbms.prototype.find = function(collection_name, condition, callback) {
    this.getCollection(collection_name, function(error, collection) {
        if( error ) callback(error)
        else {
            if(condition == null) delete condition;
            collection.find(condition).toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

MongoDbms.prototype.findOne = function(collection_name, condition, callback) {
    this.getCollection(collection_name, function(error, collection) {
        if( error ) callback(error)
        else {
            if(condition == null) delete condition;
            collection.findOne(condition, function(error, doc) {
                if( error ) callback(error)
                else callback(null, doc)
            });
        }
    });
};

MongoDbms.prototype.remove = function(collection_name, condition, callback) {
    this.getCollection(collection_name, function(error, collection) {
        if( error ) callback(error)
        else {
            collection.remove(condition, {}, function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};


MongoDbms.prototype.findById = function(collection_name, id, callback) {
    this.findOne(collection_name, {_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, callback);
};

MongoDbms.prototype.save = function(collection_name, data, callback) {
    this.getCollection(collection_name, function(error, collection) {
        if( error ) callback(error)
        else {
            collection.save(data, function(err, results) {
                callback(err, results);
            });
        }
    });
};

MongoDbms.prototype.insert = function(collection_name, data, callback) {
    this.getCollection(collection_name, function(error, collection) {
        if( error ) callback(error)
        else {

            collection.insert(data, function(err, results) {
                callback(err, results);
            });
        }
    });
};

MongoDbms.prototype.update = function(collection_name, condition, data, callback) {
    this.getCollection(collection_name, function(error, collection) {
        if( error ) callback(error)
        else {
            collection.update(condition, data, function(err, results) {
                callback(err, results);
            });
        }
    });
};

exports.MongoDbms = MongoDbms;
