<?php
	require_once "db_utils.php";
	function login ($username, $password) {
		global $h_token_length;
		$user_id = mysql_db_valid_login($username, $password);

		if(!$user_id) {
			return array("message" => "Invalid login.", "success" => "false", "error_code" => 94);
		}

		// Create new login
		$alpha = implode($user_id, array_keys($_REQUEST)) . implode($user_id, $_REQUEST);
		$auth_token = randomString($h_token_length, $alpha);
		mysql_db_save_session_token($user_id, $auth_token);

		setcookie ("auth_token", $auth_token, 0 , "/");
		return array("success"=>"true","auth_token"=>$auth_token,"logged_in"=>"true");
	}
?>
