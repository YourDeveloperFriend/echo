
/*
 * GET home page.
 */

var apns_push = require('apns_push');
var feedback = require('feedback');

exports.push = function(req, res){
	//res.render('index', { title: 'Pusher Test' })

	// open the connection with APNS server
	apns_push.openApnsConnection(req, res);

	// Loop through the devices passed from Echo
	// Push notification to the appropriate service with the appropriate payload
	for (device in req.body.devices) {

		if (device.device_type.equals("and")) {

			c2dm_push.pushViaC2dm(req, res);

		} else if (device.device_type.equals("ios")) {

			apns_push.pushViaApns(req, res, device);

		} else if (device.device_type.equals("wp7")) {
			// program functionality for Windows Phone 7
		} else {
			// some sort of error
		}

	};

exports.gatherFeedback = function(req, res) {

	feedback.getApnsFeedback(req, res);
	feedback.getC2dmFeedback(req, res);

}

	// var options = {
	//     cert: 'apns-prod-cert.pem',					/* Certificate file */
	//     certData: null,								/* Optional: if supplied uses this instead of Certificate File */
	//     key: 'apns-prod-key-noenc.pem',				/* Key file */
	//     keyData: null,								/* Optional: if supplied uses this instead of Key file */
	//     passphrase: null,							/* Optional: A passphrase for the Key file */
	//     gateway: 'gateway.sandbox.push.apple.com',	/* gateway address */
	//     port: 2195,									/* gateway port */
	//     enhanced: true,								/* enable enhanced format */
	//     errorCallback: failedToSend,					/* Callback when error occurs */
	//     cacheLength: 5								/* Number of notifications to cache for error purposes */
	// };

	// var apnsConnection = new apns.Connection(options);

	/*
	//var myDevice = new apns.Device("A692B3837DE609CC3EE14A3206A5849785FA608AFAB3BC9E7AFEA74225C102FF", true); 
	var myDevice = new apns.Device("DE226AD72D6EAE81681107B327A279A6127CE8FECC82197D064DD3C8C98D2D07", true); 
	// set ascii=true if passing device token as a hexadecimal string
	// set ascii=false if using Buffer object containing binary token
	if (!myDevice) console.log("No device created.");

	console.log("Creating notification...");
	var note = new apns.Notification();
	note.badge = 143;
	note.sound = "ping.aiff";
	note.alert = "*FINSLAP* You have a new message from a Fin buddy!";
	note.payload = {'messageFrom': 'Taylor'};
	note.device = myDevice;
	if (!note) console.log("No notification created.");

	console.log("Sending notification...");
	apnsConnection.sendNotification(note);
	// compiles note as dictionary; example below
	// {"messageFrom":"Caroline","aps":{"badge":3,"sound":"ping.aiff","alert":"You have a new message"}}
	console.log("Sent notification.");
	*/

};