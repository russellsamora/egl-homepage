<?php

//menu export page
function mail_list_export() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	?>
	<!-- OUTPUT START -->
	
	<!-- show the form -->
	<div class="mail-list-admin">
		<div class="icon-title">
			<h2>Export data</h2>
		</div>
		<p>Export your data as CSV.</p>
		<a href="<?php echo WP_PLUGIN_URL; ?>/mail-list/includes/csv_export.php" class="button-primary inline">Export Data</a>
	</div>
	
	<?php
	//display credits
	danycode_credits('Mail List','http://www.danycode.com/mail-list/');
	
	// OUTPUT END
}
?>
