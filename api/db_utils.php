<?php
require_once "config.php";

$mysql_db_connection = false;

function mysql_db_connect() {
	global $mysql_db_connection, $db_database, $db_address, $db_user, $db_password;

	if($mysql_db_connection)
		return $mysql_db_connection;
	$mysql_db_connection = mysqli_connect($db_address, $db_user, $db_password, $db_database);
	if (!$mysql_db_connection) die('Could not connect: ' . mysqli_connect_error());

	return $mysql_db_connection;
}

function mysql_db_username_exists($username) {
	global $db_table_prefix;
	$con = mysql_db_connect();
	$sql = "select * from " . $db_table_prefix . "_users where username='" . $username . "'";
	$result = mysqli_query($con, $sql);
	if($result) {
		$user_data = mysqli_fetch_assoc($result);
	} else {
		return false;
	}
	if(!empty($user_data)) {
		return $user_data['id'];
	}
	return false;
}

function mysql_db_save_login($username, $hashed_password, $salt) {
	global $db_table_prefix;
	$con = mysql_db_connect();

	// Create user entry
	$sql = "insert into " . $db_table_prefix . "_users (username,password_hash,password_salt) " .
		"values('" . $username . "','" . $hashed_password . "', '" . $salt . "')";
	if(!mysqli_query($con, $sql)) {
		return false;
	}

	$sql="select * from " . $db_table_prefix . "_users where username='" . $username . "'";
	$result = mysqli_query($con, $sql);
	if(!$result) {
		return false;
	}

	$user_data = mysqli_fetch_assoc($result);
	return $user_data['id'];
}

function mysql_db_valid_login($username, $password) {
	global $db_table_prefix;
	$con = mysql_db_connect();

	$sql="select * from " . $db_table_prefix . "_users where username='" . $username . "'";
	$result = mysqli_query($con, $sql);
	if(!$result) {
		return false;
	}
	$user_data = mysqli_fetch_assoc($result);
	if(!$user_data || empty($user_data )) {
		return false;
	}
	$salt = $user_data['password_salt'];
	if(!$salt)
	{
		return false;
	}
	$hashedPassword = hash_password($password,$salt);
	if($hashedPassword != $user_data['password_hash']) {
		return false;
	}
	return $user_data['id'];
}

function mysql_db_save_session_token($user_id, $session_token) {
	global $db_table_prefix;
	$con = mysql_db_connect();

	$sql = "update " . $db_table_prefix . "_users set session_token='$session_token' where id='$user_id'";
	$result = mysqli_query($con, $sql);
	return (mysqli_affected_rows($con) == 1);
}

function mysql_db_user_id_from_session_token($session_token) {
	global $db_table_prefix;
	$con = mysql_db_connect();

	$sql = "select * from " . $db_table_prefix . "_users where session_token='" . $session_token . "'";
	$user_data;
	$result = mysqli_query($con, $sql);
	if($result) {
		$user_data = mysqli_fetch_assoc($result);
	} else {
		return false;
	}
	if(!empty($user_data)) {
		return $user_data['id'];
	}
	return false;
}

function mysql_db_user_table_exists() {
	global $db_table_prefix;
	$con = mysql_db_connect();

	$sql = "show tables like '" . $db_table_prefix . "_users'";
	$result = mysqli_query($con, $sql);
	return ($result->num_rows == 1);
}

function mysql_db_create_user_table() {
	global $db_table_prefix,  $a_username_max_length, $h_salt_length, $h_token_length;
	$con = mysql_db_connect();
	$sql = "create table " . $db_table_prefix . "_users (" .
		"id int auto_increment," .
		"username varchar(" . $a_username_max_length . ")," .
		"password_hash varchar(172)," .
		"password_salt varchar(" . $h_salt_length . ")," .
		"session_token varchar(" . $h_token_length . ")," .
		"created TIMESTAMP DEFAULT CURRENT_TIMESTAMP," .
		"PRIMARY KEY (id))";
	return mysqli_query($con, $sql);
}

function mysql_db_create_game_states_table() {
	global $db_table_prefix;
	$con = mysql_db_connect();
	$sql = "CREATE TABLE " . $db_table_prefix . "_game_states (" .
		"id int NOT NULL AUTO_INCREMENT," .
		"user_id int(11) DEFAULT NULL," .
		"state text," .
		"updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," .
		"PRIMARY KEY (id))";
	return mysqli_query($con, $sql);
}

function get_user_state($user_id) {
	global $db_table_prefix;
	$con = mysql_db_connect();

	$sql = "select state from " . $db_table_prefix . "_game_states where user_id=" . $user_id;
	$data;
	$result = mysqli_query($con, $sql);
	if($result) {
		$data = mysqli_fetch_assoc($result);
	} else {
		return false;
	}
	if(!empty($data)) {
		return $data['state'];
	}
	return false;
}

function save_user_state($user_id, $data) {
	global $db_table_prefix, $l_log_file;
	$con = mysql_db_connect();

	$sql = "select count(*) as c from " . $db_table_prefix . "_game_states where user_id='" . $user_id . "'";
	$result = mysqli_query($con, $sql);

	$saves = false;
	if($result) {
		$saves = mysqli_fetch_assoc($result);
	}
	$save_count = 0;
	if(!empty($saves)) {
		$save_count = $saves['c'];
	}

	if($save_count > 0) {
		$sql = "update " . $db_table_prefix . "_game_states set state='" . $data . "' where user_id='" . $user_id . "'";
	} else {
		$sql = "insert into " . $db_table_prefix . "_game_states (user_id,state) values('" . $user_id . "','" . $data . "')";
	}

	$result = mysqli_query($con, $sql);
}
?>
