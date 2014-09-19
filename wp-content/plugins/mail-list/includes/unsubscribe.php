<?php

if(isset($_GET['id'])){
		$hash=addslashes($_GET['id']);
		
		//including the library that allows to use the wpdb object with external files
		require_once('../../../../wp-load.php');
		
		//if exists delete the email address to the database
		global $wpdb;
		$table_name=$wpdb->prefix."mail_list_table";
		$result = $wpdb->get_results("SELECT email FROM $table_name WHERE hash='$hash'", ARRAY_A);
		if(count($result)>0){
			$sql = "DELETE FROM $table_name WHERE hash='$hash'";		
			$wpdb->query($sql);
			echo '<h1>You are succesfully unsubscribed</h1>';				
		}else{
			echo '<h1>Your email address does not exist in our system</h1>';
		}	
		
}

?>
