<?php
	require_once "db_utils.php";
	function get_prices($city, $goods) {

		$economy_root = "../economy/";

    $prices_json =  file_get_contents($economy_root . "prices.json");

    $prices = json_decode($prices_json, true);

    $result = array();

    $goods = preg_split("/[,]/", $goods);

    foreach($goods as $good) {
      if(!isset($prices[$city][$good])) {
        return array(
          "success"=>"false",
    			"message"=>"Good " . $good . " cannot be found.",
    		);
      }
      $result[$good] = $prices[$city][$good];
    }

    return array(
      "success"=>"true",
			"prices"=>$result,
		);
	}
?>
