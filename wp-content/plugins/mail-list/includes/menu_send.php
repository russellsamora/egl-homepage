<?php

//send the newsletter to all the recipients (based on prefix+mail_list_table database)
function send_the_newsletter($sender,$subject,$content){
	//get subscribers email address from database
	global $wpdb;$mycounter=0;
	$table_name=$wpdb->prefix . "mail_list_table";
	$bubi_tables = $wpdb->get_results("SELECT * FROM $table_name WHERE confirm='1'", ARRAY_A);
	if(count($bubi_tables)>0){
			foreach ( $bubi_tables as $bubi_table ) 
			{		
				//set the unsubscribe link
				$unsubscribe='<p><small>To unsubscribe, <a href="'.WP_PLUGIN_URL.'/mail-list/includes/unsubscribe.php?id='.$bubi_table['hash'].'">click here</a></small></p>';				
				//set the recipient
				$recipient=$bubi_table['email'];
				//send the email
				$headers = array();
				$headers[] = 'MIME-Version: 1.0';
				$headers[] = 'Content-type: text/html; charset=UTF-8';
				$headers[] = 'Content-Transfer-Encoding: 7bit';        
				$headers[] = 'From: ' . $sender;
				mail($recipient,$subject,$content.$unsubscribe,join("\r\n", $headers));
				$mycounter=$mycounter+1;
			}			
	}
	echo '<div class="updated"><p>'.$mycounter.' newsletter sent</p></div>';
}

//send the newsletter to the sender
function send_the_newsletter_test($sender,$subject,$content){	
	//set the unsubscribe link
	$unsubscribe='<p><small>To unsubscribe, click here (The link is inactive because this is a Test Newsletter)</small></p>';				
	//set the recipient as the sender
	$recipient=$sender;
	//send the email
	$headers = array();
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'Content-type: text/html; charset=UTF-8';
	$headers[] = 'Content-Transfer-Encoding: 7bit';        
	$headers[] = 'From: ' . $sender;
	mail($recipient,$subject,$content.$unsubscribe,join("\r\n", $headers));	
	echo '<div class="updated"><p>Test newsletter sent</p></div>';
}

//show the form that allows to send the newsletter
function ml_send_form($sender,$subject='Newsletter title',$content='Newsletter content.'){
	?>
	<div class="mail-list-admin">
		<div class="icon-title">
			<h2>Send a Newsletter</h2>
		</div>
		<form method="post" action="">
			<label>Sender</label><input maxlenght="100" type="text" name="sender" value="<?php echo $sender; ?>">
			<label>Subject</label><input maxlenght="200" type="text" name="subject" value="<?php echo htmlspecialchars($subject,ENT_QUOTES); ?>">
			<textarea rows="20" cols="80" maxlength="100000" name="content"><?php echo $content; ?></textarea>
			<div class="test-newsletter"><input name="test" type="checkbox" value="true" checked="checked"/><span>Send only a <strong>test newsletter</strong> to me (the Sender), do not send to all the subscribers.</span></div>
			<input class="button-primary" type="submit" value="Send the Newsletter">
		</form>	
	</div>
	<?php
}

//menu send page
function mail_list_send() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	//if the form has been submitted send the email to all
	if(isset($_POST['sender']) and isset($_POST['subject']) and isset($_POST['content'])){
		$sender=stripslashes($_POST['sender']);
		$subject=stripslashes($_POST['subject']);
		$content=stripslashes($_POST['content']);		
		if(!isset($_POST['test'])){
			send_the_newsletter($sender,$subject,$content);
			ml_send_form(get_option('admin_email'));
		}else{
			send_the_newsletter_test($sender,$subject,$content);
			ml_send_form($sender,$subject,$content);
		}			
	}else{
		//show the form that allows to send the newsletter
		ml_send_form(get_option('admin_email'));		
	}
	
	//show the credits
	danycode_credits('Mail List','http://www.danycode.com/mail-list/');
}

?>
