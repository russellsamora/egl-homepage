<?php

header("Content-type: application/csv");
header("Content-Disposition: attachment; filename=data".uniqid().".csv");

//including the library that allows to use the wpdb object with external files
require_once('../../../../wp-load.php');

//retrieve the email address from the database
global $wpdb;
$table_name=$wpdb->prefix . "mail_list_table";
$bubi_tables = $wpdb->get_results("SELECT * FROM $table_name WHERE confirm='1'", ARRAY_A);
if(count($bubi_tables)>0){
		$nl = "\n";
		$data="";
		//$data='"email"'.$nl;
		foreach ( $bubi_tables as $bubi_table ) {
			$data=$data.'"'.$bubi_table['email'].'"'.$nl;
		}	//		
}

//$nl = "\n";
//echo '"Name","Age"' . $nl .  '"Chuck Norris","70"';


echo $data;

?>
