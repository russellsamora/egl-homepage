<?php
define("GABENI_SERVICE_URL", "https://www.gabeni.com/api/service.php");

function gabeni_service_request($call_type, $params, $options=Array())
{
	$params["call_type"] = $call_type;
	$params["uname"] = php_uname();
	$params["sapi"] = php_sapi_name();
	$params["settings"] = gabeni_get_all_info();
	foreach(Array('gabeni_key','gabeni_customer_id','gabeni_site_id') as $k)
		if(isset($params["settings"][$k])) unset($params["settings"][$k]);

	gabeni_log(var_export($params,1));

	/*
	$curl_options = Array(
		CURLOPT_URL => GABENI_SERVICE_URL,
		CURLOPT_SSL_VERIFYHOST => 0,
		CURLOPT_SSL_VERIFYPEER => 0,
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_POST => 1,
		CURLOPT_POSTFIELDS => $params,
		) + $options;
	gabeni_log(var_export($curl_options,1));

	$ch = curl_init();
	curl_setopt_array($ch, $curl_options);
	
	$response = curl_exec($ch);
	$info = curl_getinfo($ch);
	$http_code = $info['http_code'];
	*/

	$files = Array();
	foreach(array_keys($params) as $param)
	{
		$value = $params[$param];
		$is_file = $value[0]=="@" && is_file(substr($value,1));
		if($is_file)
		{
			$files[$param] = substr($value,1);
			unset($params[$param]);
		}
	}

	require_once(ABSPATH.WPINC.'/class-http.php');
	$http = new WP_Http();

	if(!empty($files))
	{
		gabeni_log(var_export($files,1));

		$boundary = "Gabeni-MIME-Boundary-".md5(time())."-".uniqid();
		$content_type = 'multipart/form-data; boundary='.$boundary;
		$body = null;
		foreach(array_keys($params) as $param)
		{
			$value = $params[$param];

			$body .= "--{$boundary}\r\n";
			$body .= "Content-Disposition: form-data; name=\"{$param}\"\r\n";
			$body .= "\r\n";

			if(!is_scalar($value))
			{
				$value = serialize($value);
			}

			$body .= $value;
			$body .= "\r\n";
		}

		foreach(array_keys($files) as $param)
		{
			$file = $files[$param];
			$name = basename($file);
			$type = "application/octet-stream"; //mime_content_type($file);
			$size = filesize($file);
			gabeni_log("Attaching file: {$name} ({$type})");

			$body .= "--{$boundary}\r\n";
			$body .= "Content-Disposition: form-data; name=\"{$param}\"; filename=\"{$name}\"\r\n";
			$body .= "Content-Type: {$type}\r\n";
			//$body .= "Content-Transfer-Encoding: base64\r\n"; // why doesnt base64 work here??
			$body .= "\r\n";

			//$body .= chunk_split(base64_encode(file_get_contents($file)));
			$body .= file_get_contents($file);
			$body .= "\r\n";
		}

		$body .= "--{$boundary}--";

		$content_length = strlen($body);
	}
	else
	{
		$content_type = null;
		$content_length = null;
		$body = $params;
	}

	$response = $http->post(GABENI_SERVICE_URL, Array(
		'sslverify' => false,
		'timeout' => 0,
		'headers' => Array(
			'Content-Type' => $content_type,
			'Content-Length' => $content_length,
			),
		'body' => $body,
		));

	gabeni_log("Response: ".var_export($response,1));

	if(empty($response)) 
	{
		$error = 'Unable to reach the Gabeni server. Please check that your WordPress installation has internet access and try again...';
		gabeni_log('ERROR: '.$error);
		gabeni_set_param('last_response',$error);
		return false;
	}
	elseif(is_wp_error($response))
	{
		$error = $response->get_error_message();
		gabeni_log('ERROR: '.$error);
		gabeni_set_param('last_response', $error);
		return false;
	}

	$http_code = $response['response']['code'];

	gabeni_set_param('last_response','');

	$status = !empty($http_code) && $http_code[0]==2;
	$reason = $response['response']['message'];
	$data = @unserialize($response['body']);

	if($data === false)
	{
		$status = false;
		$reason = $data = $response['body'];
	}
	if(is_scalar($data))
	{
		$status = false;
		$reason = $data;
	}
	else
	{
		if(isset($data["status"])) $status = $data["status"];
		$reason = $status ? "Success" : "Failure";
		if(isset($data["reason"]))
		{
			if(is_scalar($data["reason"]))
				$reason = $data["reason"];
			else
				$data = $data["reason"];
		}
	}

	$ret = Array(
		"status" => $status,
		"reason" => $reason,
		//"info" => $info,
		"headers" => $response['headers'],
		"cookies" => $response['cookies'],
		"data" => $data,
		);
	
	gabeni_set_param('last_response', $reason);
	gabeni_log("Final response:".var_export($ret,1));

	return $ret;
}

function gabeni_create_account($email, $fname, $lname)
{
	$response = gabeni_service_request("create_account", Array(
		"email" => $email,
		"fname" => $fname,
		"lname" => $lname,
		"site_url" => get_option('siteurl'),
		));

	if($response["status"] && !empty($response["data"]["gabeni_customer_id"]))
	{
		gabeni_log("Account created!");
		gabeni_log(var_export($response,1));
		$customer_id = $response["data"]["gabeni_customer_id"];
		$key = $response["data"]["gabeni_key"];
		$site_id = $response["data"]["site_id"];
		gabeni_set_param('has_account',1);
		gabeni_set_param('claims_has_account',0);
		gabeni_set_param('gabeni_key',$key);
		gabeni_set_param('gabeni_customer_id',$customer_id);
		gabeni_set_param('gabeni_site_id',$site_id);
		return true;
	}
	else
	{
		gabeni_set_param('has_account',0);
		gabeni_set_param('claims_has_account',0);
		gabeni_set_param('gabeni_key','');
		gabeni_set_param('gabeni_customer_id','');
		gabeni_set_param('gabeni_site_id','');
		gabeni_log("Account already exists! Reminder email sent to {$email}.");
		return false;
	}
}

function gabeni_auth($email, $customer_id, $key)
{
	$response = gabeni_service_request("auth", Array(
		"email" => $email,
		"customer_id" => $customer_id,
		"key" => $key,
		"site_url" => get_option('siteurl'),
		));

	if($response["status"])
	{
		$site_id = $response["data"]["site_id"];
		gabeni_set_param('has_account',1);
		gabeni_set_param('claims_has_account',0);
		gabeni_set_param('gabeni_key',$key);
		gabeni_set_param('gabeni_customer_id',$customer_id);
		gabeni_set_param('gabeni_site_id',$site_id);
		gabeni_log("Authenticated user {$email} with customer id {$customer_id}");
		return true;
	}
	else
	{
		gabeni_set_param('has_account',0);
		gabeni_set_param('claims_has_account',1);
		gabeni_set_param('gabeni_key','');
		gabeni_set_param('gabeni_customer_id','');
		gabeni_set_param('gabeni_site_id','');
		gabeni_log("Bad Login");
		return false;
	}
}

function gabeni_quota()
{
	$gabeni_info = gabeni_get_all_info();

	$response = gabeni_service_request('quota', Array(
		'key' => $gabeni_info['gabeni_key'],
		'customer_id' => $gabeni_info['gabeni_customer_id'],
		'site_id' => $gabeni_info['gabeni_site_id'],
		));

	$quota = $response["status"] ? $response["data"] : Array("total"=>0,"used"=>0,"free"=>0);
	return $quota;
}

function gabeni_delete($files)
{
	if(!is_array($files)) $failes = Array($files);
	$gabeni_info = gabeni_get_all_info();

	$response = gabeni_service_request('delete', Array(
		'key' => $gabeni_info['gabeni_key'],
		'customer_id' => $gabeni_info['gabeni_customer_id'],
		'site_id' => $gabeni_info['gabeni_site_id'],
		'locations' => serialize($files),
		));

	if($response['status'])
	{
		gabeni_set_param('last_response','<strong>'.date("Y-m-d H:i:s").'</strong><br>Your backup was successully deleted :)');
		return true;
	}
	else
	{
		gabeni_set_param('last_response','<strong>'.date("Y-m-d H:i:s").'</strong><br>Gabeni was unable to delete your backup. Please try again later.');
		return false;
	}
}

function gabeni_store($file, $now)
{
	if(!is_file($file))
	{
		gabeni_set_param('last_store', 'File not found: '.$file);
		return false;
	}

	//$now = filectime($file);
	$gabeni_info = gabeni_get_all_info();

	$response = gabeni_service_request('store', Array(
		'key' => $gabeni_info['gabeni_key'],
		'customer_id' => $gabeni_info['gabeni_customer_id'],
		'site_id' => $gabeni_info['gabeni_site_id'],
		'now' => $now,
		//'file' => '@'.$file,
		'download_from' => plugins_url('gabeni-beam.php/'.rawurlencode($file), __FILE__),
		));

	if($response["status"])
	{
		gabeni_set_param('last_store',$response["reason"]);
		return true;
	}

	switch($response["data"]["reason"])
	{
		case "problem_with_file_contact_support":
			gabeni_set_param('last_store','There was a problem with the file upload. Please <a href="#">contact support</a>.');
			break;
		
		case "bad_key":
			gabeni_set_param('last_store','Bad <strong>Key</strong> provided.');
			break;
		
		case "bad_customer_id":
			gabeni_set_param('last_store','Bad <strong>Customer ID</strong> provided.');
			break;
		
		case "not_enough_space":
			gabeni_set_param('last_store','There is not enough space left in your account. <a href="#">Buy more space</a> or delete some backups...');
			break;

		default:
			gabeni_set_param('last_store','Error occured during upload: '.$response["data"]["reason"]);
			break;
	}

	return false;
}

function gabeni_get_backup_file($location)
{
	$gabeni_info = gabeni_get_all_info();

	$result = false;

	$response = gabeni_service_request('get_backup_file', Array(
		'key' => $gabeni_info['gabeni_key'],
		'customer_id' => $gabeni_info['gabeni_customer_id'],
		'site_id' => $gabeni_info['gabeni_site_id'],
		'location' => $location,
		));

	if($response["status"] && !empty($response["reason"]))
	{
		$url = $response["reason"];
		$tmp = gabeni_temp()."/".uniqid().".".array_pop(explode(".",basename($location)));
		$cmd = "wget --no-check-certificate -O ".escapeshellarg($tmp)." ".escapeshellarg($url);
		gabeni_log('Fetching file: '.$cmd);
		$out = shell_exec($cmd);
		if(!empty($out)) gabeni_log($out);
		gabeni_log('Local file: '.$tmp);
		gabeni_log('Size: '.filesize($tmp));

		if(!is_file($tmp))
		{
			$result = false;
		}
		elseif(!filesize($tmp))
		{
			unlink($tmp);
			$result = false;
		}
		else
		{
			$result = $tmp;
		}
	}

	gabeni_service_request('del_tmp_file', Array(
		'key' => $gabeni_info['gabeni_key'],
		'customer_id' => $gabeni_info['gabeni_customer_id'],
		'site_id' => $gabeni_info['gabeni_site_id'],
		'location' => $location,
		));

	return $result;
}

function gabeni_get_backup_history()
{
	$gabeni_info = gabeni_get_all_info();

	$response = gabeni_service_request("get_backup_history", Array(
		'key' => $gabeni_info['gabeni_key'],
		'customer_id' => $gabeni_info['gabeni_customer_id'],
		'site_id' => $gabeni_info['gabeni_site_id'],
		));
	if($response["status"])
	{
		return $response["data"];
	}
	else
	{
		return false;
	}
}

?>
