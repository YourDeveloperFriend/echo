
/*
 * GET feedback page.
 */

var apns_module = require('apn');

var apns_feedback = {};

apns_feedback.iWantFeedback = function(time, device) {
	console.log("FEEDBACK SERVICE RESULTS...");
	console.log("EPOCH TIME: " + time);
	console.log("DEVICE: " + device.toString);
}

var getApnsFeedback = function(req, res) {

    var certFilename = req.body.application_id + "-cert.pem";
    var keyFilename = req.body.application_id + "-key.pem";

    apns_feedback.options = {
        cert: 'apns-prod-cert.pem',         /* Certificate file */
        certData: null,                     /* Optional: if supplied uses this instead of Certificate File */
        key: 'apns-prod-key-noenc.pem',     /* Key file */
        keyData: null,                      /* Optional: if supplied uses this instead of Key file */
        address: 'feedback.sandbox.push.apple.com', /* feedback address */
        port: 2196,                         /* feedback port */
        feedback: this.iWantFeedback,       /* enable feedback service, set to callback */
        interval: 10                        /* interval in seconds to connect to feedback service (default: 3600) */
    };

    if (req.body.ios.cert_passphrase) options.passphrase = req.body.ios.cert_passphrase;

    var feedback = new apns_module.Feedback(apns_feedback.options);
};

exports.getApnsFeedback = getApnsFeedback;