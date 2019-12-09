<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>Todo - Safiina</title>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div id="main">
<?php
include '../journal/Parsedown.php';
$Parsedown = new Parsedown();
echo $Parsedown->text(file_get_contents("todo_list.md"));
echo $Parsedown->text(file_get_contents("done.md"));
?>
</div>
</body>
</html>
