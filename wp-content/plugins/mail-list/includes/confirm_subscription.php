<?php

if(isset($_GET['id'])){
	
		$confirm_id=trim(addslashes($_GET['id']));
		
		//including the library that allows to use the wpdb object with external files
		require_once('../../../../wp-load.php');
		
		//modify the confirmation column to 1
		global $wpdb;
		$table_name=$wpdb->prefix."mail_list_table";
		$sql = "UPDATE $table_name SET confirm='1' WHERE confirm='$confirm_id'";		
		$wpdb->query($sql);
		echo '<h1>You are successfully subscribed</h1>';				
		
}

?>
