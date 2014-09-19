<?php

/*
 * The login logo.
 * Uses the logo uploaded by the user from the customizer.
 */
function shoestrap_login_logo() {
  if ( get_theme_mod( 'shoestrap_logo' ) ) {
    return get_theme_mod( 'shoestrap_logo' ) ;
  }
}

/*
 * Alters the login screen according to our customizer options.
 */
function shoestrap_login_scripts() {
  $color                  = get_theme_mod( 'shoestrap_background_color' );
  $header_bg_color        = get_theme_mod( 'shoestrap_header_backgroundcolor' );
  $header_sitename_color  = get_theme_mod( 'shoestrap_header_textcolor' );
  $btn_color              = get_theme_mod( 'shoestrap_buttons_color' );
  $link_color             = get_theme_mod( 'shoestrap_link_color' );

  // $background is the saved custom image, or the default image.
  $background = get_background_image();

  if ( ! $background && ! $color )
    return;

  $style = $color ? "background-color: #$color;" : '';

  if ( $background ) {
    $image = " background-image: url('$background');";

    $repeat = get_theme_mod( 'background_repeat', 'repeat' );
    if ( ! in_array( $repeat, array( 'no-repeat', 'repeat-x', 'repeat-y', 'repeat' ) ) )
      $repeat = 'repeat';
    $repeat = " background-repeat: $repeat;";

    $position = get_theme_mod( 'background_position_x', 'left' );
    if ( ! in_array( $position, array( 'center', 'right', 'left' ) ) )
      $position = 'left';
    $position = " background-position: top $position;";

    $attachment = get_theme_mod( 'background_attachment', 'scroll' );
    if ( ! in_array( $attachment, array( 'fixed', 'scroll' ) ) )
      $attachment = 'scroll';
    $attachment = " background-attachment: $attachment;";

    $style .= $image . $repeat . $position . $attachment;
  }

  $styles = '<style>';
  $styles .= '.login #nav a, .login #backtoblog a, a, a.active, a:hover, a.hover, a.visited, a:visited, a.link, a:link{color: ' . $link_color;
  $styles .= 'body.login{' . trim( $style ) . 'overflow-x: hidden;}';
  $styles .= '.login #nav, .login #backtoblog{text-shadow: none; text-shadow: 0; color: #fff;}';
  $styles .= 'body.login div#login h1 a {';
  $styles .= 'background-image: url("' . shoestrap_login_logo() . '");';
  $styles .= 'background-size: contain;';
  $styles .= 'padding-bottom: 30px;';
  
  if ( get_theme_mod( 'shoestrap_logo' ) == "" ) {
    $styles .= 'overflow:visible;';
    $styles .= 'text-indent: 0px;';
    $styles .= 'padding-top: 30px;';
    $styles .= 'width:auto;';
    $styles .= 'height:auto;';
    $styles .= 'text-decoration:none;';
  }
  $styles .= '}';
  
  $styles .= '#login {';
  $styles .= 'padding: 20px;';
  $styles .= '-webkit-border-radius: 0px 0px 4px 4px;';
  $styles .= 'border-radius: 0px 0px 4px 4px;';
  $styles .= '}';
  
  $styles .= '.login form{';
  $styles .= 'margin-left: 0;';
  $styles .= '}';
  
  $styles .= '#login h1{';
  $styles .= 'margin-left: -9999px;';
  $styles .= 'padding: 20px 9999px;';
  $styles .= 'background: ' . $header_bg_color . ';';
  $styles .= 'margin-top: -20px;';
  $styles .= 'margin-bottom: 50px;';
  $styles .= '}';
  
  $styles .= '#wp-submit {';
  $styles .= 'font-weight: normal;';
  $styles .= 'display: inline-block;';
  $styles .= '*display: inline;';
  $styles .= 'padding: 4px 14px;';
  $styles .= 'margin-bottom: 0;';
  $styles .= '*margin-left: .3em;';
  $styles .= 'font-size: 14px;';
  $styles .= 'line-height: 20px;';
  $styles .= '*line-height: 20px;';
  $styles .= 'color: #333333;';
  $styles .= 'text-align: center;';
  $styles .= 'text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);';
  $styles .= 'vertical-align: middle;';
  $styles .= 'cursor: pointer;';
  $styles .= 'background-color: #f5f5f5;';
  $styles .= '*background-color: #e6e6e6;';
  $styles .= 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));';
  $styles .= 'background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);';
  $styles .= 'background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);';
  $styles .= 'background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);';
  $styles .= 'background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);';
  $styles .= 'background-repeat: repeat-x;';
  $styles .= 'border: 1px solid #bbbbbb;';
  $styles .= '*border: 0;';
  $styles .= 'border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);';
  $styles .= 'border-color: #e6e6e6 #e6e6e6 #bfbfbf;';
  $styles .= 'border-bottom-color: #a2a2a2;';
  $styles .= '-webkit-border-radius: 4px;';
  $styles .= '-moz-border-radius: 4px;';
  $styles .= 'border-radius: 4px;';
  $styles .= 'filter: progid:dximagetransform.microsoft.gradient(startColorstr="#ffffffff", endColorstr="#ffe6e6e6", GradientType=0);';
  $styles .= 'filter: progid:dximagetransform.microsoft.gradient(enabled=false);';
  $styles .= '*zoom: 1;';
  $styles .= '-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);';
  $styles .= '-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);';
  $styles .= 'box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);';
  $styles .= '}';
  
  $styles .= '#wp-submit:hover, #wp-submit:active, #wp-submit.active, #wp-submit.disabled, #wp-submit[disabled] {';
  $styles .= 'color: #333333;';
  $styles .= 'background-color: #e6e6e6;';
  $styles .= '*background-color: #d9d9d9;';
  $styles .= '}';
  
  $styles .= '#wp-submit:active, #wp-submit.active {';
  $styles .= 'background-color: #cccccc \9;';
  $styles .= '}';
  
  $styles .= '#wp-submit:first-child {';
  $styles .= '*margin-left: 0;';
  $styles .= '}';
  
  $styles .= '#wp-submit:hover {';
  $styles .= 'color: #333333;';
  $styles .= 'text-decoration: none;';
  $styles .= 'background-color: #e6e6e6;';
  $styles .= '*background-color: #d9d9d9;';
  $styles .= 'background-position: 0 -15px;';
  $styles .= '-webkit-transition: background-position 0.1s linear;';
  $styles .= '-moz-transition: background-position 0.1s linear;';
  $styles .= '-o-transition: background-position 0.1s linear;';
  $styles .= 'transition: background-position 0.1s linear;';
  $styles .= '}';
  
  $styles .= '#wp-submit:focus {';
  $styles .= 'outline: thin dotted #333;';
  $styles .= 'outline: 5px auto -webkit-focus-ring-color;';
  $styles .= 'outline-offset: -2px;';
  $styles .= '}';
  
  $styles .= '#wp-submit.active, #wp-submit:active {';
  $styles .= 'background-color: #e6e6e6;';
  $styles .= 'background-color: #d9d9d9 \9;';
  $styles .= 'background-image: none;';
  $styles .= 'outline: 0;';
  $styles .= '-webkit-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);';
  $styles .= '-moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);';
  $styles .= 'box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);';
  $styles .= '}';
  
  $styles .= '#wp-submit.disabled, #wp-submit[disabled] {';
  $styles .= 'cursor: default;';
  $styles .= 'background-color: #e6e6e6;';
  $styles .= 'background-image: none;';
  $styles .= 'opacity: 0.65;';
  $styles .= 'filter: alpha(opacity=65);';
  $styles .= '-webkit-box-shadow: none;';
  $styles .= '-moz-box-shadow: none;';
  $styles .= 'box-shadow: none;';
  $styles .= '}';
  
  // Make sure colors are properly formatted
  $btn_color = '#' . str_replace( '#', '', $btn_color );
    
  // if no color has been selected, set to #0066cc. This prevents errors with the php-less compiler.
  if ( strlen( $btn_color ) < 3 ) {
    $btn_color = '#0066cc';
  }
  if ( get_theme_mod( 'shoestrap_flat_buttons' ) == 1 ) {
    $btnColorHighlight = $btn_color;
  } else {
    $btnColorHighlight = shoestrap_adjust_brightness( $btn_color, -63 );
  }

  if ( shoestrap_get_brightness( $btn_color ) <= 160) {
    $textColor = '#ffffff';
  } else {
    $textColor = '#333333';
  }

  $startColor = $btn_color;
  $endColor   = $btnColorHighlight;

  $styles .= '#wp-submit.button-primary{';
  $styles .= 'padding: 4px 15px 10px 15px;';
  $styles .= 'color: ' . $textColor . ';';
  $styles .= 'background-color: ' . shoestrap_mix_colors( $startColor, $endColor, 60 ) . ';';
  $styles .= 'background-image: -moz-linear-gradient(top, ' . $startColor . ', ' . $endColor . ');';
  $styles .= 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(' . $startColor . '), to(' . $endColor . '));';
  $styles .= 'background-image: -webkit-linear-gradient(top, ' . $startColor . ', ' . $endColor . ');';
  $styles .= 'background-image: -o-linear-gradient(top, ' . $startColor . ', ' . $endColor . ');';
  $styles .= 'background-image: linear-gradient(to bottom, ' . $startColor . ', ' . $endColor . ');';
  $styles .= 'background-repeat: repeat-x;';
  $styles .= '*background-color: ' . $endColor . ';}';
  $styles .= '.btn:hover, .btn-primary:hover, .btn-primary:active, .btn::active, .btn-primary.active .btn.active, .btn-primary.disabled, .btn.disabled, .btn-primary[disabled] .btn[disabled] {';
  $styles .= 'color: ' . $textColor . ';';
  $styles .= 'background-color: ' . $endColor . ';';
  $styles .= '*background-color: ' . shoestrap_adjust_brightness( $endColor, -12 ) . ';}';
  $styles .= '</style>';

  return $styles;
}

/*
 * Set cache for 24 hours
 */
function shoestrap_login_scripts_cache() {
  $data = get_transient( 'shoestrap_login_scripts' );
  if ( $data === false ) {
    $data = shoestrap_login_scripts();
    set_transient( 'shoestrap_login_scripts', $data, 3600 * 24 );
  }
  echo $data;
}
add_action( 'login_enqueue_scripts', 'shoestrap_login_scripts_cache' );

/*
 * Reset cache when in customizer
 */
function shoestrap_login_scripts_cache_reset() {
  delete_transient( 'shoestrap_login_scripts' );
  shoestrap_login_scripts_cache();
}
add_action( 'customize_preview_init', 'shoestrap_login_scripts_cache_reset' );

/*
 * Alters the link of the login screen logo
 */
function shoestrap_login_url( $url ) {
    return get_bloginfo( 'url' );
}
add_filter( 'login_headerurl', 'shoestrap_login_url' );

/*
 * Alters the title of the link in the login screen logo
 */
function shoestrap_title_attr() {
	return get_bloginfo('name');
}
add_filter('login_headertitle', 'shoestrap_title_attr');
