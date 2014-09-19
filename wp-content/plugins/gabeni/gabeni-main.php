<script type="text/javascript">
if(!window.jQuery.blockUI)
{
   var script = document.createElement('script');
   script.type = "text/javascript";
   script.src = "/wp-content/plugins/gabeni/js/jquery.blockUI.js";
   document.getElementsByTagName('head')[0].appendChild(script);
}
</script>
<?php
$page_url = rawurlencode($_REQUEST["page"]);
$page_html = htmlspecialchars($_REQUEST["page"]);

$gabeni_quota = gabeni_get_quota();
$gabeni_quota_M = round($gabeni_quota["total"]/1024/1024);
if(!$gabeni_quota["total"]) $gabeni_account_type = "empty";
elseif($gabeni_quota["paying"]) $gabeni_account_type = "paying";
else $gabeni_account_type = "trial";

$gabeni_list = gabeni_get_backups_list();
$backups_list_html = '';
foreach($gabeni_list as $backup) 
{
	$backup_id = $backup->id;
	$date_time = date("Y-m-d H:i:s",$backup->ts);
	$backup_file = array_pop(explode("/",$backup->location));
	$size = number_format($backup->size / 1024 / 1024, 2);
	$backups_list_html .= <<<HTML
<tr id="backup_{$backup_id}" class="">
	<td><input type="checkbox" name="backup[]" value="{$backup_id}" class="gabeni-list-cb" id="gabeni-list-cb-{$backup_id}"></td>
	<td><a href="{$gabeni_page}&amp;gabeni_action=download&amp;backup_id={$backup_id}"><img src="/wp-content/plugins/gabeni/images/bullet_disk.png" alt="Download" style="vertical-align:top;">{$backup_file}</a></td>
	<td>{$date_time}</td>
	<td>{$size}MB</td>			
	<td>
		<input type="submit" class="button-secondary gabeni-action" value="Restore" onclick="return gabeni_restore({$backup_id});">
		<input type="submit" class="button-secondary gabeni-action gabeni-delete" value="Delete" onclick="return gabeni_delete_single({$backup_id});">
	</td>
</tr>

HTML;
}
$used_quota = $gabeni_quota["total"]>0 ? round($gabeni_quota["used"] / $gabeni_quota["total"] * 10000)/100 : 100;

$next_daily = wp_next_scheduled("gabeni_daily_event");
$next_hourly = wp_next_scheduled("gabeni_hourly_event");
?>

<div id="my_account">
<h3>My Account</h3>
<table class="wp-list-table widefat fixed posts gabeni-tbl" cellspacing="0" id="gabeni-account">
<thead>
<tr>
	<th class="gabeni-w150">Customer ID:</th>
	<td><?php echo $gabeni_info["gabeni_customer_id"]; ?></td>
</tr>
<tr>
	<th>Key:</th>
	<td><?php echo $gabeni_info["gabeni_key"]; ?></td>
</tr>
<tr>
	<th>Site ID:</th>
	<td><?php echo $gabeni_info["gabeni_site_id"]; ?></td>
</tr>
<tr>
	<th>Last Backup:</th>
	<td><?php echo !empty($gabeni_info["last_backup"]) ? date("Y-m-d H:i:s", $gabeni_info["last_backup"]) : "Never"; ?></td>
</tr>
<tr>
	<th>Next Backup:</th>
	<td class="gabeni_<?php echo $gabeni_account_type; ?>">
<?php
if(!$gabeni_quota["paying"]) echo "Automatic backups are not supported for Free accounts. Please, consider upgrading.";
elseif($gabeni_info["backup_frequency"]=="manual") echo "Manual mode selected. Backups will not run automatically.";
elseif($gabeni_info["backup_frequency"]=="hourly")
{
	if(empty($next_hourly))
	{
		gabeni_schedule_hooks();
		$next_hourly = wp_next_scheduled('gabeni_hourly_event');
	}
	echo !empty($next_hourly) ? date("Y-m-d H:i:s", $next_hourly) : "Never";
}
else
{
	if(empty($next_daily))
	{
		gabeni_schedule_hooks();
		$next_daily = wp_next_scheduled('gabeni_daily_event');
	}
	if(empty($gabeni_info["next_backup"]))
	{
		gabeni_set_next_backup();
		$gabeni_info["next_backup"] = gabeni_get_param("next_backup");
	}
	echo $gabeni_info["next_backup"]." ({$gabeni_info["backup_frequency"]})";
}
?>
	</td>
</tr>
<tr>
	<th class="gabeni-w150">Quota:</th>
	<td class="gabeni_<?php echo $gabeni_account_type; ?>">
<?php if($gabeni_account_type=="empty") { ?>
		You have no quota.  <a href="https://www.icount.co.il/m/pay.php?ci=7227&cp=1&amp;m__customer_id=<?php echo $gabeni_info['gabeni_customer_id']; ?>&amp;redir=<?php echo rawurlencode($gabeni_page); ?>">Purchase now</a>
<?php } elseif($gabeni_account_type=="trial") { ?>
You got <strong><?php echo $gabeni_quota_M; ?>MB of free space </strong> with limited capabilities. <a href="https://www.icount.co.il/m/pay.php?ci=7227&cp=1&m__customer_id=<?php echo $gabeni_info['gabeni_customer_id']; ?>&redir=<?php echo rawurlencode($gabeni_page); ?>"><strong>Purchase more</strong></a> and become a permanent customer.
<?php } else { ?>
    <div class="gabeni_round" style="width:100px; height:25px; margin:0; border:#999 1px solid; float:left;">
    	<div class="gabeni_round gabeni_shadow" style="width:<?php echo $used_quota; ?>px;  height:25px; float:left; background-color:<?php echo $used_quota>=90 ? "#FF3333" : $used_quota>=70 ? "#EEEE00" : "#99FF33"; ?>;"></div>
    </div>
    <div style="margin-left:110px; padding-top:5px;">You are using <strong><?php echo $used_quota; ?>%</strong> of your quota (<?php echo $gabeni_quota_M; ?>MB). | Need more? (coming soon)
<?php } ?>
	</td>
</tr>
</thead>
</table>
</div>

<div id="my_settings">
<form id="frm_gabeni_settings" action="<?php echo $gabeni_page; ?>" method="post" onsubmit="return bui();">
<input type="hidden" name="gabeni_action" value="save_settings">
<h3>Settings</h3>
<table class="wp-list-table widefat fixed posts" cellspacing="0" id="gabeni-settings">
<thead>
<tr>
	<th class="gabeni-w150">Option</th>
	<th>Value</th>
</tr>
</thead>
<tfoot>
<tr>
	<td colspan="2">
		<input type="submit" class="button-primary" value="Save settings">
		<input type="reset" class="button-secondary" value="Cancel">
	</td>
</tr>
</tfoot>
<tbody>
<tr>
	<td><label for="sel_backup_frequency">Backup frequency:</label></td>
	<td class="gabeni_<?php echo $gabeni_account_type; ?>">
<?php if($gabeni_account_type=="paying") { ?>
		<select name="backup_frequency" id="sel_backup_frequency">
<?php foreach(Array('daily','weekly','monthly','manual') as $freq) { ?>
			<option value="<?php echo $freq; if($gabeni_info["backup_frequency"]==$freq) echo '" selected="selected'; ?>"><?php echo ucwords($freq); ?></option>
<?php } ?>
		</select>
<?php } else { ?>
		<strong>Manual only</strong>. This is free account limitation. Upgrade to unlock automatic backups.
<?php } ?>
	</td>
</tr>
<tr>
	<td><label for="inp_rotate">Save last:</label></td>
	<td class="gabeni_<?php echo $gabeni_account_type; ?>">
<?php if($gabeni_quota["paying"]) { ?>
		<input type="text" name="rotate" value="<?php echo $gabeni_info["rotate"]; ?>"> automatic backups.
<?php } else { ?>
		<strong>1 manual backup.</strong> This is free account limitation. Upgrade to unlock backups rotation.
<?php } ?>
	</td>
</tr>
<tr>
	<td><label>Show footer link:</label></td>
	<td>
		<input type="radio" name="show_footer_link" value="1" id="chk_show_footer_link_1"<?php if($gabeni_info["show_footer_link"]) echo ' checked="checked"'; ?>>&nbsp;<label for="chk_show_footer_link_1">Yes</label>
		&nbsp;&nbsp;&nbsp;
		<input type="radio" name="show_footer_link" value="0" id="chk_show_footer_link_0"<?php if(!$gabeni_info["show_footer_link"]) echo ' checked="checked"'; ?>>&nbsp;<label for="chk_show_footer_link_0">No</label>
		<button onclick="window.open('<?php get_option('siteurl'); ?>?gabeni_footer_preview=1','_blank');" class="button-secondary" title="Click here to preview Your site with footer link enabled">Preview</button>
	</td>
</tr>
</tbody>
</table>
</form>
</div>

<script type="text/javascript">
function bui()
{
	 jQuery.blockUI({ 
	 message: '<div style="text-align:center"><h3>Please be patient :)<br />Gebëni is processing your request...</h3></div>', 
	 overlayCSS: { backgroundColor: '#F5FFF2' },
	 css: {
		width: '350px', 
		border: 'none', 
		padding: '30px 5px 30px 5px',
		backgroundColor: '#000', 
		'-webkit-border-radius': '10px', 
		'-moz-border-radius': '10px', 
		opacity: .7,
		color: '#fff' 
		}
	});
	 
}
function unbui()
{
	jQuery.unblockUI();
}
function gabeni_run_backup(backup_id)
{
<?php if($used_quota>=100) { ?>
	alert("You have no quota left. Purchase more space");
	return false;
<?php } else { ?>
	bui();
	jQuery('#frm_backups_list input[type=hidden][name=gabeni_action]').val('backup');
	return true;
<?php } ?>
}
function gabeni_download(backup_id)
{
	bui();
	var url = '<?php echo $gabeni_page; ?>&gabeni_action=download&backup_id=' + encodeURIComponent(backup_id);
	document.location.href=url;
	//unbui();
	return false;
}
function gabeni_restore(backup_id)
{
	if(prompt('You are about to restore from backup. Continue? (yes/no)','no').toLowerCase()!='yes') 
	{
		return false;
	} else {
		bui();
		var url = '<?php echo $gabeni_page; ?>&gabeni_action=restore&backup_id=' + encodeURIComponent(backup_id);
		document.location.href=url;
	}
	return false;
}
function gabeni_delete_single(backup_id)
{
	if(!confirm('Are You sure?')) 
	{
		return false;
	} else {	
		bui();
		jQuery('#frm_backups_list input[type=hidden][name=gabeni_action]').val('delete');
		jQuery('#frm_backups_list input[type=checkbox]').each(function(){
			this.checked = this.value == backup_id;
			});
		//unbui();
	}
	return true;
}
function gabeni_delete_multiple()
{
	if(!confirm('Are You sure?')) 
	{
		return false;
	} else {
		bui();
		if(jQuery('#frm_backups_list input[type=checkbox]:checked').length==0) return false;
		jQuery('#frm_backups_list input[type=hidden][name=gabeni_action]').val('delete');
	}
	return true;
}
</script>
<div id="my_backups">
<h3>My Backups</h3>
<form id="frm_backups_list" name="backup_list_form" action="<?php echo $gabeni_page; ?>" method="post">
<input type="hidden" name="gabeni_action" id="changable_gabeni_action" value="" />
<table class="wp-list-table widefat" id="gabeni-list" cellspacing="0">
<thead>
<tr class="gabeni-list-actions">
	<td colspan="6">
		<input type="submit" class="button-primary" value="Run backup now!" onclick="return gabeni_run_backup();">
		<input type="submit" class="button-secondary gabeni-action gabeni-delete gabeni-action-delete-selected" value="Delete selected" onclick="return gabeni_delete_multiple();" style="display:none;">
	</td>
</tr>
<?php if(!empty($gabeni_list)) { ?>
<tr>
	<th class="gabeni-w20"><input type="checkbox" class="gabeni-list-cb-all"></th>
	<th class=""><span>Backup Name</span></th>
	<th class="gabeni-w200"><span>Date / Time</span></th>
	<th class="gabeni-w80">Size</th>	
	<th class="gabeni-w150">Actions</th>	
</tr>
<?php } ?>
</thead>
<?php if(!empty($gabeni_list)) { ?>
<tfoot>
<tr>
	<th><input type="checkbox" class="gabeni-list-cb-all"></th>
	<th><span>Backup Name</span></th>
	<th><span>Date / Time</span></th>
	<th>Size</th>
	<th>Actions</th>	
</tr>
<tr class="gabeni-list-actions">
	<td colspan="5">
		<input type="submit" class="button-primary" value="Run backup now!" onclick="return gabeni_run_backup();">
		<input type="submit" class="button-secondary gabeni-action gabeni-delete gabeni-action-delete-selected" value="Delete selected" onclick="return gabeni_delete_multiple();" style="display:none;">
	</td>
</tr>
</tfoot>
<tbody id="the-list">
<?php echo $backups_list_html; ?>
</tbody>
<?php } ?>
</table>
</form>
</div>
<script type="text/javascript">
jQuery(document).ready(function(){
	jQuery('#my_backups input[type=checkbox]').click(function(){
		var list = jQuery('#my_backups input[type=checkbox].gabeni-list-cb');
		if(jQuery(this).hasClass('gabeni-list-cb-all'))
		{
			jQuery('#my_backups input[type=checkbox]').attr('checked', this.checked);
		}
		else
		{
			var count_unchecked = list.not(':checked').length;
			var all_checked = count_unchecked == 0;
			jQuery('#my_backups input[type=checkbox].gabeni-list-cb-all').attr('checked', all_checked);
		}
		var count_checked = list.filter(':checked').length;
		jQuery('.gabeni-action-delete-selected').css('display', count_checked>0 ? 'inline' : 'none');
		jQuery("#changable_gabeni_action").val("delete");
		});
	});
</script>
