<?php 
// $dbhost = 'localhost';
// $dbuser = 'root';
// $dbpass = 'root';
// $dbname = 'egl';
// $dbtable = 'whiteboard';

$dbhost = 'gamelib.db.6483931.hostedresource.com';
$dbuser = 'gamelib';
$dbpass = 'Gnomes4eva!';
$dbname = 'gamelib';
$dbtable = 'whiteboard';

$con = mysql_connect($dbhost,$dbuser,$dbpass);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  echo 'error';
  }

$dbSelected = mysql_select_db($dbname, $con);

$result = mysql_query('select count(1) FROM ' . $dbtable );
$row = mysql_fetch_array($result);
$total = $row[0];

echo $total;

mysql_close($con);

?>