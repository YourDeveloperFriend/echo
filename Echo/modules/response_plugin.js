
var errors = {
    DATABASE_NOT_CONNECTED: 0,
    INCORRECT_INPUT: 1,
    INVALID_APP_ID: 2,
    APP_ID_REQUIRED: 3,
    INVALID_ACTION: 4,
    INVALID_CONTROLLER: 5,
    INTERNAL_ERROR: 6
};
var error_strings = {};
error_strings[errors.DATABASE_NOT_CONNECTED] = "Database not connected.";
error_strings[errors.INCORRECT_INPUT] = "Incomplete or incorrect input. View 'errors' for details.";
error_strings[errors.INVALID_APP_ID] = "Invalid app id.";
error_strings[errors.APP_ID_REQUIRED] = "Please give us an app id in the url: '/Echo/<app_id>/controller/action.";
error_strings[errors.INVALID_ACTION] = "Controller found but action-method not found.";
error_strings[errors.INVALID_CONTROLLER] = "Controller not found.";
error_strings[errors.INTERNAL_ERROR] = "Internal Error. If you are an admin, view the logs.";


var response_plugin = {
    plugin: {
        errors: errors,
        error_strings: error_strings,
        finish_json : function(json) {
            this.writeHead(200, { 'Content-Type': 'application/json' });
            this.write(JSON.stringify(json));
            this.end();
        },
        finish_html: function(json) {
            console.log(JSON.stringify([{xyz: "5"}]));
            if(this.view)
                this.render(this.view, json);
            else
                this.render('error', json);
        },
        finish: function(json) {
            switch(this.format) {
                case 'html': this.finish_html(json); break;
                case 'json':
                default: this.finish_json(json);
            }
        },
        error: function(error_code, errors, additional_message) {
            var json = {};
            json.error_code = error_code;
            json.success = false;
            json.error_string = this.error_strings[error_code];
            if(additional_message) {
                json.error_string += " (" + additional_message + ")";
            }
            if(errors && errors != null)
                json.errors = errors;
            this.finish(json);
        }
    },
    push_onto_object: function(obj, func_name, func) {
        obj[func_name] = func;
    },
    include_plugin: function(res) {
        for(func_name in this.plugin) {
            this.push_onto_object(res, func_name, this.plugin[func_name]);
        }
    }
};

exports.response_plugin = response_plugin;