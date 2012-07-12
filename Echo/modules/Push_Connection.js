
/*
 * GET home page.
 */
C2DM = require('c2dm').C2DM;
var querystring = require('querystring');
var http = require('http');
var config = require('./config').Config;

Push_Connection = function() {
    var config = {
        user: 'finslap88@gmail.com',
        password: 'minnowsminnows',
        source: 'com.parivedasolutions.finslap'
    };
    this.c2dm = new C2DM(config);
};
var is_valid = function(variable) {
    return !(typeof variable == 'undefined' || variable == null);
};

Push_Connection.prototype.sendMessages = function(application_id, device_tokens, droid_payload, ios_payload, wp7_payload, callback) {
    var http_client = http.createClient(config.push_server.port, config.push_server.host);
    var json = {
        application_id: application_id,
        devices: device_tokens,
        android: droid_payload,
        ios: ios_payload,
        wp7: wp7_payload
    };
    console.log(config.push_server.actions.push.method);
    var post_data = querystring.stringify(json);
    var post_options = {
        host: config.push_server.host,
        port: config.push_server.port,
        path: config.push_server.actions.push.path,
        method: "POST", //config.push_server.actions.push.method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };
    var request = http.request(post_options, function(response) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            callback(JSON.parse(chunk));
        });

    })
    request.write(post_data);
    request.end();
};
Push_Connection.prototype.sendOneMsg = function(regId, collapse_key, message, callback){
    if(!is_valid(regId))
        callback("Invalid Registration Id: " + regId);
    if(!is_valid(collapse_key))
        callback("Invalid collapse_key: " + collapse_key);
    if(!is_valid(regId))
        callback("Invalid message: " + message);
    this.sendBatchMsg([regId], collapse_key, message, function(err) {
        callback(err);
    });
};
Push_Connection.prototype.sendBatchMsg = function(regIdList, collapse_key, message, callback){
    var self = this;
    this.c2dm.login(function(err, token){
        if(err) callback(err);
        else {
            cursor = 0;
            //console
            function runBatchStep(err) {
                if(err) console.log(err);
                if(regIdList.length > cursor) {
                    regId = regIdList[cursor];
                    cursor++;
                    self.sendMsg(regId, collapse_key, message, runBatchStep);
                } else {
                    callback(null);
                }

            }
            runBatchStep(null);
        }
    });

};
Push_Connection.prototype.sendMsg = function(regId, collapse_key, message, callback){
    if(!is_valid(regId))
        callback("Invalid Registration Id: " + regId);
    if(!is_valid(collapse_key))
        callback("Invalid collapse_key: " + collapse_key);
    if(!is_valid(regId))
        callback("Invalid message: " + message);

    console.log("sending");
    var message = {
        registration_id: regId, //'APA91bGI5oY_4UYaM8ClPcVP-TMV_xxYhuRzBTEeHrMeHUktPgI0lWA1C95-vlexQflzp0sJD1xP83tbgYoOSp_oxQ64nverANmlhBPMvjDfm0_NDMSb_02yvuS2NrNy1vIqL1iZrROwJ9wo67neehq0cctnzW8pwalY-X51qCBJiFMCa72rIHw',
        collapse_key: collapse_key, //'important', // required
        'data.message': message,
        delay_while_idle: '1' // remove if not needed
    };

    this.c2dm.send(message, function(err, messageId){
        if (err) {
            console.log("Something has gone wrong!");
            callback(err);
        } else {
            console.log("Sent with message ID: ", messageId);
            callback(null);
        }
    });
};

exports.Push_Connection = Push_Connection;