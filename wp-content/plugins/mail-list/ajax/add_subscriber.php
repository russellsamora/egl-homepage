<?php
//check the email address
if(!isset($_POST['emailaddress'])){exit();}
$email=trim(addslashes($_POST['emailaddress']));
if(!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is',$email)){exit();}

//including the library that allows to use the wpdb object with external files
require_once('../../../../wp-load.php');

//creating 2 unique hash
$hash1=hash('md5',uniqid());
$hash2=hash('md5',uniqid());

//add the email address to the database
global $wpdb;$table_name=$wpdb->prefix."mail_list_table";
//avoid duplicate email
$result = $wpdb->get_results("SELECT email FROM $table_name WHERE email='$email'", ARRAY_A);
if(count($result)==0){
	//insert email into database
	$sql = "INSERT INTO $table_name SET email='$email',hash='$hash1',confirm='$hash2'";
	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
	
	//set recipient - sender - subject - content
	$recipient=$email;
	$sender=get_option('admin_email');
	$subject='Please confirm the subscription';
	$content='<p>Click <a href="'.WP_PLUGIN_URL.'/mail-list/includes/confirm_subscription.php?id='.$hash2.'">here</a> to confirm your subscription to the newsletter.</p>';	
	//send the email
	$headers = array();
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'Content-type: text/html; charset=UTF-8';
	$headers[] = 'Content-Transfer-Encoding: 7bit';        
	$headers[] = 'From: ' . $sender;
	mail($recipient,$subject,$content,join("\r\n", $headers));
}

//set cookie
setcookie("maillistcookie", "done", time()+31104000,"/");

//response
echo "true";
?>
