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

$len = strlen($email);
// if($len > 5) {
// 	//SEND EMAIL

// 	// Email to send to
// 	$to = 'russell@engagementgamelab.org';

// 	// Email Subject
// 	$subject = 'New EGL email subscriber';

// 	// Name to show email from
// 	$from = 'EGL website';

// 	// Domain to show the email from
// 	$fromEmail = 'russell@engagementgamelab.org';

// 	// Construct a header to send who the email is from
// 	$header = 'From: ' . $from . '<' . $fromEmail . '>';

// 	// Try sending the email
// 	if(!mail($to, $subject, $message)){
// 	    die('Error sending email.');
// 	}else{
// 	    // die('Email sent!');
// 	}
// }

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