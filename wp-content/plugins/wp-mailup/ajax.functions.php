<?php
/**
 * @package WP-MailUp
 * MailUp AJAX and Init functions
 */


if(@$_REQUEST['formData'] == 'save')
{
	add_action('init', 'wpmailup_save_config');
}
function wpmailup_save_config()
{
	error_reporting(0);
	
	global $wpmailup;
	
	//echo 'alert(' . print_r($_REQUEST, true).')';
	
	if(@$_REQUEST['formData'] == 'save')
	{
		if(trim($_REQUEST['console-host']) == '')
		{
			//return new WP_Error('', __("I've fallen and can't get up"));
		}
		$wpmailup['consoleHost'] = $_REQUEST['console-host'];
		$wpmailup['subscribePath'] = $_REQUEST['subscribe-path'];
		$wpmailup['pluginTitle'] = $_REQUEST['plugin-title'];
		$wpmailup['pluginDescription'] = $_REQUEST['plugin-description'];
		/* $wpmailup['externalCss'] = $_REQUEST['external-css']; */
		$wpmailup['cssCombination'] = $_REQUEST['css-combination'];
		$wpmailup['submitButton'] = $_REQUEST['submit-button'];
		$wpmailup['requestConfirm'] = $_REQUEST['request-confirm'];
		$wpmailup['listId'] = $_REQUEST['list-id'];
		$wpmailup['listDisplayedName'] = $_REQUEST['list-displayed-name'];
		$wpmailup['groupId'] = $_REQUEST['group-id'];
		
		$wpmailup['emailShow'] = $_REQUEST['email-show'];
		$wpmailup['emailRequired'] = $_REQUEST['email-required'];
		/* as email fieldcode always will be Email */
		/* $wpmailup['emailFieldcode'] = $_REQUEST['email-fieldcode']; */
		$wpmailup['emailDisplayedName'] = $_REQUEST['email-displayed-name'];
		
		$wpmailup['extfield1Show'] = $_REQUEST['extfield1-show'];
		$wpmailup['extfield1Required'] = $_REQUEST['extfield1-required'];
		$wpmailup['extfield1Fieldcode'] = $_REQUEST['extfield1-fieldcode'];
		$wpmailup['extfield1DisplayedName'] = $_REQUEST['extfield1-displayed-name'];
		
		$wpmailup['extfield2Show'] = $_REQUEST['extfield2-show'];
		$wpmailup['extfield2Required'] = $_REQUEST['extfield2-required'];
		$wpmailup['extfield2Fieldcode'] = $_REQUEST['extfield2-fieldcode'];
		$wpmailup['extfield2DisplayedName'] = $_REQUEST['extfield2-displayed-name'];

		$wpmailup['extfield3Show'] = $_REQUEST['extfield3-show'];
		$wpmailup['extfield3Required'] = $_REQUEST['extfield3-required'];
		$wpmailup['extfield3Fieldcode'] = $_REQUEST['extfield3-fieldcode'];
		$wpmailup['extfield3DisplayedName'] = $_REQUEST['extfield3-displayed-name'];

		$wpmailup['extfield4Show'] = $_REQUEST['extfield4-show'];
		$wpmailup['extfield4Required'] = $_REQUEST['extfield4-required'];
		$wpmailup['extfield4Fieldcode'] = $_REQUEST['extfield4-fieldcode'];
		$wpmailup['extfield4DisplayedName'] = $_REQUEST['extfield4-displayed-name'];

		$wpmailup['extfield5Show'] = $_REQUEST['extfield5-show'];
		$wpmailup['extfield5Required'] = $_REQUEST['extfield5-required'];
		$wpmailup['extfield5Fieldcode'] = $_REQUEST['extfield5-fieldcode'];
		$wpmailup['extfield5DisplayedName'] = $_REQUEST['extfield5-displayed-name'];
		
		$wpmailup['mobileShow'] = $_REQUEST['mobile-show'];
		$wpmailup['mobileRequired'] = $_REQUEST['mobile-required'];
		$wpmailup['mobileFieldcode'] = $_REQUEST['mobile-fieldcode'];
		$wpmailup['mobileDisplayedName'] = $_REQUEST['mobile-displayed-name'];
		
		$wpmailup['successMessage'] = $_REQUEST['success-message'];
		$wpmailup['genericError'] = $_REQUEST['generic-error'];
		$wpmailup['invalidAddress'] = $_REQUEST['invalid-address'];
		$wpmailup['invalidPhone'] = $_REQUEST['invalid-phone'];
		$wpmailup['alreadyPresent'] = $_REQUEST['already-present'];
		$wpmailup['fieldRequired'] = $_REQUEST['field-required'];
		$wpmailup['termsNotAgreed'] = $_REQUEST['terms-not-agreed'];
		$wpmailup['termsConfirm'] = $_REQUEST['terms-confirm'];
		$wpmailup['termsNcon'] = $_REQUEST['terms-n-con'];
		$wpmailup['acceptanceMsg'] = $_REQUEST['acceptance-msg'];
				
		update_option('wpmailup', serialize($wpmailup));
	}
	exit();
}

if(@$_REQUEST['formData'] == 'load')
{
	add_action('init', 'wpmailup_load_config');
}

function wpmailup_load_config()
{
	global $wpmailup;
	$wpmailup = unserialize(get_option('wpmailup'));
	echo json_encode($wpmailup);
	exit();
}

?>