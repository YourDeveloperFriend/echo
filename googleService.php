<?php

// $msgType: all messages with same type may be "collapsed": if multiple are sent,
// only the last will be received by phone. 
function sendMessageToPhone($authCode, $deviceRegistrationId, $msgType, $messageText) {

            $headers = array('Authorization: GoogleLogin auth=' . $authCode);
            $data = array(
                'registration_id' => $deviceRegistrationId,
                'collapse_key' => $msgType,
                'data.message' => $messageText //TODO Add more params with just simple data instead           
            );

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, "https://android.apis.google.com/c2dm/send");
            if ($headers)
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);


            $response = curl_exec($ch);

            curl_close($ch);

            return $response;
        }
		
	function googleAuthenticate($username, $password, $source="Company-AppName-Version", $service="ac2dm") {    


        session_start();
        if( isset($_SESSION['google_auth_id']) && $_SESSION['google_auth_id'] != null)
            return $_SESSION['google_auth_id'];

        // get an authorization token
        $ch = curl_init();
        if(!$ch){
            return false;
        }

        curl_setopt($ch, CURLOPT_URL, "https://www.google.com/accounts/ClientLogin");
        $post_fields = "accountType=" . urlencode('HOSTED_OR_GOOGLE')
            . "&Email=" . urlencode($username)
            . "&Passwd=" . urlencode($password)
            . "&source=" . urlencode($source)
            . "&service=" . urlencode($service);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);    
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        // for debugging the request
        //curl_setopt($ch, CURLINFO_HEADER_OUT, true); // for debugging the request

        $response = curl_exec($ch);

        //var_dump(curl_getinfo($ch)); //for debugging the request
        //var_dump($response);

        curl_close($ch);

        if (strpos($response, '200 OK') === false) {
            return false;
        }

        // find the auth code
        preg_match("/(Auth=)([\w|-]+)/", $response, $matches);

        if (!$matches[2]) {
            return false;
        }

        $_SESSION['google_auth_id'] = $matches[2];
        return $matches[2];
    }
	?>