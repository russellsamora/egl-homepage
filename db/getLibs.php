<?php 
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'egl';
$dbtable = 'whiteboard';

// $dbhost = 'gamelib.db.6483931.hostedresource.com';
// $dbuser = 'gamelib';
// $dbpass = 'Gnomes4eva!';
// $dbname = 'gamelib';
// $dbtable = 'lib';

$con = mysql_connect($dbhost,$dbuser,$dbpass);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  echo 'error';
  }

$result = mysql_query('select author,game,id FROM ' . $dbtable . ' LIMIT 20');

while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
    echo $row[0];
}

echo 'shit';

// while ($row = mysql_fetch_array($result)) {
//     $data .= 
// }

mysql_close($con);

?>