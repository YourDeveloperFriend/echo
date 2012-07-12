/**
 * Created with JetBrains PhpStorm.
 * User: Nathan.Tate
 * Date: 6/11/12
 * Time: 10:44 AM
 * To change this template use File | Settings | File Templates.
 */

var InputCleanser = require('../modules/InputCleanser').InputCleanser;

var BaseController = {
    actions: {
        put: {},
        post: {},
        get: {},
        delete : {},
        require_app_id: {
            put: {},
            post: {},
            get: {},
            delete : {}
        }
    },
    models: {},
    uses : [
        "Application"
    ]
};

BaseController.checkInput = function(inputFormat, req, res, callback) {
    var errors = InputCleanser.checkInput(inputFormat, req.body);
    if(errors.length > 0) {
        res.error(res.errors.INCORRECT_INPUT, errors);
    } else {
        callback(req, res);
    }
};

BaseController.addUses = function(usesArray) {
    this.uses = this.uses.concat(usesArray);
};

BaseController.actions.get_action = function(method, action) {
    if(method == "get_action" || method == "require_app_id") {
        return null;
    }
    if(this[method] != 'undefined') {
        if(this[method][action] != 'undefined') {
            return this[method][action];
        }
    }
    return null;
};
BaseController.actions.require_app_id.get_action = BaseController.actions.get_action;

BaseController.load_app = function(app_id, callback) {
    if(typeof app_id == 'undefined') {
        callback(null);
    } else {
        appModel = this.get_model("Application");
        appModel.findByAppId(app_id, function(error, application) {
            callback(application);
        });
    }
};

BaseController.handle = function(req, res) {
    var method = req.route.method,
        action_name = req.params.action;
    var action = this.actions.get_action(method, action_name);
    if(action != null) {
        action(req, res);
    } else {
        action = this.actions.require_app_id.get_action(method, action_name);
        if(action != null) {
            this.load_app(req.params.app_id, function(application) {
                if(application != null) {
                    req.params.application = application;
                    action(req, res);
                } else {
                    res.error(res.errors.INVALID_APP_ID);
                }
            });

        } else {
            res.error(res.errors.INVALID_ACTION, null, "Action: " + req.params.action + ", method:" + req.route.method);
        }
    }
};

BaseController.get_model = function(model_string) {
    if(model_string == 'BaseModel') {
        throw new Error("Model " + model_string + " does not exist.");
    }
    if(this.uses != 'undefined') {
        if(this.models[model_string]) {
            return this.models[model_string];
        } else {
            if(this.uses.indexOf(model_string) != -1) {
                var model = require('../models/' + model_string);
                if(model && model[model_string]) {
                    model = model[model_string];
                    var m = new model(this.dbms);
                    this.models[model_string] = m;
                    return m;
                } else {
                    throw new Error("Model " + model_string + " does not exist.");
                }
            } else {
                throw new Error("Model " + model_string + " not supported.");
            }
        }
    } else {
        throw new Error("Model " + model_string + " not supported.");
    }
};

BaseController.duplicate = function(object) {
    this.duplicateItem(this, object);
}
BaseController.duplicateItem = function(parentObj, child) {
    for(var key in parentObj) {
        if(typeof parentObj[key] == 'object') {
            if(parentObj[key].constructor.toString().indexOf('Array') != -1) {
                child[key] = parentObj[key].slice(0);
            } else {
                child[key] = {};
                BaseController.duplicateItem(parentObj[key], child[key]);
            }
        } else {
            child[key] = parentObj[key];
        }
    }
}

exports.BaseController = BaseController;
