<?php

function wps_blogurl() {
		$url = get_option ( 'home' );
		$url = substr ( $url, 7 );
		$url = str_replace ( "www.", "", $url );
	
	return $url;
}

function wps_domain() {
	if (get_option ( WPS_OPT_DOMAIN )) {
		$domain = get_option ( WPS_OPT_DOMAIN );
	} else {
		$domain = get_option ( 'home' );
		$domain = substr ( $domain, 7 );
		$domain = str_replace ( "www.", "", $domain );
	}
	
	return $domain;
}

//--- Find all the Pages marked with the showall meta key
function wps_showall_pages() {
	global $wpdb, $wps_page_metakey_showall;
	
	$pages = $wpdb->get_col ( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '{$wps_page_metakey_showall}' and meta_value = 'true'" );
	
	return $pages;
}

//--- Get the details of the authors for use with Author Subdomains
function wps_get_authors( $exclude_admin = false ) {
	global $wpdb;
	
	$authors = $wpdb->get_results ( "SELECT ID, user_nicename, display_name from $wpdb->users " . ($exclude_admin ? "WHERE user_login <> 'admin' " : '') . "ORDER BY display_name" );
	
	return $authors;
}

function wps_admin_notices() {
	global $wps_permalink_set;

	$notices = '';
	
	if (get_option(WPS_OPT_DISABLED) != '') {
		$notices .= '<h3>Note: you currently have the plugin set as DISABLED.</h3>';
	}
	
	if (!$wps_permalink_set) {
		$notices .= '<h3>Warning: you do not have permalinks configured so this plugin cannot operate.</h3>';	
	}
	
	return $notices;
}

function getPageChildren($pageID) {
	$childrenARY = array();
	$args = array(
	'post_parent' => $pageID,
	'post_status' => 'publish',
	'post_type' => 'page'
	);
	$children =& get_children($args);

	if ( $children ) {
		foreach (array_keys( $children ) as $child) {
			$childrenARY[] = $child;
			$childrenARY = array_merge($childrenARY, getPageChildren($child));	
		}
	}
	
	return $childrenARY;
}

function wps_getUrlPath($url) {
	$parsed_url = parse_url($url);
	
	if(isset($parsed_url['path'])) {
  	$path = ( (substr($parsed_url['path'], 0, 1) == '/') ? substr($parsed_url['path'], 1) : $parsed_url['path'] );
	} else {
		$path = '';
	}
	
	$path .= ( isset($parsed_url['query']) ? '?'.$parsed_url['query'] : '' );
	$path .= ( isset($parsed_url['fragment']) ? '#'.$parsed_url['fragment'] : '' );

	return $path;	
}

function wps_getNonSubCats() {
	global $wps_subdomains;
	
	$cats_root = get_terms( 'category', 'hide_empty=0&parent=0&fields=ids' );
		
	return array_diff( $cats_root, array_keys($wps_subdomains->cats) );
}

?>
