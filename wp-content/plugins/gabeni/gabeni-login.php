<div id="settings">
<h3>Login</h3>
<form id="gabeni_frm" method="post" action="<?php echo $gabeni_page; ?>">
<input type="hidden" id="gabeni_action" name="gabeni_action" value="auth" />
<table class="form-table">
<tbody>
<tr valign="top">
	<th scope="row"><label for="gabeni_email">Email</label></th>
	<td scope="row"><input type="text" name="gabeni_email" value="<?php echo htmlspecialchars($_REQUEST["gabeni_email"]); ?>" id="gabeni_email" size="36"></td>
</tr>
<tr valign="top">
	<th scope="row"><label for="gabeni_customer_id">Customer ID</label></th>
	<td scope="row"><input type="text" name="gabeni_customer_id" value="<?php echo htmlspecialchars($_REQUEST["gabeni_customer_id"]); ?>" id="gabeni_customer_id" size="36"></td>
</tr>
<tr valign="top">
	<th scope="row"><label for="gabeni_key">Key</label></th>
	<td scope="row"><input type="text" name="gabeni_key" value="<?php echo htmlspecialchars($_REQUEST["gabeni_key"]); ?>" id="gabeni_key" size="36"></td>
</tr>
<?php if(false) { ?>
<tr valign="top">
	<th scope="row"><label for="gabeni_site_id">Site ID</label></th>
	<td scope="row"><input type="text" name="gabeni_site_id" value="<?php echo $gabeni_info['gabeni_site_id']; ?>" id="gabeni_site_id" size="36"></td>
</tr>
<?php } ?>
</tbody>
</table>        
<p class="submit">
	<input type="submit" name="submit" id="submit" class="button-primary" value="Authenticate!" /> or <input type="submit" onclick="document.getElementById('gabeni_action').value='register';" id="i_dont_have_an_account" class="button-primary" value="I don't have an account. Create one now!" />
</p>
<p class="description">Your <strong>customer id</strong> and <strong>key</strong> will be provided to you once you <a href="/wp-admin/options-general.php?page=<?php echo rawurlencode($_REQUEST["page"]); ?>&amp;gabeni_action=register">register</a> to the service.</p>
</form>
</div>
