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

	$query = "SELECT id,author,game FROM `$dbtable` ORDER BY id DESC LIMIT 20";

	$result = mysql_query($query);

	if (!$result) {
	    echo 'Could not run query: ' . mysql_error();
	} else {
		while($row = mysql_fetch_row($result)) {
			echo $row[0] . ',' . $row[1] . ',' . $row[2] . '/';
		}
	}
	mysql_close($con);

?>