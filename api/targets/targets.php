<?php
$targets = array (
	"login" => array (
		"function" => "login",
		"file" => "login.php",
		"required_params" => array (
			"username",
			"password"
		),
		"optional_params" => array ()
	),
	"logout" => array (
		"function" => "logout",
		"file" => "logout.php",
		"required_params" => array (
			"auth_token"
		),
		"optional_params" => array ()
	),
	"createuser" => array (
		"function" => "createuser",
		"file" => "createuser.php",
		"required_params" => array (
			"username",
			"password1",
			"password2"
		),
		"optional_params" => array ()
	),
	"get_save" => array (
		"function" => "get_save",
		"file" => "get_save.php",
		"required_params" => array (),
		"optional_params" => array (
			"auth_token"
		)
	),
	"set_save" => array (
		"function" => "set_save",
		"file" => "set_save.php",
		"required_params" => array (
			"auth_token",
			"data"
		),
		"optional_params" => array ()
	),
	"get_prices" => array (
		"function" => "get_prices",
		"file" => "get_prices.php",
		"required_params" => array (
			"city",
			"goods"
		),
		"optional_params" => array ()
	)
);
?>
