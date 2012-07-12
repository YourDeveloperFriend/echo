
var apns_module = require('apn');

var failedToSend = function(err, sentNote) {
	var errorType;

	switch(err)
	{
	case 0:
		errorType = "noErrorsEncountered";
		break;
	case 1:
		errorType = "processingError";
		break;
	case 2:
		errorType = "missingDeviceToken";
		break;
	case 3:
		errorType = "missingTopic";
		break;
	case 4:
		errorType = "missingPayload";
		break;
	case 5:
		errorType = "invalidTokenSize";
		break;
	case 6:
		errorType = "invalidTopicSize";
		break;
	case 7:
		errorType = "invalidPayloadSize";
		break;
	case 8:
		errorType = "invalidToken";
		break;
	case 255:
		errorType = "none";
		break;
	default:
	  errorType = "No error type match";
	}
	
	console.log("Error Number: " + err);
	console.log("Error Type: " + errorType);

	

}

exports.openApnsConnection = function(req, res) {

	var certFilename = req.body.application_id + "-cert.pem";
	var keyFilename = req.body.application_id + "-key.pem";

	var options = {
	    cert: "apns_certs/" + certFilename,			/* Certificate file */
	    certData: null,								/* Optional: if supplied uses this instead of Certificate File */
	    key: "apns_certs/" + keyFilename,			/* Key file */
	    keyData: null,								/* Optional: if supplied uses this instead of Key file */
	    gateway: 'gateway.sandbox.push.apple.com',	/* gateway address */
	    port: 2195,									/* gateway port */
	    enhanced: true,								/* enable enhanced format */
	    errorCallback: failedToSend,				/* Callback when error occurs */
	    cacheLength: 5								/* Number of notifications to cache for error purposes */
	};

	if (req.body.ios.cert_passphrase) options.passphrase = req.body.ios.cert_passphrase;

	var apnsConnection = new apns_module.Connection(options);
}

exports.pushViaApns = function(req, res, device) {

	var myDevice = new apns_module.Device(device.device_token, true); 
	// set ascii=true if passing device token as a hexadecimal string
	// set ascii=false if using Buffer object containing binary token
	if (!myDevice) console.log("No device created.");

	var note = new apns_module.Notification();
	note.badge = req.body.ios.badge;
	note.sound = req.body.ios.sound;
	note.alert = req.body.ios.alert;
	note.payload = req.body.ios.payload;
	note.device = myDevice;
	if (!note) console.log("No notification created.");

	apnsConnection.sendNotification(note);

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(json));
    res.end();
}