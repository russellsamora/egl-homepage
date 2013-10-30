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

	$con = mysql_connect($dbhost,$dbuser,$dbpass);
	if (!$con) {
	  die('Could not connect: ' . mysql_error());
	  echo 'error';
	}

	$dbSelected = mysql_select_db($dbname, $con);

	$id = $_POST[id];

	$query = "SELECT content FROM `$dbtable` WHERE id = '" . $id . "'";

	$result = mysql_query($query);


	if (!$result) {
	    echo 'Could not run query: ' . mysql_error();
	} else {
		$row = mysql_fetch_row($result);
		$story = base64_decode($row[0]);
		echo $story;
	}
	mysql_close($con);

?>