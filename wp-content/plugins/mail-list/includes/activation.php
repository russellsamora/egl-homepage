<?php

//hook
register_activation_hook(WP_PLUGIN_DIR.'/mail-list/main.php','mail_list_create_table');

//create prefix+mail_list_table
function mail_list_create_table(){
	global $wpdb;$table_name=$wpdb->prefix . "mail_list_table";
	$sql = "CREATE TABLE $table_name (
	  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  email VARCHAR(100) DEFAULT '' NOT NULL,
	  hash VARCHAR(32) DEFAULT '' NOT NULL,
	  confirm VARCHAR(32) DEFAULT '1' NOT NULL
	);";
	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
	
	//Update database version introduced with 1.07
	//confirm field in *prefix*mail_list_table has been introduced in 1.07
	update_option('mail_list_database_version',"2");
}

?>
