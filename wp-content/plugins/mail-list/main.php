<?php
/*
Plugin Name: Mail List
Plugin URI: http://www.danycode.com/mail-list/
Description: Collect users email address with an awesome fully customizable form implemented with ajax, write and send newsletters, manage your mailing list.
Version: 1.10
Author: Danilo Andreini
Author URI: http://www.danycode.com
License: GPLv2 or later
*/

/*  Copyright 2012  Danilo Andreini (email : andreini.danilo@gmail.com)

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

//embedding external files
require_once('includes/activation.php');//create the table
require_once('includes/menu_data.php');//menu data page
require_once('includes/menu_options.php');//menu options page
require_once('includes/menu_send.php');//menu send page
require_once('includes/front_form.php');//menu send page
require_once('includes/head.php');//menu send page
require_once('includes/menu_export.php');//export email address
require_once('includes/menu_import.php');//export email address
require_once('includes/credits.php');//function to show the credits

//options initialization
if(strlen(get_option('mail_list_label1'))==0){update_option('mail_list_label1',"Join the mailing list");}
if(strlen(get_option('mail_list_label2'))==0){update_option('mail_list_label2',"email address");}
if(strlen(get_option('mail_list_label3'))==0){update_option('mail_list_label3',"Check your email and confirm the subscription");}
if(strlen(get_option('mail_list_label4'))==0){update_option('mail_list_label4',"Submit");}
if(strlen(get_option('mail_list_terms_anchor'))==0){update_option('mail_list_terms_anchor',"Terms");}
if(strlen(get_option('mail_list_terms_link'))==0){update_option('mail_list_terms_link',"");}
if(strlen(get_option('mail_list_form_color'))==0){update_option('mail_list_form_color',"1097FF");}
if(strlen(get_option('mail_list_author_link'))==0){update_option('mail_list_author_link',"0");}

//update tables

if(get_option('mail_list_database_version')<2){
	
	//UPDATE DATABASE TO VERSION 2 INTRODUCED WITH 1.07

	//create the new confirm column
	global $wpdb;$table_name=$wpdb->prefix."mail_list_table";
	$sql = "ALTER TABLE $table_name ADD confirm VARCHAR(32) DEFAULT '1'";
	mysql_query($sql);
	
	//update database version options
	update_option('mail_list_database_version',"2");
}

//create the mail list menu
add_action( 'admin_menu', 'mail_list_menu' );
function mail_list_menu() {
	$form_name='Mail List';
	add_menu_page($form_name, $form_name, 'manage_options', 'mlmenu','mail_list_send',plugins_url().'/mail-list/img/icon16.png');
	add_submenu_page('mlmenu', $form_name.' - Send', 'Send', 'manage_options', 'mlmenu', 'mail_list_send');
	add_submenu_page('mlmenu', $form_name.' - Options', 'Options', 'manage_options', 'mail_list_options', 'mail_list_options');
	add_submenu_page('mlmenu', $form_name.' - Data', 'Data', 'manage_options', 'mail_list_data', 'mail_list_data');
	add_submenu_page('mlmenu', $form_name.' - Import', 'Import', 'manage_options', 'mail_list_import', 'mail_list_import');
	add_submenu_page('mlmenu', $form_name.' - Export', 'Export', 'manage_options', 'mail_list_export', 'mail_list_export');
}

//delete database and options when the plugin is uninstalled
register_uninstall_hook( __FILE__, 'mail_list_uninstall' );
function mail_list_uninstall(){

	//deleting table
	global $wpdb;$table_name=$wpdb->prefix . "mail_list_table";
	$sql = "DROP TABLE $table_name";
	mysql_query($sql);

	//deleting options
	delete_option('mail_list_label1');
	delete_option('mail_list_label2');
	delete_option('mail_list_label3');
	delete_option('mail_list_label4');
	delete_option('mail_list_terms_anchor');
	delete_option('mail_list_terms_link');
	delete_option('mail_list_form_color');
	delete_option('mail_list_author_link');
	delete_option('mail_list_database_version');	
	
}

?>
