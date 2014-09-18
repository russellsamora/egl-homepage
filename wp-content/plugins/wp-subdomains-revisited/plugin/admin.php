<?php

function wps_admin_tabs( $current = '' ) {
    echo '<h1>WordPress Subdomains</h1>';
    $tabs = array( '' => __('Welcome'), 'settings' => __('Settings'), 'categories' => __('Categories'), 'pages' => __('Pages') );
    echo '<div id="icon-themes" class="icon32" style="margin-top:-2px;"><br /></div>';
    echo '<h2 class="nav-tab-wrapper">';
    foreach( $tabs as $tab => $name ){
        $class = ( $tab == $current ) ? ' nav-tab-active' : '';
        if ($tab) $tab = '_'.$tab;
        echo "<a class='nav-tab$class' href='?page=wps$tab'>$name</a>";
    }
    echo '</h2>';
}

function wps_page_rows( $pages ) {
	global $wps_page_metakey_subdomain, $wps_page_metakey_theme;
	
	$count = 0;
	$rows = '';
	
	foreach ( $pages as $page ) {
		$count ++;
		if ( $count % 2 ) {
			$rows .= '<tr class="alternate">';
		} else {
			$rows .= '<tr>';
		}
		
		$rows .= '<td><b><a href="post.php?action=edit&amp;post=' . $page ['ID'] . '">' . $page ['title'] . '</a></b></td>';
		$rows .= '<td>' . ($page [$wps_page_metakey_subdomain] ? __('Yes') : __('No')) . '</td>';
		$rows .= '<td>' . ($page [$wps_page_metakey_theme] ? $page [$wps_page_metakey_theme] : 'None') . '</td>';
		$rows .= '<td>' . ($page ['category'] ? $page ['category'] : __('None')) . '</td>';
		$rows .= '</tr>';
	}
	
	return $rows;
}

function wps_category_rows( $cats, $subdomains = 0 ) {
	
	$count = 0;
	$rows = '';
	
	if ( ! empty ( $cats ) ) {
		foreach ( $cats as $cat ) {
			$count ++;
			if ( $count % 2 ) {
				$rows .= '<tr class="alternate">';
			} else {
				$rows .= '<tr>';
			}
			
			$rows .= '<td><b><a href="edit-tags.php?action=edit&taxonomy=category&post_type=post&tag_ID=' . $cat ['ID'] . '">' . $cat ['name'] . '</a></b></td>';
			$rows .= '<td>' . $cat ['slug'] . '</td>';
			if ( $subdomains ) {
				$rows .= '<td>' . ($cat ['theme'] ? $cat ['theme'] : 'None') . '</td>';
				$rows .= '<td>' . ($cat ['filter_pages'] ? 'On' : 'Off') . '</td>';
			}
			$rows .= '</tr>';
		}
	}
	
	return $rows;
}

function wps_settings_plugin() {
	global $wps_page_metakey_theme, $wps_page_metakey_tie;
	wps_admin_tabs('settings');
	?>
<div class="wrap">
	
<?php print(wps_admin_notices()); ?>
	
<form method="post" action="options.php">
<?php
    if (function_exists('settings_fields')){
        settings_fields('wps-settings-group');
    }
    else{
        wp_nonce_field ( 'update-options' );
    }
	?>
	
<h3><?php _e( 'Settings')?></h3>

<table class="form-table">
	
	<tr valign="top">
		<th scope="row"><span class="error-message"><?php _e ( 'DISABLE SUBDOMAINS' )?></span></th>
		<td><input type="checkbox" name="wps_disabled"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_DISABLED ) );
	?> /> <span class="description">This will disable the plugin's functionality whilst allowing you to continue configuring it.</span></td>
	</tr>
	
	<tr valign="top">
		<th scope="row"><?php _e ( 'Main Domain' ) ?></th>
		<td><input type="text" name="wps_domain"
			value="<?php
	echo get_option ( WPS_OPT_DOMAIN )?>"/> <span class="description">If the Main Blog is located on a subdomain (e.g. http://blog.mydomain.com/), enter the Domain here (e.g. mydomain.com).</span></td>
	</tr>

	<tr valign="top">
		<th scope="row"><?php _e ( 'Make All Subdomains' )?></th>
		<td><input type="checkbox" name="wps_subdomainall"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_SUBALL ) );
	?> /> <span class="description">This will turn all main Categories into Subdomains.<br />
		You can select to exclude categories from this by <a
			href="admin.php?page=wps_categories">editing them</a>.</span></td>
	</tr>

	<tr valign="top">
		<th scope="row"><?php	_e ( 'Page Subdomains' )?></th>
		<td><input type="checkbox" name="wps_subpages"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_SUBPAGES ) );
	?> /> <span class="description">Activate the Page Subdomains.</span>
		</td>
	</tr>

	<tr valign="top">
		<th scope="row"><?php _e ( 'Author Subdomains' )?></th>
		<td><input type="checkbox" name="wps_subauthors"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_SUBAUTHORS ) );
	?> /> <span class="description">Activate the Author Subdomains.</span>
		</td>
	</tr>

	<tr valign="top">
		<th scope="row"><?php _e ( 'Custom Subdomain Themes' )?></th>
		<td><input type="checkbox" name="wps_themes"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_THEMES ) );
	?> /> <span class="description">Activate the subdomain theme system.
		To set different themes for each category, <a href="admin.php?page=wps_categories">Edit
		them</a>.<br />
		You can also set different themes for each static subdomained page.
		Just set the custom field <b><?php
	echo $wps_page_metakey_theme;
	?></b> to the theme that you want to use. These theme names are the
		same ones given in the Edit Categories page.</span></td>
	</tr>

	<tr valign="top">
		<th scope="row"><?php
	_e ( 'Redirect Old URLs' )?></th>
		<td><input type="checkbox" name="wps_redirectold"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_REDIRECTOLD ) );
	?> /> <span class="description">If someone comes to the site on an old category or page url it
		redirects them to the new Subdomain one.</span>
	</tr>

	<tr valign="top">
		<th scope="row"><?php
	_e ( 'Redirect Posts Canonical URL' )?></th>
		<td><input type="checkbox" name="wps_redirectcanonical"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_REDIRECT_CANONICAL ) );
	?> /> <span class="description">This will set posts to only showed on single category/pages based on canonical and will redirect if accessed from another/root subdomain.<br />
		<b>Note:</b> This is best for SEO as will avoid duplicate content on subdomains!</span>
	</tr>

	<!-- 
	<tr valign="top">
		<th scope="row"><?php
	_e ( 'No Category Base' )?></th>
		<td><input type="checkbox" name="wps_nocatbase"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_NOCATBASE ) );
	?> /> Turns
		off the Category base on subdomains. <br />
		<b>Warning:</b> Will cause problems on pages that have the same slug
		as categories and vice versa.</td>
	</tr>
	 -->
	
	<tr valign="top">
		<th scope="row"><?php
	_e ( 'Keep Pages on Subdomain' )?></th>
		<td><input type="checkbox" name="wps_keeppagesub"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_KEEPPAGESUB ) );
	?> /> <span class="description">Activate this to have links to your normal pages, not Subdomain or Category Tied, remain on the subdomain being viewed<br />
		<b>Note:</b> This could be bad for SEO as some search engines will see this as duplicate pages.</span></td>
	</tr>
	
	<tr valign="top">
		<th scope="row"><?php
	_e ( 'Subdomain Roots as Indexes' )?></th>
		<td><input type="checkbox" name="wps_subisindex"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_SUBISINDEX ) );
	?> /> <span class="description">The main page of Category and Author Subdomains will be treated by Wordpress as an Index rather than an archive.<br />
		The difference between how Index and Archive are displayed is set by your theme.</span>
		</td>
	</tr>
</table>


<h3><?php _e ( 'Content Filters' )?></h3>
<p>Configure filters to filter out content not belonging to the Subdomain you're on.</p>
<table class="form-table">

	<tr valign="top">
		<th scope="row"><?php _e ( 'Archives' )?></th>
		<td><input type="checkbox" name="wps_arcfilter"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_ARCFILTER ) );
	?> /> <span class="description">Change Archives to just show archive of the Category or Author Subdomain you're on.</span></td>
	</tr>
	
	<tr valign="top">
		<th scope="row"><?php _e ( 'Pages' )?></th>
		<td><input type="checkbox" name="wps_pagefilter"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_PAGEFILTER ) );
	?> /> <span class="description">Activate the Page filtering system. Use this to be able tie pages
		to categories.<br />
		You tie a page by setting custom field <b><?php
	echo $wps_page_metakey_tie;
	?></b> to the ID number of the category.</span></td>
	</tr>
	
	<tr valign="top">
		<th scope="row"><?php _e ( 'Tags' )?></th>
		<td><input type="checkbox" name="wps_tagfilter"
			value="<?php
	echo WPS_CHK_ON?>"
			<?php
	checked ( WPS_CHK_ON, get_option ( WPS_OPT_TAGFILTER ) );
	?> /> <span class="description">Activate the Tag filtering system. Viewing Tags will show only 
	the posts that belong to the subdomain you are on.</span></td>
	</tr>
</table>

<input type="hidden" name="action" value="update" /> <input
	type="hidden" name="page_options"
	value="wps_domain,wps_disabled,wps_subdomainall,wps_themes,wps_pagefilter,wps_arcfilter,wps_nocatbase,wps_redirectold,wps_redirectcanonical,wps_subpages,wps_subauthors,wps_keeppagesub,wps_subisindex, wps_tagfilter" />

<p class="submit"><input type="submit" name="Submit" class="button-primary" value="<?php _e ( 'Save Changes' )?>" /></p>

</form>
</div>
<?php
}

function wps_settings_categories() {
	global $wpdb, $wps_subdomains;
	
	$categories = array ();
	
	// Build Cat Subdomain array (link, name, slug, theme, tied)
	foreach ( $wps_subdomains->cats as $catID => $cat ) {
		$categories ['subdomains'] [$catID] ['ID'] = $catID;
		$categories ['subdomains'] [$catID] ['name'] = $cat->name;
		$categories ['subdomains'] [$catID] ['slug'] = $cat->slug;
		$categories ['subdomains'] [$catID] ['theme'] = $cat->theme;
		$categories ['subdomains'] [$catID] ['filter_pages'] = $cat->filter_pages;
	}
	
	$cats_nosub = wps_getNonSubCats();
	
	if ( ! empty ( $cats_nosub ) ) {
		$tmp_cats = get_categories ( 'hide_empty=0&include=' . implode ( ',', $cats_nosub ) );
		
		// Build Excluded Cat array (link, name, slug, theme, tied)
		foreach ( $tmp_cats as $cat ) {
			$categories ['non_subdomains'] [$cat->term_id] ['ID'] = $cat->term_id;
			$categories ['non_subdomains'] [$cat->term_id] ['name'] = $cat->name;
			$categories ['non_subdomains'] [$cat->term_id] ['slug'] = $cat->slug;
		}
	} else {
		$categories ['non_subdomains'] = array ();
	}
	
	// Determine if MakeAllSubdomain is set.
	$suball = (get_option ( WPS_OPT_SUBALL ) != "");
	
	wps_admin_tabs('categories');
	?>
<div class="wrap">
<p><?php print(wps_admin_notices()); ?></p>

<h3><?php _e('Active Subdomains'); ?></h3>
<?php	if ( $suball ) { ?>
	<p class="description"><b><?php _e( 'Make all Subdomains' )?></b> <?php _e( 'is turned <b>ON</b> so all main categories are turned into subdomains unless specifically excluded.' )?>	
  </p>
	<?php }	?>
	<p class="description"><b><?php _e( 'Note' )?>:</b> <?php _e( 'Only works for main categories' )?>
  </p>
<table class="widefat">
	<thead>
		<tr>
			<th scope="col"><?php _e('Category'); ?></th>
			<th scope="col"><?php _e('Subdomain'); ?></th>
			<th scope="col"><?php _e('Themes'); ?></th>
			<th scope="col"><?php _e('Pages Filter'); ?></th>
		</tr>
	</thead>
	<tbody>
<?php
	print ( wps_category_rows ( $categories ['subdomains'], 1 ) );
	?>
	</tbody>
</table>
<p>&nbsp;</p>

<h3><?php _e('Inactive Subdomains'); ?></h3>
<?php	if ( $suball ) { ?>
	<p class="description"><b><?php _e( 'Make all Subdomains' )?></b> <?php _e( 'is turned <b>ON</b> so all main categories are turned into subdomains unless specifically excluded as below.')?>	
  </p>
	<?php }	?>
	<p class="description"><b><?php _e( 'Note' )?>:</b> <?php _e( 'Subdomains not working for child categories' )?>
<table class="widefat">
	<thead>
		<tr>
			<th scope="col"><?php _e('Category'); ?></th>
			<th scope="col"><?php _e('Subdomain'); ?></th>
		</tr>
	</thead>
	<tbody>
<?php
	print ( wps_category_rows ( $categories ['non_subdomains'], 0 ) );
	?>
	</tbody>
</table>
</div>
<?php
}

function wps_settings_pages() {
	global $wpdb, $wps_page_metakey_theme, $wps_page_metakey_subdomain, $wps_page_metakey_tie;
	
	$meta_keys = array ( $wps_page_metakey_theme, $wps_page_metakey_subdomain, $wps_page_metakey_tie );
	
	$sql = "SELECT Post_ID, meta_key, meta_value FROM {$wpdb->postmeta} WHERE meta_key in ('" . implode ( "','", $meta_keys ) . "') and meta_value != ''";
	$metapages = $wpdb->get_results ( $sql );
	
	$pages_root = array ();
	$pages_child = array ();
	$pages = array ();
	
	if ( ! empty ( $metapages ) ) {
		foreach ( $metapages as $metapage ) {
			$pages [$metapage->Post_ID] [$metapage->meta_key] = $metapage->meta_value;
		}
	}
	
	if ( ! empty ( $pages ) ) {
		foreach ( $pages as $pageid => $page ) {
			$pageobj = get_post ( $pageid );
			
			$page ['ID'] = $pageid;
			$page ['title'] = $pageobj->post_title;
			
			if ( $page [$wps_page_metakey_tie] ) {
				$page_cat = get_category ( $page [$wps_page_metakey_tie] );
				$page ['category'] = $page_cat->cat_name;
			}
			
			if ( $pageobj->post_parent == 0 ) {
				$pages_root [$pageid] = $page;
			} else {
				$pages_child [$pageid] = $page;
			}
		
		}
	}
	
	wps_admin_tabs('pages');
	?>
<div class="wrap">
	
<?php print(wps_admin_notices()); ?>
	
<h3><?php _e('Active Subdomains'); ?></h3>
<p class="description">A list of main Pages that are configured to use WP Subdomains features.</p>
<table class="widefat">
	<thead>
		<tr>
			<th scope="col"><?php _e('Page'); ?></th>
			<th scope="col"><?php _e('Subdomain'); ?></th>
			<th scope="col"><?php _e('Custom Theme'); ?></th>
			<th scope="col"><?php _e('Category'); ?></th>
		</tr>
	</thead>
	<tbody>
<?php
	print ( wps_page_rows ( $pages_root ) );
	?>
	</tbody>
</table>

<p>&nbsp;</p>

<h3><?php _e('Inactive Subdomains'); ?></h3>
<p class="description">A list of child pages that are configured to WP Subdomains features.<br />
<b>Note:</b> Subdomain and Theme Settings will not function for child pages.</p>
<table class="widefat">
	<thead>
		<tr>
			<th scope="col"><?php _e('Page'); ?></th>
			<th scope="col"><?php _e('Subdomain'); ?></th>
			<th scope="col"><?php _e('Custom Theme'); ?></th>
			<th scope="col"><?php _e('Category'); ?></th>
		</tr>
	</thead>
	<tbody>
<?php
	print ( wps_page_rows ( $pages_child ) );
	?>
	</tbody>
</table>
</div>
<?php
}

function wps_settings_welcome() {
	wps_admin_tabs();
	
/*
$taxonomies = get_taxonomies('','objects'); 
foreach ($taxonomies as $taxonomy ) {
    if( strstr( strtolower($taxonomy->label), 'cat') || strstr( strtolower($taxonomy->name), 'cat'))
    echo '<p>'. $taxonomy->name . ' => ' . $taxonomy->object_type[0] . ' => ' . __($taxonomy->label) .'</p>';
}
*/
	?>
<div class="wrap">

<?php print(wps_admin_notices()); ?>
	
<p>This plugin was developed to make it easy for people to setup subdomains that point directly to categories or pages on their wordpress site.</p>

<h3><?php _e('Categories'); ?></h3>
<p>Lists the categories configured as subdomains and categories that
aren't. Shows their current Subdomain settings.</p>

<p>&nbsp;</p>

<h3><?php _e('Pages'); ?></h3>
<p>Lists pages that are configured to use WP Subdomains features.</p>

<p>&nbsp;</p>
<h3><?php _e('Settings'); ?></h3>
<p>General Plugin settings, you can enable and disable plugin features
here.</p>

<p>&nbsp;</p>
<p><hr /></p>

<div class="wrap">
<h3><?php _e('Credits')?></h3>
<ul>
<li><a href="http://www.lontongcorp.com">Erick Tampubolon</a> (a.k.a lontongcorp) of <a href="http://www.igits.co.id">IGITS</a></li>
<li><a href="http://profiles.wordpress.org/selnomeria">selnomeria</a></li>
<li>Subsequently updated by <a	href="http://demp.se/y/2008/04/11/category-subdomains-plugin-for-wordpress-25/">Adam Dempsey</a></li>
<li><a href="http://blog.youontop.com/wordpress/wordpress-category-as-subdomain-plugin-41.html">Gilad Gafni</a></li>
<li>Original Author : <a href="mailto:alex@casualgenius.com">Alex Stansfield</a> of <a href="http://casualgenius.com">Casual Genius</a></li>
</ul>
<p>&nbsp;</p>

<h3><?php _e('History')?></h3>
<p>
This version is an updated modification of "WP Subdomains" by <a href="http://casualgenius.com">Alex Stansfield</a> that stop supporting until version 0.6.9 that not worked for Wordpress 3.3 when I need it for a client.<br />
The original version is at Wordpress <a href="http://wordpress.org/extend/plugins/wordpress-subdomains/">plugin's page</a>. I change the revision numbers to easier maintance and will try continue to support this plugin as much as I can.<br />
Donation will be much appreciated to me or original author.
</p>
<p>
WP Subdomains originally based on the <a href="http://www.biggnuts.com/wordpress-subdomains-plugin/">Subster Rejunevation</a> wordpress plugin by <a href="http://www.biggnuts.com/">Dax Herrera</a>.<br />
Original version started as a few bug fixes but as I found more and more things to add I realised only a rewrite would enable me to make the changes I wanted for my site.<br />
Please <a href="mailto:lontongcorp@gmail.com">contact me</a> if you want contribute or need support.
</p>
</div>

<p>&nbsp;</p>

<h3><?php _e('Copyright')?> &amp; <?php _e('Disclaimer')?></h3>
<p>Use of this application will be at your own risk. No guarantees or warranties are made, direct or implied. The creators cannot and will not be liable or held accountable for damages, direct or consequential. By using this application it implies agreement to these conditions.</p>
</div>
<?php
}

function wps_add_options() {
	add_menu_page ( 'WP Subdomains', 'WP Subdomains', 7, 'wps', 'wps_settings_welcome', WPS_URL . 'icon.png' );
	add_submenu_page ( 'wps', 'Settings', __('Settings'), 7, 'wps_settings', 'wps_settings_plugin' );
	add_submenu_page ( 'wps', 'Categories', __('Categories'), 7, 'wps_categories', 'wps_settings_categories' );
	add_submenu_page ( 'wps', 'Pages', __('Pages'), 7, 'wps_pages', 'wps_settings_pages' );
	add_filter( 'plugin_action_links', 'wps_settings_links',10,2);
}

function wps_settings_links( $links, $file ) {
	if ( $file == WPS_BASE) {
	   $link = '<a href="admin.php?page=wps">' . __('Settings') . '</a>';
	   array_unshift($links, $link);
  }
	return $links;
}

function wps_admin_init(){
	if (function_exists('register_setting')){
		// this whitelists form elements on the options page
		register_setting( 'wps-settings-group', 'wps_domain');
		register_setting( 'wps-settings-group', 'wps_disabled', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_subdomainall', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_subpages', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_subauthors', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_themes', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_redirectold', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_redirectcanonical', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_keeppagesub', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_subisindex', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_arcfilter', 'wps_filter_on_off');
		register_setting( 'wps-settings-group', 'wps_pagefilter', 'wps_filter_on_off');
		//register_setting( 'wps-settings-group', 'wps_tagfilter', 'wps_filter_on_off');
	}
}

function wps_filter_on_off($data){
	if ($data){
		return WPS_CHK_ON;
	}
	return '';
}

function wps_edit_taxonomy( $tag ) {
    global $wpdb, $wps_subdomains;
    $table_name = $wpdb->prefix . "category_subdomains";
    $tagID = $tag->term_id;
    $cat_meta = get_option( "taxonomy_$tagID");
	
		$csd_cat_options = $wpdb->get_row ( "SELECT * FROM {$table_name} WHERE cat_ID = {$tagID};" );
		$cat_theme = stripslashes ( $csd_cat_options->cat_theme );
		$checked_exclude = ('1' == $csd_cat_options->not_subdomain) ? ' checked="checked"' : '';
		$checked_include = ('1' == $csd_cat_options->is_subdomain) ? ' checked="checked"' : '';
		$checked_filterpages = ('1' == $csd_cat_options->filter_pages) ? ' checked="checked"' : '';
		$link_title = stripslashes ( $csd_cat_options->cat_link_title );
		
		$themes = wp_get_themes();
		$theme_options = '<option>(' . __('Default') . ')</option>';
		foreach ( $themes as $theme ) {
		    $selected = ($cat_theme == $theme->Template) ? ' selected="selected"' : '';
		    $theme_options .= '<option value="' . $theme->Template . '"'.$selected.'>' . $theme->Name . '</option>';
		}
?>
<tr class="form-field">
<th scope="row" valign="top"><label for="csd_include"><?php _e('Make as Subdomain'); ?></label></th>
<td><div class="form-field"><input type="checkbox" id="csd_include" name="wps[csd_include]" value="true"<?php echo $checked_include; ?> style="max-width:20px;" />
    <span class="description"><?php _e('Must be a main category'); ?></span></div>
</td>
</tr>
<tr class="form-field">
<th scope="row" valign="top"><label for="csd_exclude"><?php _e('Exclude as Subdomain'); ?></label></th>
<td><div class="form-field"><input type="checkbox" id="csd_exclude" name="wps[csd_exclude]" value="true"<?php echo $checked_include; ?> style="max-width:20px;" />
    <span class="description"><?php _e('Must be a main category to exclude if you opted All Categories as Subdomains by default'); ?></span></div>
</td>
</tr>
<tr class="form-field">
<th scope="row" valign="top"><?php _e('Custom Title'); ?></th>
<td><div class="form-field"><input type="text" name="wps[csd_link_title]" value="<?php	echo $link_title; ?>" />
    <p class="description"><?php _e('Custom Title'); ?> <?php _e('to appear in any links to this Subdomain.'); ?></p></div>
</td>
</tr>
<tr class="form-field">
<th scope="row" valign="top"><?php _e('Themes'); ?></th>
<td><div class="form-field"><select name="wps[csd_cat_theme]"><?php echo $theme_options; ?></select>
    <span class="description"><?php _e('You have to activate Subdomain Themes in'); ?> <a href="<?php admin_url('admin.php?page=wps_settings'); ?>"><?php _e('Settings'); ?></a></span></div>
</td>
</tr>
<tr class="form-field">
<th scope="row" valign="top"><label for="csd_filterpages"><?php _e('Show Only Tied Pages'); ?></label></th>
<td><div class="form-field"><input type="checkbox" id="csd_filterpages" name="wps[csd_filterpages]" value="true"<?php echo $checked_filterpages; ?> style="max-width:20px;" />
    <span class="description"><?php _e('Select this to only filter out pages not tied to categories, page lists will only show pages tied to this category'); ?></span></div>
</td>
</tr>
<?php
}

function wps_save_taxonomy( $tagID ) {
  global $wpdb;
  $table_name = $wpdb->prefix . "category_subdomains";
    
  if ( isset( $_POST['wps'] ) ) {
	    $is_subdomain = ('true' == $_POST['wps']['csd_include']) ? '1' : '0';

	    $not_subdomain = ('true' == $_POST['wps']['csd_exclude']) ? '1' : '0';
	    
	    $cat_theme = addslashes($_POST['wps']['csd_cat_theme']);
	    if ($cat_theme == "(none)") {
	        $cat_theme = "";
	    }
	    
	    $link_title = addslashes(trim($_POST['wps']['csd_link_title']));
	    
	    $filter_pages = ('true' == $_POST['wps']['csd_filterpages']) ? '1' : '0';
	    
	    if ($wpdb->get_var("SELECT cat_ID FROM {$table_name} WHERE cat_ID = '{$tagID}'")) {
	        $querystr = "UPDATE {$table_name} SET is_subdomain={$is_subdomain}, not_subdomain={$not_subdomain}, cat_theme='{$cat_theme}', filter_pages={$filter_pages}, cat_link_title='{$link_title}' WHERE cat_ID = '{$tagID}'";
	    } else {
	        $querystr = "INSERT INTO {$table_name} (cat_ID, is_subdomain, not_subdomain, cat_theme, filter_pages, cat_link_title) VALUES ('{$tagID}', '{$is_subdomain}', '{$not_subdomain}', '{$cat_theme}', '{$filter_pages}', '{$link_title}')";
      }
      
      $wpdb->query($querystr);
  }
}

?>
