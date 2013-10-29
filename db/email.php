<?php
	$message = $_POST[fact];
	$to = "kayakinrob1@gmail.com";
	$subject = "Rob Fact";
	$from = "facts@engagementgamelab.org";
	$headers = "From:" . $from;
	mail($to,$subject,$message,$headers);
?>