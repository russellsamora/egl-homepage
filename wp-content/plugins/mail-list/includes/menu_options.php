<?php

//menu options page
function mail_list_options() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

    // Read in existing options value from database
    $label1 = get_option('mail_list_label1');
    $label2 = get_option('mail_list_label2');
    $label3 = get_option('mail_list_label3');
    $label4 = get_option('mail_list_label4');
    $terms_link = get_option('mail_list_terms_link');
    
    // Save options if user has posted some information
    if(isset($_POST['label1']) or isset($_POST['label2']) or isset($_POST['label3']) or isset($_POST['label4']) or isset($_POST['termsanchor']) or isset($_POST['termslink']) or isset($_POST['formcolor']) or isset($_POST['authorlink']) ){        
        $label1=$_POST['label1'];$label2=$_POST['label2'];$label3=$_POST['label3'];$label4=$_POST['label4'];$terms_anchor=$_POST['termsanchor'];$terms_link=$_POST['termslink'];$form_color=$_POST['formcolor'];
        if(isset($_POST['authorlink'])){update_option('mail_list_author_link',"1");}else{update_option('mail_list_author_link',"0");}
        //regexp check
        //$error=0;
	    //if(preg_match('/[^a-z_, .?\-0-9]/i',$label1)){$errors[]='Only letters and characters [. , ?] are allowed in "Welcome Message"';}
	    //if(preg_match('/[^a-z_, .?\-0-9]/i',$label2)){$errors[]='Only letters and characters [. , ?] are allowed in "Email Input text"';}
	    //if(preg_match('/[^a-z_, .?\-0-9]/i',$label3)){$errors[]='Only letters and characters [. , ?] are allowed in "Success message"';}
	    //if(preg_match('/[^a-z_, .?\-0-9]/i',$label4)){$errors[]='Only letters and characters [. , ?] are allowed in "Sumbit button text"';}
	    //if(preg_match('/[^a-z_, .?\-0-9]/i',$terms_anchor)){$errors[]='Only letters and characters [. , ?] are allowed in "Terms anchor text"';}
	    if(!preg_match('/^([0-9a-f]{1,2}){3}$/i',$form_color)){$errors[]='Only RGB color as form color.';}
        if(count($errors)==0){
			// Save into database
			update_option('mail_list_label1',$label1);update_option('mail_list_label2',$label2);update_option('mail_list_label3',$label3);update_option('mail_list_label4',$label4);update_option('mail_list_terms_anchor',$terms_anchor);update_option('mail_list_terms_link',$terms_link);update_option('mail_list_form_color',$form_color);
			$messages[]='<div class="updated"><p>Your options have been saved</p></div>';
		}else{
			//error messages
			foreach($errors as $error){$messages[]='<div class="error"><p>'.$error.'</p></div>';}
		}
	}
	
	// OUTPUT START
	
	//display update/error messages
	if(!empty($messages)){foreach($messages as $message){echo $message;}}	
	
	?>
	
	<!-- display the form -->
	<div class="mail-list-admin">
		<div class="icon-title">
			<h2>General Options</h2>
		</div>
		<form method="post" action="">
			<label>Welcome message</label><input maxlenght="40" type="text" name="label1" value="<?php echo get_option('mail_list_label1'); ?>">
			<label>Email Input text</label><input maxlenght="40" type="text" name="label2" value="<?php echo get_option('mail_list_label2'); ?>">
			<label>Success message</label><input maxlenght="40" type="text" name="label3" value="<?php echo get_option('mail_list_label3'); ?>">
			<label>Sumbit button text</label><input maxlenght="10" type="text" name="label4" value="<?php echo get_option('mail_list_label4'); ?>">
			<label>Terms anchor text</label><input maxlenght="1000" type="text" name="termsanchor" value="<?php echo stripslashes(get_option('mail_list_terms_anchor')); ?> ">
			<label>Terms link - example: http://www.yourblog.com/terms - N.B. Leave this field empty to hide the terms link</label><input maxlenght="1000" type="text" name="termslink" value="<?php echo htmlspecialchars(stripslashes(get_option('mail_list_terms_link')),ENT_QUOTES); ?>">
			<label>Form Color (RGB)</label><input maxlength="6" size="6" type="text" name="formcolor" value="<?php echo get_option('mail_list_form_color'); ?>">
			<label>Official Page link - This is a little optional kindnees to the plugin author</label><input name="authorlink" type="checkbox" value="true" <?php if(get_option('mail_list_author_link')=="1"){echo 'checked="checked"';} ?> /><span>Show a little link to the plugin Official Page</span>
			<input class="button-primary" type="submit" value="Save">
		</form>
	</div>
	
	<!-- display credits -->
	<?php danycode_credits('Mail List','http://www.danycode.com/mail-list/'); ?>
	
	<!-- OUTPUT END -->
	
	<?php
}

?>
