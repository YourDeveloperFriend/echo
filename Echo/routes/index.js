
/*
 * GET home page.
 */

var Application = require("../models/Application").Application;
var Config = require('../modules/config').Config;
var response_plugin = require('../modules/response_plugin').response_plugin;
var database_driver = new Config.database.driver(Config.database.host, Config.database.port);

database_driver.setDb(Config.database.db_name, function(err) {
     if(err) console.log(err);
     else {
         console.log("Connected to the database_driver.");
     }

});

var controllers = {
};

exports.handle = function(req, res) {
    response_plugin.include_plugin(res);
    if(!database_driver.connected_to_db) {
        res.error(res.errors.DATABASE_NOT_CONNECTED);
    }
    var controller_name = req.params.controller + "_controller";
    if(controller_name == 'BaseController' || controller_name == 'index')
        res.error(res.errors.INVALID_CONTROLLER, "Controller: " + controller_name);
    else {
        try {
            var controller = null;
            if(controllers[controller_name]) {
                controller = controllers[controller_name];
            } else {
                    controller = require('./' + controller_name);
                    controller = controller[controller_name];
                    controller.dbms = database_driver;
                    controllers[controller_name] = controller;

            }
            controller.handle(req, res);
        } catch (err) {
            console.log(err);
            res.error(res.errors.INVALID_CONTROLLER, "Controller: " + controller_name);
        }
    }
};



/*C2DM = require('c2dm').C2DM;

var config = {
    user: 'finslap88@gmail.com',
    password: 'minnowsminnows',
    source: 'com.parivedasolutions.finslap'
};
var c2dm = new C2DM(config);

exports.index = function(req, res){
    res.render('index', { title: 'Express' })
};
exports.sendMsg = function(req, res){
    console.log("sending");
    c2dm.login(function(err, token){
        if(err) console.log(err);
        else {
            var message = {
                registration_id: 'APA91bGI5oY_4UYaM8ClPcVP-TMV_xxYhuRzBTEeHrMeHUktPgI0lWA1C95-vlexQflzp0sJD1xP83tbgYoOSp_oxQ64nverANmlhBPMvjDfm0_NDMSb_02yvuS2NrNy1vIqL1iZrROwJ9wo67neehq0cctnzW8pwalY-X51qCBJiFMCa72rIHw',
                collapse_key: 'important', // required
                'data.message': req.param('message'),
                delay_while_idle: '1' // remove if not needed
            };

            c2dm.send(message, function(err, messageId){
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Sent with message ID: ", messageId);
                }
            });

        }
    });
    res.render('index', { title: 'Express' })
};*/