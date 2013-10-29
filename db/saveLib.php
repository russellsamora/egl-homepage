<?php 
	// $dbhost = 'localhost';
	// $dbuser = 'root';
	// $dbpass = 'root';
	// $dbname = 'egl';
	// $dbtable = 'lib';

	$dbhost = 'gamelib.db.6483931.hostedresource.com';
	$dbuser = 'gamelib';
	$dbpass = 'Gnomes4eva!';
	$dbname = 'gamelib';
	$dbtable = 'lib';

	$lib = base64_encode($_POST[lib]);
	$email = $_POST[email];
	$author = $_POST[author];
	$game = $_POST[game];

	$to = "rob@engagementgamelab.org";
	$subject = "New Subscriber for EGL";
	$from = "website@engagementgamelab.org";
	$headers = "From:" . $from;
	mail($to,$subject,$email,$headers);

	$con = mysql_connect($dbhost,$dbuser,$dbpass);
	if (!$con) {
	  die('Could not connect: ' . mysql_error());
	  echo 'error';
	}

	$dbSelected = mysql_select_db($dbname, $con);




	// $insert = 'INSERT INTO ' . $dbtable . ' (image) VALUES (' . $fileName . ')';
	$insert = 'INSERT INTO ' . $dbtable . ' (content, email, author, game) VALUES ("' . $lib . '", "' . $email. '", "' . $author . '", "' . $game . '")';


	$insertResult = mysql_query($insert);

	if(!$insertResult) {
		echo mysql_error($con); 
	} else {
		echo 'good';
	}

	mysql_close($con);

?>