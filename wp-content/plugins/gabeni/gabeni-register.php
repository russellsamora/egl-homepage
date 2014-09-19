<?php
if(strcasecmp($_SERVER["REQUEST_METHOD"],"POST"))
{
	$current_user = wp_get_current_user();
	$_REQUEST["gabeni_email"] = !empty($current_user->user_email) ? $current_user->user_email : get_option("admin_email");
	$_REQUEST["gabeni_fname"] = $current_user->first_name;
	$_REQUEST["gabeni_lname"] = $current_user->last_name;
}
?>
<form id="gabeni_frm" method="post" action="<?php echo $gabeni_page; ?>">
<input type="hidden" id="gabeni_action" name="gabeni_action" value="create_account" />
<table class="form-table">
<tbody>
<tr valign="top">
	<th scope="row"><label for="gabeni_email">Email</label></th>
	<td scope="row"><input type="text" name="gabeni_email" value="<?php echo htmlspecialchars($_REQUEST["gabeni_email"]); ?>" id="gabeni_email" size="36"></td>
</tr>
<tr valign="top">
	<th scope="row"><label for="gabeni_fname">First Name</label></th>
	<td scope="row"><input type="text" name="gabeni_fname" value="<?php echo htmlspecialchars($_REQUEST["gabeni_fname"]); ?>" id="gabeni_fname" size="36"></td>
</tr>
<tr valign="top">
	<th scope="row"><label for="gabeni_lname">Last Name</label></th>
	<td scope="row"><input type="text" name="gabeni_lname" value="<?php echo htmlspecialchars($_REQUEST["gabeni_lname"]); ?>" id="gabeni_lname" size="36"></td>
</tr>
</tbody>
</table>        
<p class="submit">
	<input type="submit" name="submit" id="submit" class="button-primary" value="Create My Account!" /> or <input type="submit" onclick="document.getElementById('gabeni_action').value='login';" id="submit_i_already_have_an_account" class="button-primary" value="I already have an account" />
</p>
</form>
