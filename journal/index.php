<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>Journal - Space Planets</title>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div id="main">
  <h1>Space Planets</h1>
  <h1>Journal</h1>
<?php

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
}
sort($entries);
$entries = array_reverse($entries);
foreach($entries as $file) {
  $file_path = $path . "/" . $file;
  echo "<hr/>";
  echo "<h3> Space Date " . str_replace(".md","",$file) . "</h3>";
  echo $Parsedown->text(file_get_contents($file_path));
}

 ?>
</div>
</body>
</html>
