<?php

//show the credits
function danycode_credits($credits_plugin_name,$credits_plugin_url){
	?>	
	<div class="danycode-credits-separator"></div>
	<?php
	echo '<div class="danycode-credits-link"><p>Ask for support at <a target="_blank" href="'.$credits_plugin_url.'">'.$credits_plugin_name.' Official Page</a></div>';
}

?>
