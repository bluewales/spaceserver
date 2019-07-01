<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>Journal - Safiina</title>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div id="main">
  <h1>Safiina</h1>
  <h2>Journal</h2>
<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

$path = "entries";
include 'Parsedown.php';
$Parsedown = new Parsedown();

$entries = array();

if ($handle = opendir($path)) {
  while (false !== ($file = readdir($handle))) {
    if ('.' === $file) continue;
    if ('..' === $file) continue;
    $entries[] = $file;
  }
  closedir($handle);
} else {
  echo "<p>Could not open entries folder</p>";
}
sort($entries);
$entries = array_reverse($entries);
foreach($entries as $file) {
  $file_path = $path . "/" . $file;
  echo "\n<hr/>\n";
  echo "<h4> Space Date " . str_replace(".md","",$file) . "</h4>\n";
  echo $Parsedown->text(file_get_contents($file_path));
}

?>
</div>
</body>
</html>
