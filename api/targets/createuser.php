<?php
	require_once "db_utils.php";
	require_once "login.php";
	function createuser ($username, $password1, $password2) {

		// Verify username
		global $a_username_min_length, $a_username_max_length, $a_password_min_length, $a_password_max_length,
				$db_address, $db_user, $db_password, $db_database, $db_table_prefix, $h_salt_length, $h_token_length;

		if (strlen($username) < $a_username_min_length) {
			return array("message" =>  "Username must be at least " . $a_username_min_length . " characters.",
						"success" => "false", "error_code" => 114);
		}
		if ($a_username_max_length > 0 && strlen($username) > $a_username_max_length) {
			return array("message" => "Username cannot be longer than " . $a_username_max_length . " characters.",
						"success" => "false", "error_code" => 115);
		}

		// Verify password
		if ($password1 != $password2) {
			return array("success" => "false","message" => "Passwords do not match.");
		}
		if (strlen($password1) < $a_password_min_length) {
			return array("success" => "false","message" => "Password must be at lest " . $a_password_min_length . " characters.");
		}
		if ($a_password_max_length > 0 && strlen($password1) > $a_password_max_length) {
			return array("message" => "Password cannot be longer than " . $a_password_max_length . " characters.");
		}

		if (mysql_db_username_exists($username)) {
			return array("message" => "The username '".$username."' is already taken");
		}

		// Everything has been checked out, now we'll create the account

		// Generate password salt and hash
		$salt = randomString($h_salt_length);
		$hashed_password = hash_password($password1,$salt);

		$user_id = mysql_db_save_login($username, $hashed_password, $salt);
		if(!$user_id) {
			return array("message" =>  "Database error",
						"success" => "false");
		}

		// Login the user
		$login_result = login($username, $password1);

		return array("success"=>"true","logged_in"=>$login_result);
	}
?>
