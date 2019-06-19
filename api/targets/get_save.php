<?php
	require_once "db_utils.php";
	function get_save($user_id) {

		$path = getcwd();
		$data = get_user_state($user_id);
		$default_data = false;
		if(!$data) {
			$data = file_get_contents("http://spaceplanets.net/spacegame/dat/sample_ship10.json");
			$default_data = true;
		}

		$data = json_decode($data, true);

		return array(
			"success"=>"true",
			"default_data"=>$default_data,
			"data"=>$data,
		);
	}
?>
