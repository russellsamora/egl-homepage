<?php

//menu data page
function mail_list_data() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	//add to database
	if(isset($_POST['addsubscriber'])){
		$email=trim($_POST['addsubscriber']);
		if(!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is',$email)){
				$messages[]='<div class="error"><p>This is not a valid email address</p></div>';
		}else{		
			//add the email address to the database
			global $wpdb;
			$table_name=$wpdb->prefix."mail_list_table";
			
			$result = $wpdb->get_results("SELECT email FROM $table_name WHERE email='$email'", ARRAY_A);
			if(count($result)>0){
				$messages[]='<div class="error"><p>This email address is already in your list</p></div>';
			}else{
				
				//creating unique hash
				$hash1=hash('md5',uniqid());
				
				$sql = "INSERT INTO $table_name SET email='$email',hash='$hash1',confirm='1'";
				require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
				dbDelta($sql);
				$messages[]='<div class="updated"><p>The email address has been added</p></div>';
			}
		}
	}	
	
	//remove from database
	if(isset($_POST['remsubscriber'])){
		$email=$_POST['remsubscriber'];
		if(!preg_match('/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is',$email)){
				$messages[]='<div class="error"><p>This is not a valid email address</p></div>';
		}else{		
			//if exists delete the email address to the database
			global $wpdb;
			$table_name=$wpdb->prefix."mail_list_table";
			$result = $wpdb->get_results("SELECT email FROM $table_name WHERE email='$email'", ARRAY_A);
			if(count($result)>0){
				$sql = "DELETE FROM $table_name WHERE email='$email'";		
				$wpdb->query($sql);
				$messages[]='<div class="updated"><p>The email address has been removed</p></div>';				
			}else{
				$messages[]='<div class="error"><p>This email address is not in your list</p></div>';
			}	
		}	
	}		
	
	//retrieve the number of the email address	
	global $wpdb;$number_of_email=0;
	$table_name=$wpdb->prefix . "mail_list_table";
	$bubi_tables = $wpdb->get_results("SELECT * FROM $table_name WHERE confirm='1'", ARRAY_A);
	if(count($bubi_tables)>0){
			foreach ( $bubi_tables as $bubi_table ) {$number_of_email=$number_of_email+1;}			
	}		
	?>
	
	<!-- OUTPUT START -->
	
	<!-- display update/error messages -->
	<?php if(!empty($messages)){foreach($messages as $message){echo $message;}}	?>
	
	<!-- title -->
	<div class="mail-list-admin">
	<div class="icon-title"><h2>Manage your data</h2></div>	
		
	<!-- add a subscriber form -->	
	<form method="post" action="">
		<label>Add a subscriber</label><input class="inline" type="text" name="addsubscriber" value="email@email.com">
		<input class="button-primary inline" type="submit" value="Add">
	</form>	
	
	<!-- remove a subscriber form -->
	<form method="post" action="">
		<label>Remove a subscriber</label><input class="inline" type="text" name="remsubscriber" value="email@email.com">
		<input class="button-primary inline" type="submit" value="Remove">
	</form>
	</div>	
	
	<!-- display the number of subscribers -->
	<p class="number-of-subscribers">You have now <?php echo $number_of_email; ?> subscribers</p>
	
	<!-- display credits -->
	<?php danycode_credits('Mail List','http://www.danycode.com/mail-list/'); ?>
	
	<!-- OUTPUT END -->
	
	<?php
	
}

?>
