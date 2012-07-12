

var BaseController = require('./BaseController').BaseController;
var Push_Connection = require('../modules/Push_Connection').Push_Connection;
var pusher = new Push_Connection();
var device_controller = {};

BaseController.duplicate(device_controller);

device_controller.addUses(["Device"]);

device_controller.actions.require_app_id.get.view = function(req, res) {
    var type_exists = req.query.device_type && req.query.device_type != "";
    var id_exists = req.query.device_id && req.query.device_id != "";
    var device = null;
    if(id_exists || type_exists) {
        if(!id_exists || !type_exists) {
            res.error(res.errors.INCORRECT_INPUT, ['You must put in both device_id and device_type.']);
        } else {
            device = device_controller.get_model("Device");
            device.getDevice(req.params.application.application_id, req.query.device_id, req.query.device_type, function(err, device) {
                if(err) {
                    console.log(err);
                    res.error(res.errors.INTERNAL_ERROR);
                } else {
                    if(!device || device == null) {
                        res.error(res.errors.INCORRECT_INPUT, ['No device found.']);
                    } else {
                        res.finish(device);
                    }
                }
            });
        }
    } else {
        device = device_controller.get_model('Device');

        device.findByAppId(req.params.application.application_id, function(err, devices) {
            if(err) {
                console.log(err);
            } else {
                res.finish({application: req.params.application, devices: devices});
            }
        });
    }
};

device_controller.actions.require_app_id.post.register = function(req, res) {
    device_controller.checkInput({
        token: ["exists"],
        device_id: ["exists"],
        device_type: ["exists"],
        user: [],
        tags: ['is_array']
    }, req, res, function(req, res) {
        req.body.application_id = req.params.application.application_id;
        var devices = device_controller.get_model('Device');
        devices.getDevice(req.body.application_id, req.body.device_id, req.body.device_type, function(err, device) {
            if(err) throw new Error(err);
            else {
                if(device) {
                    res.error(res.errors.INCORRECT_INPUT, ["Device with that device_id and device_type already exist! View /Echo/<app_id>/device/view?device_id=" + req.body.device_id + "&device_type=" + req.body.device_type + " for more details."]);
                } else {
                    devices.insert(req.body, function(err, results) {
                        console.log(results);
                        if(err) throw new Error(err);
                        else {
                            res.finish({
                                device_id: req.body.device_id,
                                success: true
                            });

                        }
                    });
                }
            }
        });
    });
};
device_controller.actions.require_app_id.put.sendMsg = function(req, res) {
    device_controller.checkInput({
        fragment: ["is_boolean"],
        devices: ['is_array'],
        users: ["is_array"],
        tags: ["is_array"],
        excluded_tokens: ['is_array'],
        android:['json'],
        ios: ['json']
    }, req, res, function(req, res) {
        var device = device_controller.get_model("Device");
        device.findDevices(req.params.application.application_id, req.body.devices, req.body.users, req.body.tags, function(error, devices) {
            if(error) {
                console.log(error);
                res.error(res.errors.INTERNAL_ERROR);
            } else {
                var tokens = [];
                for(var key in devices) {
                    tokens.push(devices[key].token);
                }
                // Initialize android payload.
                droid_payload = {
                    collapse_key: req.body.android.collapse_key,
                    google_authorization_token:req.params.application.application_id,
                    payload: {}
                }
                if(req.body.android.extras)
                    droid_payload.payload = req.body.android.extras;
                if(req.body.android.alert)
                    droid_payload.payload.alert = req.body.android.alert;

                // Initialize ios payload

                var ios_payload = {};

                if(req.body.ios.alert)
                    ios_payload.alert = req.body.ios.alert;
                if(req.body.ios.badge)
                    ios_payload.badge = req.body.ios.badge;
                if(req.body.ios.sound)
                    ios_payload.sound = req.body.ios.sound;
                if(req.body.ios.cached)
                    ios_payload.cached = req.body.ios.cached;
                if(req.body.ios.extras)
                    ios_payload.payload = req.body.ios.extras;
                if(req.params.application.cert_passphrase)
                    ios_payload.cert_passphrase = req.params.application.cert_passphrase;
                ios_payload.cert_passphrase = null;

                pusher.sendMessages(req.params.application.application_id, tokens, droid_payload, ios_payload, null,
                    function(response) {
                        res.finish(response);
                    });
            }
        });
    });
};


device_controller.actions.require_app_id.put.sendBroadcast = function(req, res) {
    device_controller.checkInput({
        fragment: ["is_boolean"],
        devices: ['is_array'],
        users: ["is_array"],
        tags: ["is_array"],
        excluded_tokens: ['is_array'],
        android:[],
        ios: []
    }, req, res, function(req, res) {
        var device = device_controller.get_model("Device");
        device.findByAppId(req.params.application.application_id, function(error, devices) {
            if(error) {
                console.log(error);
                res.error(res.errors.INTERNAL_ERROR);
            } else {
                var tokens = [];
                for(var key in devices) {
                    tokens.push(devices[key].token);
                }
                pusher.sendBatchMsg(tokens, "important", "hello!", function(err) {
                    res.finish({success: "true"});
                    console.log(err);
                });
            }
        });
    });
};

device_controller.actions.put.update = function(req, res) {
    device_controller.checkInput({
        token: [],
        device_id: ["exists"],
        device_type: ["exists"],
        user: [],
        set_tags: ['is_array'],
        add_tags: ['is_array'],
        remove_tags: ['is_array']
    }, req, res, function(req, res) {
        req.body.application_id = req.params.application.application_id;
        var devices = device_controller.get_model('Device');
        devices.getDevice(req.body.application_id, req.body.device_id, req.body.device_type, function(err, device) {
            if(err) throw new Error(err);
            else {
                if(!device) {
                    res.error(res.errors.INCORRECT_INPUT, ["Can't find the device with that device_id and device_type! View /Echo/<app_id>/device/view to find the device you're looking for."]);
                } else {
                    var condition = {
                        device_id: req.body.device_id,
                        device_type: req.body.device_type
                    };
                    delete req.body.device_type;
                    delete req.body.device_id;
                    devices.update(condition, req.body, function(err, results) {
                        console.log(results);
                        if(err) throw new Error(err);
                        else {
                            res.finish({
                                device_id: req.body.device_id,
                                success: true
                            });

                        }
                    });
                }
            }
        });
    });
};
device_controller.actions.require_app_id.delete.remove = function(req, res) {
    console.log(req);
    var type_exists = req.query.device_type && req.query.device_type != "";
    var id_exists = req.query.device_id && req.query.device_id != "";
    var device = null;
    if(!id_exists || !type_exists) {
        res.error(res.errors.INCORRECT_INPUT, ['You must put in both device_id and device_type.']);
    } else {
        device = device_controller.get_model("Device");
        device.getDevice(req.params.application.application_id, req.query.device_id, req.query.device_type, function(err, device) {
            if(err) {
                console.log(err);
                res.error(res.errors.INTERNAL_ERROR);
            } else {
                devices.remove(req.query, function(err, results) {
                    console.log(results);
                    if(err) throw new Error(err);
                    else {
                        res.finish({
                            device_id: req.body.device_id,
                            success: true
                        });

                    }
                });
            }
        });
    }
};

    exports.device_controller = device_controller;
