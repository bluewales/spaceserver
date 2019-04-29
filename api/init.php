<?php
require_once "config.php";
require_once "password_utils.php";
require_once "db_utils.php";

error_reporting(E_ALL);
ini_set('display_errors', '1');

if(!isset($db_password)) {
    echo "<p>Error: Password is not set</p>\n";
    echo "<p>You must create db_password.php and define $db_password.</p>\n";
    die();
} 

if(mysql_db_user_table_exists()) {
    echo "<p>The user table already exists.  If you want to reinitialize the database, drop all tables and run this script again.</p>";
} else {
    echo "<p>Creating user table.</p>";
    mysql_db_create_user_table();
    
    echo "<p>Creating game state table.</p>";
    mysql_db_create_game_states_table();
}

phpinfo();


?>