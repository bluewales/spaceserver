<?php
	require_once "db_utils.php";
	function set_save($user_id, $data) {

    save_user_state($user_id, json_encode($data));

		return array("success"=>"true");
	}
?>
