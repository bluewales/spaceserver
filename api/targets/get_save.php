<?php
	require_once "db_utils.php";
	function get_save($user_id) {

    $path = getcwd();
		$data = get_user_state($user_id);
		if(!$data) {
	    $data = file_get_contents("http://spaceplanets.net/spacegame/dat/sample_ship6.json");
		}




		return array(
      "success"=>"true",
      "data"=>$data,
    );
	}
?>
