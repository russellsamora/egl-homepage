<?php 
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'egl';
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

$fileName = 'image' . $total . '.png';

$image = $_POST[image];

// remove "data:image/png;base64,"
$uri =  substr($image,strpos($image,",") + 1);

// save to file
file_put_contents('../img/whiteboard/' . $fileName, base64_decode($uri));

// $insert = 'INSERT INTO ' . $dbtable . ' (image) VALUES (' . $fileName . ')';
$insert = 'INSERT INTO ' . $dbtable . ' (image) VALUES ("' . $fileName . '")';

$insertResult = mysql_query($insert);
if(!$insertResult) {
	echo 'bad';
} else {
	echo 'good';
}

mysql_close($con);

?>