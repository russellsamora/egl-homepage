<?php

/**
 * list of params that are allowed to be stored in the DB (just to be on the safe side.
 */
function gabeni_params()
{
	return Array(
		'backup_frequency',
		'claims_has_account',
		'gabeni_customer_id',
		'gabeni_key',
		'gabeni_site_id',
		'gabeni_action_status',
		'has_account',
		'last_backup',
		'last_backup_size_in_bytes',
		'last_response',
		'last_store',
		'next_backup',
		'rotate',
		'show_footer_link',
		);
}

function gabeni_page_url()
{
	return admin_url("options-general.php?page=gabeni-settings");
}

function gabeni_esc($in) { return mysql_real_escape_string($in); }

function gabeni_table_prefix()
{
	$s = gabeni_parse_settings();
	$table_prefix = $s['table_prefix'];
	return $table_prefix;
}

function gabeni_temp()
{
	return ABSPATH . 'wp-content/plugins/gabeni/tmp';
}

function gabeni_exec($cmd)
{
	gabeni_log("Executing: ".$cmd);
	$out = shell_exec($cmd);
	if(!empty($out)) gabeni_log("Output: ".$out);
}

function gabeni_logdir()
{
	//return null;
	return gabeni_temp();
}

function gabeni_logfile()
{
	//return preg_replace(Array("\01^https?://\01","\01/+$\01","\01/+\01"), Array("","","-"), get_var("siteurl"))."-gabeni.log";
	return "gabeni.log";
}

/**
 * Write something to the log...
 */
function gabeni_log($string)
{
	$origin = array_pop(debug_backtrace());
	$origin_text = $origin["file"].":".$origin["line"];
	$line = "[".date("Y-m-d H:i:s")."] {}: {$string}\n";

	$log_dir = gabeni_logdir();
	if(!empty($log_dir))
	{
		$log_file = gabeni_logfile();
		$log_location = $log_dir."/".$log_file;
		error_log($line, 3, $log_location);
	}
	else
	{
		error_log($line);
	}
}

function gabeni_logrotate()
{
	$log_dir = gabeni_logdir();
	if(!empty($log_dir))
	{
		$log_file = gabeni_logfile();
		$gz_file = $log_file.".gz";

		if(is_file($log_dir."/".$gz_file)) unlink($gz_file);
		$cwd = getcwd();
		chdir($log_dir);
		gabeni_exec("gzip ".escapeshellarg($log_file));
		chdir($cwd);
	}
}

/**
 * Perform backup
 */
function gabeni_backup($backup_name="")
{
	global $wpdb;

	if(!gabeni_has_account())
	{
		gabeni_log("Not authenticated");
		return false;
	}

	if(!gabeni_is_paying() && strncmp($backup_name, "MANUAL_", 7))
	{
		gabeni_log("Automatic backup ignored");
		return false;
	}

	gabeni_log('starting backup!');
	$settings = gabeni_parse_settings();
	$pre_name = $backup_name.date("YmdHis").uniqid("_");
	
	$tmp_dir = gabeni_temp();
	chdir($tmp_dir);

	gabeni_log("exporting db");
	$sql_gz = gabeni_dump_db($pre_name.".sql.gz");

	gabeni_log("exporting files");
	$files_tgz = gabeni_backup_files($pre_name."_files.tgz");
	
	$final_file = "{$pre_name}.tgz";
	
	gabeni_log("packing");
	$cmd = "tar czvf ".escapeshellarg($final_file)." ".escapeshellarg($sql_gz)." ".escapeshellarg($files_tgz);
	gabeni_exec($cmd);
	
	gabeni_log("removing temporary files");
	unlink($sql_gz);
	unlink($files_tgz);
	
	$size = filesize($final_file);
	gabeni_log("backup file size: ".$size);
	
	$now = time();
	$status = gabeni_store($final_file,$now);
	gabeni_log("gabeni_store status: ".($status?"true":"false"));

	if($status)
	{
		$table_prefix = gabeni_table_prefix();
		gabeni_set_param('last_backup',$now);
		gabeni_set_param('last_backup_size_in_bytes',$size);
		$location = gabeni_get_param("last_store");
		$sql = "INSERT INTO `{$table_prefix}gabeni_backups` SET `ts`='{$now}',`location`='{$location}',`size`='{$size}'";
		gabeni_log($sql);
		$wpdb->query($sql);

		gabeni_rotate();
	}

	gabeni_log("removing local backup file");
	unlink($final_file);

	$GLOBALS["_GABENI_QUOTA"] = null; // reset quota info so it will be refetched

	return $status;
}

function gabeni_get_all_info()
{
	global $wpdb;
	global $params;
	$table_prefix = gabeni_table_prefix();
	$info = $wpdb->get_results("SELECT `param`,`val` FROM `{$table_prefix}gabeni`");
	$params = array();
	foreach($info as $i)
	{
		$params[$i->param] = $i->val;
	}

	// apply defaults
	if(empty($params["rotate"])) $params["rotate"] = 1;
	if(empty($params["backup_frequency"])) $params["backup_frequency"] = "daily";

	$params["next_daily"] = wp_next_scheduled('gabeni_daily_event');
	$params["next_hourly"] = wp_next_scheduled('gabeni_hourly_event');
	$params["doing_cron"] = defined("DOING_CRON")?1:0;

	return $params;
}

/**
 * Prepare db dump for backup
 */
function gabeni_dump_db($dump_name)
{
	$s = gabeni_parse_settings();
	$sql_gz = gabeni_temp()."/".$dump_name;
	$cmd = "mysqldump --add-drop-table --allow-keywords --quote-names -h ".escapeshellarg($s['DB_HOST'])." -u ".escapeshellarg($s['DB_USER'])." ".escapeshellarg("-p{$s['DB_PASSWORD']}")." ".escapeshellarg($s['DB_NAME'])." | gzip -c > ".escapeshellarg($sql_gz);
	gabeni_exec($cmd);

	return $dump_name;
}

/**
 * Prepare files for backup
 */
function gabeni_backup_files($name)
{
	$cwd = getcwd();
	chdir(ABSPATH);

	// I am only gonig to backup the themes
	$source = escapeshellarg("wp-content");
	$destination = escapeshellarg(gabeni_temp().'/'.$name);
	$exclude = !strncmp(ABSPATH, gabeni_temp(), strlen(ABSPATH)) ? substr(gabeni_temp(),strlen(ABSPATH)) : gabeni_temp();
	$exclude = escapeshellarg($exclude."/*");

	$cmd = "tar czvf {$destination} --exclude={$exclude} {$source}";
	gabeni_exec($cmd);

	chdir($cwd);

	return $name;
}

function gabeni_parse_settings()
{
	require_once( ABSPATH . 'wp-config.php' );
	global $table_prefix;
	if(DB_NAME!='' && DB_USER!='' && DB_PASSWORD!='' && DB_HOST!='')
	{
		// we have all we need!
		return Array(
			'DB_NAME'=>DB_NAME,
			'DB_USER'=>DB_USER,
			'DB_PASSWORD'=>DB_PASSWORD,
			'DB_HOST'=>DB_HOST,
			'table_prefix'=>$table_prefix
			);
	} else {
		return false;
	}
}

function gabeni_get_backups_list()
{
	global $wpdb;
	$table_prefix = gabeni_table_prefix();
	return $wpdb->get_results("SELECT * FROM `{$table_prefix}gabeni_backups` ORDER BY `ts` DESC");
}

function gabeni_get_backup_by_id($backup_id)
{
	global $wpdb;
	$table_prefix = gabeni_table_prefix();
	$sql = "SELECT * FROM `{$table_prefix}gabeni_backups` where `id`=".$backup_id;
	$results = $wpdb->get_results($sql);
	return !empty($results) ? $results[0] : null;
}

function gabeni_delete_backup_by_id($backup_id)
{
	global $wpdb;

	$backup = gabeni_get_backup_by_id($backup_id);
	if(empty($backup) || empty($backup->location)) return false;

	$GLOBALS["_GABENI_QUOTA"] = null;

	if(gabeni_delete($backup->location))
	{
		$table_prefix = gabeni_table_prefix();
		$sql = "DELETE FROM `{$table_prefix}gabeni_backups` where `id`=".$backup_id;
		$wpdb->query($sql);
		gabeni_log("Backup file {$backup->location} deleted");
		return true;
	}
	else
	{
		gabeni_log("Delete failed");
		return false;
	}
}

function gabeni_delete_backups_by_ids($backup_ids)
{
	global $wpdb;

	$files = Array();
	foreach($backup_ids as $backup_id)
	{
		$backup = gabeni_get_backup_by_id($backup_id);
		if(empty($backup) || empty($backup->location)) continue;
		$files[] = $backup->location;
	}

	if(empty($files))
	{
		gabeni_log("Nothing to delete");
		return false;
	}

	$GLOBALS["_GABENI_QUOTA"] = null;

	if(gabeni_delete($files))
	{
		$table_prefix = gabeni_table_prefix();
		$sql = "DELETE FROM `{$table_prefix}gabeni_backups` where `id` IN(".implode(",",$backup_ids).")";
		$wpdb->query($sql);
		gabeni_log("Backup file {$backup->location} deleted");
		return true;
	}
	else
	{
		gabeni_log("Delete failed");
		return false;
	}
}

function gabeni_get_param($param)
{
	global $wpdb;

	$params = gabeni_params();
	if(!in_array($param,$params)) return false;

	$s = gabeni_parse_settings();
	$table_prefix = $s['table_prefix'];

	return $wpdb->get_var( "SELECT `val` FROM `{$table_prefix}gabeni` WHERE `param` = '{$param}'");
}

function gabeni_set_param($param,$val)
{
	global $wpdb;
	$params = gabeni_params();
	$s = gabeni_parse_settings();
	$table_prefix = $s['table_prefix'];
	$val = gabeni_esc($val);
	$sql = "INSERT INTO `{$table_prefix}gabeni` SET `param` = '{$param}', `val` = '{$val}' ON DUPLICATE KEY UPDATE `val` = '{$val}'";
	//gabeni_log($sql);
	
	if(in_array($param,$params)) 
	{
		$wpdb->query("INSERT INTO `{$table_prefix}gabeni` SET `param` = '{$param}', `val` = '{$val}' ON DUPLICATE KEY UPDATE `val` = '{$val}'");
	} else {
		gabeni_log("Param not allowed!");
	}
	return true;
}

function gabeni_create_tables()
{
	global $wpdb;
	$s = gabeni_parse_settings();
	$table_prefix = $s['table_prefix'];
	
	// create database table;
	$wpdb->query("CREATE TABLE IF NOT EXISTS `{$table_prefix}gabeni`(
		`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT, 
		`param` varchar(64) NOT NULL DEFAULT '', 
		`val` longtext NOT NULL, 
		PRIMARY KEY (`id`), 
		UNIQUE KEY `option_name` (`param`)
		) 
		ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8");
	
	$wpdb->query("CREATE TABLE `{$table_prefix}gabeni_backups`(
		`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT, 
		`ts` varchar(10) NOT NULL default '', 
		`location` varchar(255) NOT NULL default '',
		`size` bigint(20) unsigned not null default 0, 
		PRIMARY KEY (`id`)) 
		ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8");
}

function gabeni_drop_tables()
{
	global $wpdb;
	$s = gabeni_parse_settings();
	$table_prefix = $s['table_prefix'];

	$next_daily = wp_next_scheduled('gabeni_daily_event');
	$next_hourly = wp_next_scheduled('gabeni_hourly_event');

	$wpdb->query("DROP TABLE IF EXISTS `{$table_prefix}gabeni`");
	$wpdb->query("DROP TABLE IF EXISTS `{$table_prefix}gabeni_backups`");
}

function gabeni_set_next_backup()
{
	$info = gabeni_get_all_info();

	switch($info["backup_frequency"])
	{
		case "monthly":
			$next_backup = date("Y-m-d", strtotime("+1 month"));
			break;
		case "weekly":
			$next_backup = date("Y-m-d", strtotime("+1 week"));
			break;
		case "daily":
			$next_backup = date("Y-m-d", strtotime("+1 day"));
			break;
		case "hourly":
			$next_backup = date("Y-m-d H:00", time()+3600);
			break;
		default:
			return;
	}

	gabeni_set_param('next_backup', $next_backup);
}

function gabeni_schedule_hooks()
{
	gabeni_unschedule_hooks();

	$next_daily = strtotime(date("Y-m-d 01:00:00", time()+86400));
	$status = wp_schedule_event($next_daily, 'daily', 'gabeni_daily_event');
	gabeni_log('gabeni_daily hook status: '.var_export($status,1));

	$next_hourly = strtotime(date("Y-m-d H:00:00", time()+3600));
	$status = wp_schedule_event($next_hourly, 'hourly', 'gabeni_hourly_event');
	gabeni_log('gabeni_hourly hook status: '.var_export($status,1));
}

function gabeni_unschedule_hooks()
{
	if($next_daily = wp_next_scheduled('gabeni_daily_event'))
		wp_unschedule_event($next_daily, 'daily');

	if($next_hourly = wp_next_scheduled('gabeni_hourly_event'))
		wp_unschedule_event($next_hourly, 'hourly');
}

function gabeni_download($backup_id)
{
	$backup = gabeni_get_backup_by_id($backup_id);
	if(!empty($backup) && !empty($backup->location))
	{
		$tmp_file = gabeni_get_backup_file($backup->location);
		if(!empty($tmp_file))
		{
			header("Pragma: no-cache");
			header("Cache-Control: no-cache");
			header("Content-Type: application/octet-stream"); //.mime_content_type($tmp_file));
			header("Content-Disposition: attachment; filename=".basename($backup->location));
			header("Accept-Ranges: bytes");
			header("Content-Length: ".filesize($tmp_file));
			readfile($tmp_file);
			unlink($tmp_file);
			//header("Location: ".$backup->location);
			exit;
		}
	}
	return false;
}

function gabeni_restore($backup_id)
{
	$backup = gabeni_get_backup_by_id($backup_id);
	if(!empty($backup) && !empty($backup->location))
	{
		if(gabeni_is_paying()) gabeni_backup("AUTOMATED_RESTORE_POINT_");

		$s = gabeni_parse_settings();
		$table_prefix = gabeni_table_prefix();

		$tmp_file = gabeni_get_backup_file($backup->location);
		if(!empty($tmp_file))
		{
			// create temp dir
			$tmp_dir = gabeni_temp().'/'.uniqid();
			mkdir($tmp_dir);
			chdir($tmp_dir);

			// extract
			$cmd = "tar xzvf ".escapeshellarg($tmp_file);
			gabeni_exec($cmd);

			$sql_gz = glob("*.sql.gz");
			if(!empty($sql_gz))
			{
				// unpack sql file
				$sql_gz = array_shift($sql_gz);
				$cmd = "gunzip ".escapeshellarg($sql_gz);
				gabeni_exec($cmd);

				$sql_file = substr($sql_gz,0,-3);

				// run sql file
				$cmd = "mysql -h ".escapeshellarg($s['DB_HOST'])." -u ".escapeshellarg($s['DB_USER'])." ".escapeshellarg("-p{$s['DB_PASSWORD']}")." ".escapeshellarg($s['DB_NAME'])." < ".escapeshellarg($sql_file);
				gabeni_exec($cmd);

				unlink($sql_file);
			}
			else
			{
				gabeni_log("WARNING: sql file not found in backup!");
			}

			$files_tgz = glob("*_files.tgz");
			if(!empty($files_tgz))
			{
				chdir(ABSPATH);
				$files_tgz = $tmp_dir."/".array_shift($files_tgz);
				$cmd = "tar xzvf ".escapeshellarg($files_tgz);
				gabeni_exec($cmd);

				unlink($files_tgz);
			}
			else
			{
				gabeni_log("WARNING: files tgz not found in backup!");
			}

			rmdir($tmp_dir);
			unlink($tmp_file);

			return true;
		}
	}

	return false;
}

function gabeni_rotate()
{
	$info = gabeni_get_all_info();
	$rotate = max(1, intval($info["rotate"]));

	// make sure we see real picture...
	gabeni_load_history();

	$delete = Array();
	$list = gabeni_get_backups_list();
	$i=0;
	foreach($list as $backup)
	{
		if(preg_match("\01/(MANUAL|AUTOMATED_RESTORE_POINT)_\01", $backup->location)) continue;
		if(++$i>$rotate) $delete[] = $backup->id;
	}

	if(!empty($delete)) gabeni_delete_backups_by_ids($delete);

	$GLOBALS["_GABENI_QUOTA"] = null;
	gabeni_load_history();
}

function gabeni_load_history()
{
	global $wpdb;
	$table_prefix = gabeni_table_prefix();
	$wpdb->query("TRUNCATE TABLE `{$table_prefix}gabeni_backups`");

	// reset last known backup info
	gabeni_set_param('last_backup','');
	gabeni_set_param('last_backup_size_in_bytes','');

	$history = gabeni_get_backup_history();
	if(!empty($history))
	{
		$last_backup = null;
		foreach($history as $row)
		{
			$wpdb->query("INSERT INTO `{$table_prefix}gabeni_backups` SET `ts`='".gabeni_esc($row["ts"])."',`location`='".gabeni_esc($row["location"])."',`size`='".gabeni_esc($row["size"])."'");
			if($last_backup===null || strtotime($row["ts"])>strtotime($last_backup["ts"])) $last_backup = $row;
		}
		gabeni_set_param('last_backup',$last_backup["ts"]);
		gabeni_set_param('last_backup_size_in_bytes',$last_backup["size"]);
	}
}

function gabeni_has_account()
{
	$info = gabeni_get_all_info();
	return !empty($info["has_account"]) && !empty($info["gabeni_customer_id"]) && !empty($info["gabeni_key"]);
}

function gabeni_is_paying()
{
	$quota = gabeni_get_quota();
	return $quota["paying"];
}

function gabeni_get_quota()
{
	global $_GABENI_QUOTA;
	if(empty($_GABENI_QUOTA))
	{
		if(!gabeni_has_account()) return Array("total"=>0,"used"=>0,"free"=>0,"paying"=>false);

		$_GABENI_QUOTA = gabeni_quota();
		$_GABENI_QUOTA["paying"] = $_GABENI_QUOTA["total"] > 100*1024*1024;
		gabeni_log("Got quota information: Total: {$_GABENI_QUOTA["total"]} Used: {$_GABENI_QUOTA["used"]} Free: {$_GABENI_QUOTA["free"]} Paying: ".($_GABENI_QUOTA["paying"]?"Yes":"No"));
	}

	return $_GABENI_QUOTA;
}

function gabeni_get_credits_html()
{
	$icon = plugins_url("images/icon.png", __FILE__);
	return <<<HTML
<div style="margin:5px;text-align:center;">Proudly backed up by <strong>Gab<img src="{$icon}" alt="ё" title="" style="vertical-align:to;height:1em;margin:0 -1px;">ni</strong> - <a href="http://www.gabeni.com" target="_blank">WordPress backup plugin</a></div>
HTML;
}

?>
