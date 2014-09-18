<?php
/*
Plugin Name: Gabëni
Plugin URI: http://www.gabeni.com
Description: Hosted, automated backup and restore for your WordPress powered website!
Author: Gabëni Corp.
Version: 2.0.0
Author URI: http://www.gabeni.com
*/

add_action('admin_menu', 'gabeni_plugin_menu');
add_action('admin_init', 'gabeni_activation_redirect');
add_action('gabeni_daily_event','gabeni_daily');
add_action('gabeni_hourly_event','gabeni_hourly');
add_action('wp_footer', 'gabeni_footer');

register_activation_hook(__FILE__, 'gabeni_activation');
register_deactivation_hook(__FILE__, 'gabeni_deactivation');

//functions
require_once(dirname(__FILE__)."/gabeni-functions.php");
require_once(dirname(__FILE__)."/gabeni-api.php");

/**
 * plugin activation hook
 */
function gabeni_activation()
{
	gabeni_create_tables();
	gabeni_schedule_hooks();
	add_option('gabeni_do_activation_redirect', true);
	/*
	echo <<<HTML
<script type="text/javascript">window.location.href='/wp-admin/options-general.php?page=gabeni-settings';</script>
HTML;
	*/
}

function gabeni_activation_redirect() 
{
    if(get_option('gabeni_do_activation_redirect', false)) 
	{
        delete_option('gabeni_do_activation_redirect');
        wp_redirect(gabeni_page_url());
    }
}

/**
 * plugin deactivation hook
 */
function gabeni_deactivation()
{
	gabeni_unschedule_hooks();
	gabeni_drop_tables();
}

/**
 * plugin menu hook
 */
function gabeni_plugin_menu() 
{
	add_options_page( 'Gabëni Options', 'Gabëni', 'manage_options', 'gabeni-settings', 'gabeni_settings' );
}

/**
 * plugin settings hook
 */
function gabeni_settings() 
{
	if (!current_user_can('manage_options'))
	{
		wp_die(__('You do not have sufficient permissions to access this page.'));
	}
	require_once 'gabeni-settings.php';	
	
}

/**
 * plugin wp-cron hook
 */
function gabeni_daily()
{
	gabeni_logrotate();

	if(!gabeni_has_account() || !gabeni_is_paying()) return;

	$info = gabeni_get_all_info();
	if(in_array($info["backup_frequency"], Array("hourly","manual"))) return;
	if(strtotime($info["next_backup"])>time()) return;

	gabeni_backup("DAILY_");
	gabeni_set_next_backup();
}

/**
 * plugin wp-cron hook
 */
function gabeni_hourly()
{
	if(!gabeni_has_account() || !gabeni_is_paying()) return;

	$info = gabeni_get_all_info();
	if($info["backup_frequency"]!="hourly") return;

	gabeni_backup("HOURLY_");
	gabeni_set_next_backup();
}

/**
 * plugin footer hook
 */
function gabeni_footer()
{
	$info = gabeni_get_all_info();
	if(!$info["show_footer_link"] && empty($_REQUEST["gabeni_footer_preview"])) return;

	echo gabeni_get_credits_html();
}

?>
