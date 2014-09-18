<?php

//hooks
add_action('wp_head','ml_head_embed');
add_action('admin_head','ml_admin_head');
add_action('init','ml_add_jquery');

//add jquery in the head
function ml_add_jquery(){
	wp_enqueue_script('jquery');
}

//writing in frontend head
function ml_head_embed()
{
	echo '<script type="text/javascript">';
	echo 'var blog_url = \''.get_bloginfo('wpurl').'\'';
	echo '</script>'."\n";
	echo '<script type="text/javascript" src="'.WP_PLUGIN_URL.'/mail-list/js/functions.js"></script>';
	echo '<link rel="stylesheet" type="text/css" media="all" href="'.WP_PLUGIN_URL.'/mail-list/css/style.css" />';

}

//writing in backend head
function ml_admin_head()
{
	echo '<link rel="stylesheet" type="text/css" media="all" href="'.WP_PLUGIN_URL.'/mail-list/css/style.css" />';
	
	//tinymce
	if($_GET['page']=='mlmenu'){
		echo '<script type="text/javascript" src="'.WP_PLUGIN_URL.'/mail-list/tinymce/jscripts/tiny_mce/tiny_mce.js"></script>';
		echo '<script type="text/javascript">';
		echo 'tinyMCE.init({';
		echo 'theme : "advanced",';
		echo 'mode : "textareas",';
		echo 'plugins : "autoresize"';
		echo'});';
		echo'</script>';
	}	
	
}

?>
