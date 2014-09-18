<?php
$gabeni_action = !empty($_REQUEST["gabeni_action"]) ? $_REQUEST["gabeni_action"] : null;
$redirect = false;
$action_status = "error";
switch($gabeni_action)
{
	// show login form
	case "login":
		gabeni_set_param('has_account','0');
		gabeni_set_param('claims_has_account','1');
		break;

	// show registration form
	case "register":
		gabeni_set_param('has_account','0');
		gabeni_set_param('claims_has_account','0');
		break;

	case "auth":
		// verify account
		if(empty($_REQUEST['gabeni_email']) || empty($_REQUEST['gabeni_customer_id']) || empty($_REQUEST['gabeni_key']))
		{
			$action_status_text = "Required parameters missing";
		}
		elseif(gabeni_auth($_REQUEST['gabeni_email'], $_REQUEST['gabeni_customer_id'], $_REQUEST['gabeni_key']))
		{
			$action_status = "success";
			$action_status_text = gabeni_get_param('last_response');

			gabeni_load_history();
			$redirect = true;
		}
		else
		{
			$action_status_text = gabeni_get_param('last_response');
		}
		gabeni_set_param('gabeni_action_status', $action_status.":".$action_status_text);
		break;

	case "create_account":
		if(empty($_REQUEST['gabeni_email']))
		{
			$action_status_text = "Required parameters missing";
		}
		else
		{
			if(gabeni_create_account($_REQUEST['gabeni_email'], $_REQUEST['gabeni_fname'], $_REQUEST['gabeni_lname']))
			{
				$action_status = "success";
				$redirect = true;
			}
			$action_status_text = gabeni_get_param('last_response');
		}
		gabeni_set_param('gabeni_action_status', $action_status.":".$action_status_text);
		break;

	case "save_settings":
		if(gabeni_is_paying())
		{
			$rotate = max(1, intval($_REQUEST['rotate']));
			gabeni_set_param('rotate', $rotate);

			$backup_frequency = !empty($_REQUEST["backup_frequency"]) ? $_REQUEST["backup_frequency"] : "daily";
			gabeni_set_param('backup_frequency', $backup_frequency);

			gabeni_set_next_backup();
		}
		else
		{
			gabeni_set_param('rotate', 1);
			gabeni_set_param('backup_frequency', 'manual');
		}

		$show_footer_link = isset($_REQUEST["show_footer_link"]) ? (!empty($_REQUEST["show_footer_link"])?1:0) : 1;
		gabeni_set_param('show_footer_link', $show_footer_link);

		gabeni_set_param('gabeni_action_status', "success:Settings updated");
		$redirect = true;
		break;

	case "rehook":
		gabeni_schedule_hooks();
		break;

	case "get_history":
		gabeni_load_history();
		break;

	case "backup":
		// perform backup
		if(!gabeni_has_account())
		{
			gabeni_set_param('gabeni_action_status', "error:You are not authorized");
			$redirect = true;
			break;
		}

		if(!$gabeni_quota["paying"])
		{
			$backups = gabeni_get_backups_list();
			$delete = Array();
			foreach($backups as $backup)$delete[] = $backup->id;
			if(!empty($delete)) gabeni_delete_backups_by_ids($delete);
		}
		
		if(gabeni_backup("MANUAL_")) $action_status = "success";
		gabeni_set_param('gabeni_action_status', $action_status.":".gabeni_get_param('last_response'));
		$redirect = true;
		break;
	
	case "restore":
		$backup_id = !empty($_REQUEST["backup_id"]) && ctype_digit($_REQUEST["backup_id"]) ? $_REQUEST["backup_id"] : null;
		if(!empty($backup_id))
		{
			if(gabeni_restore($backup_id))
			{
				gabeni_load_history();
				$action_status = "success";
				$action_status_text = "Successfully restored from backup";
				$redirect = true;
			}
			else
			{
				$action_status_text = "Backup not found";
			}
		}
		else
		{
			$action_status_text = "Missing backup-ID";
		}
		gabeni_set_param('gabeni_action_status', $action_status.":".$action_status_text);
		break;

	case "delete":
		// delete some backups
		if(gabeni_delete_backups_by_ids($_REQUEST['backup'])) $action_status = "success";
		gabeni_set_param('gabeni_action_status', $action_status.":".gabeni_get_param('last_response'));
		$redirect = true;
		break;

	case "download":
		$backup_id = !empty($_REQUEST["backup_id"]) && ctype_digit($_REQUEST["backup_id"]) ? $_REQUEST["backup_id"] : null;
		if(!empty($backup_id))
		{
			ob_end_clean();
			gabeni_download($backup_id); // this should exit if successful
			gabeni_set_param('gabeni_action_status', "error:Backup not found");
		}
		else
		{
			gabeni_set_param('gabeni_action_status', "error:Missing backup-ID");
		}
		$redirect = true;
		break;
}
if($redirect)
{
	$redirect_url = "/wp-admin/options-general.php?page=".rawurlencode($_REQUEST["page"]);
	if(!headers_sent())
		header("Location: ".$redirect_url);
	else
		echo <<<HTML
<script type="text/javascript">window.location.href='{$redirect_url}';</script>
HTML;
	exit;
}
?>
