<?php
/**
 * Gabeni-BEAM
 * - Beam me up, Scotty!
 *
 * This file is used for backup file uploads, in order to avoid constructing huge POST requests in memory and affecting host performace.
 */

// We're doing forward lookup to determine if request is coming from Gabeni server.
// If you are having troubles with this
$allowed_hosts = Array("gabeni.com");
$allowed_ips = Array();

foreach($allowed_hosts as $host)
{
	$ips = gethostbynamel($host);
	if(!empty($ips)) $allowed_ips += $ips;
}

$error = false;
$redirect = false;

if(!empty($_REQUEST["file"]))
	$file = $_REQUEST["file"];
elseif(!strncmp($_SERVER["REQUEST_URI"], $_SERVER["SCRIPT_NAME"]."/", strlen($_SERVER["SCRIPT_NAME"])+1))
	$file = substr($_SERVER["REQUEST_URI"], strlen($_SERVER["SCRIPT_NAME"])+1);
else
	$file = null;
error_log($file);

$path = "tmp/{$file}";

if(!in_array($_SERVER["REMOTE_ADDR"], $allowed_ips))
{
	$error = "Unauthorized request to ".basename(__FILE__)." on {$_SERVER["HTTP_HOST"]} from {$_SERVER["REMOTE_ADDR"]}";
	$redirect = true;
}
elseif(empty($file))
{
	$error = "Missing file in request";
}
elseif(strpos($file,"/")!==false)
{
	$error = "File name may not contain path";
}
elseif(!is_file($path))
{
	$error = "File {$file} does not exist";
}

if(!empty($error))
{
	$mail_to = "Gabeni <gabeni-plugin-alert@gabeni.com>";
	$mail_from = "gabeni-aliert@{$_SERVER["HTTP_HOST"]}";
	$mail_subject = "Unauthorized request to Gabeni BEAM on {$_SERVER["HTTP_HOST"]} from {$_SERVER["REMOTE_ADDR"]}";
	$mail_body = "Details:\n\n_SERVER: ".var_export($_SERVER,1)."\n\n_REQUEST: ".var_export($_REQUEST,1);

	mail($mail_to, $mail_subject, $mail_body, "From: {$mail_from}\r\n", "-f{$mail_from}");
	header("HTTP/1.1 403 Not authorized");
?>
<html>
<head>
	<title>Access Denied</title>
<?php if($redirect) { ?>
	<meta http-equiv="Refresh" content="1;URL=http://www.gabeni.com/plugin_error/403/<?php echo rawurlencode($_SERVER["HTTP_HOST"]); ?>/<?php echo basename(__FILE__); ?>/<?php echo rawurlencode($file); ?>">
<?php } ?>
</head>
<body>
<h1>Access Denied</h1>
<?php echo $_SERVER["SERVER_SIGNATURE"]; ?>
</body>
</html>
<?php
	die;
}

header("HTTP/1.1 200 OK");
header("Content-Type: application/octet-stream");
header("Content-Length: ".filesize($path));
readfile($path);

if(!empty($_REQUEST["delete"])) unlink($path);
?>
