<?php 
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'egl';
$dbtable = 'lib';

// $dbhost = 'gamelib.db.6483931.hostedresource.com';
// $dbuser = 'gamelib';
// $dbpass = 'Gnomes4eva!';
// $dbname = 'gamelib';
// $dbtable = 'madlib';

$con = mysql_connect($dbhost,$dbuser,$dbpass);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  echo 'error';
  }

$dbSelected = mysql_select_db($dbname, $con);


$lib = $_POST[lib];
$score = $_POST[score];
$author = $_POST[author];
$game = $_POST[game];

// $insert = 'INSERT INTO ' . $dbtable . ' (image) VALUES (' . $fileName . ')';
$insert = 'INSERT INTO ' . $dbtable . ' (lib,score,name,game) VALUES ("' . $lib . '", ' . $score. ', "' . $author . ', "' . $game . '")';

$insertResult = mysql_query($insert);
if(!$insertResult) {
	echo 'bad';
} else {
	echo 'good';
}

mysql_close($con);

?>