<?php
//functions
require_once(dirname(__FILE__)."/gabeni-functions.php");
require_once(dirname(__FILE__)."/gabeni-api.php");

$gabeni_page = gabeni_page_url();
$gabeni_info = gabeni_get_all_info();
$gabeni_quota = gabeni_get_quota();

include(dirname(__FILE__)."/gabeni-actions.php");

// refresh info
$gabeni_info = gabeni_get_all_info();
$gabeni_quota = gabeni_get_quota();

if(!empty($gabeni_info["gabeni_action_status"]))
{
	list($action_status,$action_status_text) = explode(":", $gabeni_info["gabeni_action_status"], 2);
	echo '<h4 class="'.$action_status.'">'.__($action_status_text, 'gabeni')."</h4>\n";
	gabeni_set_param("gabeni_action_status", "");
}

//gabeni_log(var_export($gabeni_info,1));
?>
<link rel="stylesheet" type="text/css" href="/wp-content/plugins/gabeni/gabeni-settings.css" media="all">
<div id="gabeni_logo"><img src="/wp-content/plugins/gabeni/images/gabeni_small_site.png" alt="Gabëni"></div>
<?php
if(!empty($gabeni_info['has_account']))
{
	// authenticated user
	include(dirname(__FILE__)."/gabeni-main.php");
}
elseif(!empty($gabeni_info['claims_has_account']))
{
	// login
	include(dirname(__FILE__)."/gabeni-login.php");
}
else
{
	// registration form
	include(dirname(__FILE__)."/gabeni-register.php");
}
?>
