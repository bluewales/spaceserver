<?php
require_once "config.php";
require_once "password_utils.php";
require_once "db_utils.php";

error_reporting(E_ALL);
ini_set('display_errors', '1');

function isAssoc($arr) {
  return array_keys($arr) !== range(0, count($arr) - 1);
}

function JSON_from_array($array, $pretty) {

  header('Content-type: application/json');

  $json = json_encode($array);
  if($pretty) {
    require_once "json_utils.php";
    $json = indent($json);
  }
  return $json;
}

function plist_from_array($array, $indent="") {
  $assoc = isAssoc($array);

  $next_indent = isset($_GET['pretty'])?"  ".$indent:"";
  $new_line = isset($_GET['pretty'])?"\n":"";

  $result = $indent.($assoc?("<dict >"):("<array >")).$new_line;
  foreach ($array as $i => $value) {
    if( is_array($value)) {
      $result .= ($assoc?("  <key >".$i."</key >".$new_line.plist_from_array($value,$next_indent)):(plist_from_array($value,$next_indent))).$new_line;
    } else if(is_int($value)) {
      $result .= $next_indent.($assoc?("<key >".$i."</key >"."<integer >".$value."</integer >"):("<integer >".$value."</integer >")).$new_line;
    } else {
      $result .= $next_indent.($assoc?("<key >".$i."</key >"."<string >".$value."</string >"):("<string >".$value."</string >")).$new_line;
    }
  }
  $result .= $indent.($assoc?("</dict >"):("</array >"));
  return $result;
}

function fgetline ($file) {
  $result = "";
  $c = " ";
  do {
    $c = fread($file,1);
    if(($c || $c == '0') && $c != "\r" && $c != "\n")
      $result .= $c;
  } while ($c == '0' || $c != "\r" && $c != "\n" && $c);
  if($result == "") return false;
  return $result;
}

function authenticate_admin($auth_token) {
  $authenticated = authenticate_user($auth_token);
  return $authenticated['admin']?$authenticated:false;
}

function authenticate_user($auth_token) {
  global $a_skeleton_key, $db_address, $db_user, $db_password, $db_table_prefix, $db_database ;
  $authenticated = false;
  if (strlen($a_skeleton_key) > 0 && $auth_token == $a_skeleton_key) {
    $authenticated = array("user_id" => "0","admin" => true);
    $authenticated['username'] = "superuser";
    $authenticated['telephone'] = "(555) 555-5555";
    $authenticated['auth_token'] = $auth_token;
  } else {
    $con = mysql_connect($db_address, $db_user, $db_password);
    if (!$con) die('Could not connect: ' . mysql_error());
    mysql_select_db($db_database, $con);

    $sql = "select * from ".$db_table_prefix."_sessions where auth_token='$auth_token'";
    $result = mysql_query($sql);

    if($result && $row = mysql_fetch_assoc ($result)) {
      $user_id = $row['user_id'];
    } else {
      return false;
    }

    $sql = "select * from ".$db_table_prefix."_users where id='$user_id'";
    $result = mysql_query($sql);

    if($result && $row = mysql_fetch_assoc ($result)) {
      $authenticated = array();
      $authenticated['user_id'] = $row['id'];
      $authenticated['admin'] = false;
      $authenticated['username'] = $row['username'];
      $authenticated['telephone'] = $row['telephone'];
      $authenticated['auth_token'] = $auth_token;
      $authenticated['admin'] = $row['director'];
    }
  }
  return $authenticated;
}

function done($result, $params) {

  if(isset($_REQUEST['debug'])) {
    $result['debug'] =  array(
    "headers" => apache_request_headers(),
    "request" =>  $_REQUEST,
    "get" =>  $_GET,
    "post" =>  $_POST,
    "cookie" =>  $_COOKIE,
    );
  }

  write_log($result, $params);

  if(isset($_REQUEST['plist'])) {
    header('Content-Type: application/x-plist');
    echo plist_from_array($result);
  } else {
    header('Content-Type: application/json');
    echo JSON_from_array($result, isset($_GET['pretty']));
  }
  exit(0);
}


function write_log($result, $params) {
  global $l_log_file;
  if(strlen($l_log_file) > 0) {
    $log_string = JSON_from_array($result, false) . " " . JSON_from_array($params, false) . "\n";
    file_put_contents($l_log_file, $log_string, FILE_APPEND);
  }
}



$result = array();
$result['method'] = "none";
$result['success'] = "false";
$result['logged_in'] = "false";
$failed = false;



$postdata = file_get_contents("php://input");
$json_data = json_decode ($postdata);
if($json_data) {
  $json_data = (array) $json_data;
} else {
  $json_data = array();
}

$_REQUEST = array_merge($_REQUEST, $json_data);
$_REQUEST = array_merge($_REQUEST, $_COOKIE);

require_once("targets/targets.php");

$params = array ();

if (isset($_REQUEST['method']) && array_key_exists ($_REQUEST['method'], $targets)) {

  $target = $targets[$_REQUEST['method']];
  require_once("targets/" . $target['file']);
  $result['method'] = $_REQUEST['method'];

  $function = $targets[$_REQUEST['method']]['function'];

  foreach ($target['required_params'] as $param) {
    if (!isset($_REQUEST[$param])) {
      $result['success'] = "false";

      if($param == "auth_token") {
        $result['error_code'] = 91;
        $result['message'] = "Must be logged in for that";
      } else {
        $result['error_code'] = 83;
        $result['missing_param'] = $param;
        $result['message'] = "Required parameter not found";
      }
      done($result, $params);
    } else {
      if($param == "auth_token") {
        $user_id = mysql_db_user_id_from_session_token($_REQUEST[$param]);
        if(!$user_id) {
          $result['success'] = "false";
          $result['message'] = "Authorization Failed. Invalid auth_token.";
          $result['error_code'] = 54;
          done($result, $params);
        }
        $params["user_id"] = $user_id;
        $result["logged_in"] = "true";
      } else {
        $params[$param] = $_REQUEST[$param];
      }
    }
  }
  foreach ($target['optional_params'] as $param) {
    if (!isset($_REQUEST[$param])) {
      $params[$param] = "";
    } else {
      $params[$param] = $_REQUEST[$param];
    }
  }
  $partial_result = call_user_func_array($function,$params);
  $result = array_merge($result, $partial_result);
} else {
  $result['success'] = "false";
  $result['error_code'] = 84;
  $result['message'] = "No method named.";
}

done($result, $params);
?>
