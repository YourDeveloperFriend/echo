<?php
print_r($_POST);
if(isset($_POST['regId']) && isset($_POST['deviceId'])) {
	$regId = mysql_real_escape_string($_POST['regId']);
	$deviceId = mysql_real_escape_string($_POST['deviceId']);

	$con = mysql_connect("localhost", "root", "");
	if (!$con) {
	  die('Could not connect: ' . mysql_error());
	}
	mysql_select_db("registration", $con);
	mysql_query("INSERT INTO devices (regId, deviceId) VALUES ('$regId', '$deviceId')");
	mysql_close($con);

	?>
	Connected!
<?php
} else {
?> Not Connected! <?php


 } ?>