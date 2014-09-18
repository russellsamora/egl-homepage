=== Plugin Name ===
Contributors: casualgenius, lontongcorp, selnomeria
Donate link: http://www.lontongcorp.com/2012/03/16/wp-subdomains/
Tags: subdomains, categories, pages, themes 
Requires at least: 3.0
Tested up to: 3.5.1
Stable tag: 0.8

Setup your main categories, pages, and authors as subdomains and give them custom themes without or inside multisite.

== Description ==

An updated modification of "WP Subdomains" 0.6.9 to make subdomains for Categories, Pages and Authors without or inside Multisite.
The original description is at <a href="http://wordpress.org/extend/plugins/wordpress-subdomains/">http://wordpress.org/extend/plugins/wordpress-subdomains/</a>, but you MUST also read <strong>INSTRUCTIONS</strong> sections.

Works perfectly with W3 Total Cache.

= New features =
* Updating admin menu layouts
* Page Structures
* Adding Custom Theme options in page editor widget
* Post Canonical URL to avoid duplicate content
* Support localization


== Installation ==

* Download `wp-subdomains-revisited.zip` manually or automatically `Plugins/Add New`
* Unzip
* Upload `wp-subdomains-revisited` directory to your `/wp-content/plugins` directory
* Activate the plugin
* Configure the options from the `WP Subdomains/Settings` page
* Configure each category from the Category Settings `Posts/Category` page
* Configure each pages from the Pages Editor `Pages/your-page-name/Edit`



== Frequently Asked Questions ==

See the original plugin Faq: http://wordpress.org/extend/plugins/wordpress-subdomains/

= How to add subdomains =

Please go to your domain manager or contact your provider

= Do I have to add each subdomain manually =

You can add wildcard (A or CNAME) *.domain.com to the same installations path 

= Is this plugins works with cache =

Sure things. Also I have recommend it with W3 Total Cache by setting one page as "cdn" or anypage.domain.com, and make as Generic Mirror CDN and add as cdn for image, css or javascript without any technical difficulties anymore


== Screenshots ==

1. WP Subdomains -&gt; Settings
2. Category Interface
3. Pages Editor widget interface


== Changelog ==

= 0.8 = 

* Updating WP Query
* Fix database table creations for new installation
* Updating layouts
* Adding menu icon
* Page Structures
* Adding Custom Theme options in page editor widget
* Post Canonical URL to avoid duplicate content
* Support localization
* Changing revision numbers

= 0.7.0 = 

* Updating to work with Wordpress 3.3+

= 0.6.9 = 

see the original changelog at: http://wordpress.org/extend/plugins/wordpress-subdomains/)



== Instructions ==

Read the original instructions at http://wordpress.org/extend/plugins/wordpress-subdomains/, but read these instructions as well:

After activating the plugin,  and you can set your desired settings in wordpress left sidebar menu - WP Subdomains.

* While the plugin is activated for pages, and you check "Make the Page as Subdomain" while you publish e a post, then the published pages link will be "pagename.site.com" in the whole website link structure (and not "site.com/pageName"). but the page can also be accessed at "site.com/pagename".
but it is essential, that you also create a subdomain in your hosting control panel (as it is described at http://wordpress.org/extend/plugins/wordpress-subdomains/, but if you cant setup DNS records as described there, then see the manual instruction of subdomain creation in the end of this instruction).
* The page link(slug) is created from title. So, if you want to give the page other link rather than its title, then after publishing you should enter "All pages" and "quick edit" the slug (this is the only way for now). 
* Advice: When you delete the page, delete it from "Trash" too.
* Don't "Add new page" two times parallely. At first, publish one page, then add another page. otherwise the simultaneously opened two page links will blend with each other.
* If you publish many pages and want to show only several ones in the navigation menu, then use "Exclude Pages from nagivation" plugin, and uncheck the special "include box" while you publish a page.


== Manual SUBDOMAIN creation in your Hosting ==

Create the subdomain with the exact characters, as the link(example: subdomain name should be "zeze" if you are making "zeze.site.com")
then in the FTP (in public_html, there will be created the "homer-gre" folder, where you should upload an index.php file with the content:




a) if you create a page :

<code>

<?php
$_GET['pagename']=basename(getcwd());
/**or $_GET['page_id']=x; */
define('WP_USE_THEMES', true);
require('../wp-blog-header.php'); ?>

</code>
b) if you want for a category:

<code>

<?php
$foldername=basename(getcwd());
$SubdomainName=basename(getcwd()) . '.';
$HomepageLink= 'http://' . $_SERVER['HTTP_HOST'] . '/';
$HomepageLinkWithoutSubdomainName=str_replace($SubdomainName, '', $HomepageLink);
$HomepageLinkFULL=$HomepageLinkWithoutSubdomainName . 'category/' . $foldername;
readfile($HomepageLinkFULL); ?>



</code>

C) if you want for an author:

<code>

<?php
$foldername=basename(getcwd());
$SubdomainName=basename(getcwd()) . '.';
$HomepageLink= 'http://' . $_SERVER['HTTP_HOST'] . '/';
$HomepageLinkWithoutSubdomainName=str_replace($SubdomainName, '', $HomepageLink);
$HomepageLinkFULL=$HomepageLinkWithoutSubdomainName . 'author/' . $foldername;
readfile($HomepageLinkFULL); ?>

</code>

if you make any corrections, mail me at oceanesa@Y@H00[D0T]COM and i will update the plugin.


= Credits =
* <a href="http://www.lontongcorp.com">Erick Tampubolon</a> of <a href="http://www.igits.co.id">IGITS</a>.
* <a href="http://profiles.wordpress.org/selnomeria">selnomeria</a>.
* <a href="http://casualgenius.com">Alex Stansfield</a> of <a href="http://casualgenius.com">Casual Genius</a>.
* <a href="http://demp.se/y/2008/04/11/category-subdomains-plugin-for-wordpress-25/">Adam Dempsey</a>.
* <a href="http://blog.youontop.com/wordpress/wordpress-category-as-subdomain-plugin-41.html">Gilad Gafni</a>.
* Based on the <a href="http://www.biggnuts.com/wordpress-subdomains-plugin/">Subster Rejunevation</a> wordpress plugin by <a href="http://www.biggnuts.com/">Dax Herrera</a>.