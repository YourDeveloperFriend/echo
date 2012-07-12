<?php
include("./googleService.php");
$message = isset($_GET['message']) ? mysql_real_escape_string($_GET['message']) : null;
$devices = isset($_GET['devices']) ? mysql_real_escape_string($_GET['devices']) : array();
$devices = implode(", ", $devices);
$con = mysql_connect("localhost", "root", "");
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("registration", $con);
if($message && !empty($devices)) {
	
	$token = googleAuthenticate("finslap88@gmail.com", "parivedaFriends88");
	if($token) {
		$devices = mysql_query("SELECT * FROM devices WHERE id IN ($devices)");
		while($device = mysql_fetch_assoc($devices)) {
			$response = sendMessageToPhone($token, $device['regId'], "important", $message);
		}
		echo "Messages Sent!";
	} else {
		echo "Messages failed";
	}
	echo "<br/>";
}
$devices = mysql_query("SELECT * FROM devices");
mysql_close($con);
?>
<form method="get" action="./sendMsg.php">
Message: <input type="text" name="message" size="15"/><br/>
Devices:<br/>
<?php $i = 0; while($device = mysql_fetch_assoc($devices)) { $i++;?>
	<input type="checkbox" name="devices[]" value="<?php echo $device['id']; ?>"/>Device #<?php echo $i; ?><br/>
<?php } ?>
</form>