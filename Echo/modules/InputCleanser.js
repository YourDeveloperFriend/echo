

var InputCleanser = {};


InputCleanser.is_integer = function(data, key) {
        var value = data[key];
        if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
            return "";
        } else {
            return "The key " + key + " must be an integer.";
        }
};

InputCleanser.json = function(data, key) {
    var value = data[key];
    try {
        if(typeof value == 'object')
            return "";
        var json = JSON.parse(value);
        data[key] = json;
        return "";
    } catch(err) {
        return "The key " + key + " must be in json format.";
    }
}

InputCleanser.is_boolean = function(data, key) {
        var value = data[key];
        if(typeof value == "boolean" || value === "false" || value === "true"){
            return "";
        } else {
            return "The key " + key + " must be an boolean.";
        }
};

InputCleanser.is_array = function(data, key) {
    var value = data[key];
    if(value instanceof Array) {
        for(var key1 in value) {
            if(typeof parseInt(key1) != 'number')
                return "The key " + key + " must be an array.";
            if(typeof value[key1] != "string")
                return "The key " + key + " can only contain strings.";
        }
    } else {
        return "The key " + key + " must be an array.";
    }
    return "";
};

InputCleanser.exists = function(data, key) {
    if(data[key] && data[key] != null && data[key] != "")
        return "";
    return "The key " + key + " must exist.";
};

InputCleanser.checkRestraint = function(data, key, restraintFunction, errors) {
    var error = restraintFunction(data, key);
    if(error != "")
        errors.push(error);
};

InputCleanser.checkInput = function(inputFormat, data) {
    var errors = [];
    for(var key in inputFormat) {
        var exists = this.exists(data, key);
        if(exists == "") {
            for(restraint in inputFormat[key]) {
                this.checkRestraint(data, key, this[inputFormat[key][restraint]], errors);
            }
        } else {
            if(inputFormat[key].indexOf("exists") != -1)
                this.checkRestraint(data, key, this.exists, errors);
        }
    }
    for(key in data) {
        if(!inputFormat[key])
            errors.push("Key " + key + " not recognized.");
    }
    return errors;
};

exports.InputCleanser = InputCleanser;