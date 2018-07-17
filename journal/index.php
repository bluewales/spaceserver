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
  echo "<h4> Space Date " . str_replace(".md","",$file) . "</h4>";
  echo $Parsedown->text(file_get_contents($file_path));
}

 ?>
</div>
</body>
</html>
