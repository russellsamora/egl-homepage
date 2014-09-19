<?php

function ml_parse_csv($unique_file_name){
	$counter=0;
	$f = fopen(WP_PLUGIN_DIR."/mail-list/upload/" . $unique_file_name, 'r');
	if ($f) {
		while ($lines = fgetcsv($f)) {  // You might need to specify more parameters
			foreach($lines as $line){
					//save email
					$counter=$counter+ml_save_email($line);
			}
		}
		fclose($f);
	}
	echo '<div class="updated"><p>'.$counter.' email have been added to the database</p></div>';
	
}

function ml_save_email($email){

	$email=trim($email);
	if(!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is',$email)){return 0;}

	//creating a unique hash
	$hash=hash('md5',uniqid());

	global $wpdb;$table_name=$wpdb->prefix."mail_list_table";
	$result = $wpdb->get_results("SELECT email FROM $table_name WHERE email='$email'", ARRAY_A);
	if(count($result)==0){
		$sql = "INSERT INTO $table_name SET email='$email',hash='$hash',confirm='1'";
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
		return 1;		
	}else{
		return 0;		
	}
}

//menu import page
function mail_list_import() {

	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

	if(isset($_FILES['file'])){	
		if ((($_FILES["file"]["type"] == "application/csv") or ($_FILES["file"]["type"] == "text/csv")) and ($_FILES["file"]["size"] < 2000000)){
			if ($_FILES["file"]["error"] > 0){
				$messages[]='<div class="error"><p>Return Code: '.$_FILES["file"]["error"].'</p></div>';
			}
			else{  
			  $unique_file_name="data".uniqid().".csv";
			  move_uploaded_file($_FILES["file"]["tmp_name"],
			  WP_PLUGIN_DIR."/mail-list/upload/" . $unique_file_name);
			  ml_parse_csv($unique_file_name);
			}
		}else{
			$messages[]='<div class="error"><p>'.$counter.'Invalid file</p></div>';
		}
	}
	?>

	<!-- OUTPUT START -->
	
	<!-- display update/error messages -->
	<?php if(!empty($messages)){foreach($messages as $message){echo $message;}}	?>

	<div class="mail-list-admin">
	<div class="icon-title"><h2>Import data</h2></div>
	<p>Add new email address importing a CSV file.</p>
	<form action="" method="post" enctype="multipart/form-data">
	<input type="file" name="file" id="file" >
	<input class="button-primary" type="submit" name="submit" value="Import Data" >
	</form>	
	<h2>Details</h2>
	<p>This task will not overwrite the existing email archive, only add new email address.</p>
	<p>CSV file must be formatted like this:</p>
	<pre>"goofy@gmail.com"
"mickey@gmail.com"
"donald@email"</pre>
	</div>
	
	<?php
	//display credits
	danycode_credits('Mail List','http://www.danycode.com/mail-list');
	
	//OUTPUT END

}

?>
