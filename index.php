<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>Safiina</title>
  <meta charset="utf-8" />
  <link rel="stylesheet" type="text/css" href="/css/style.css">
</head>
<body>
<div id="main">
  <h1>Safiina</h1>
  <ul id="navigation">
    <li><a href="/spacegame">Play</a></li>
    <li><a href="/journal">Journal</a></li>
    <li><a href="/todo">To-do List</a></li>
  </ul>
  <p>This is hobby project.  It's going to be a computer game about a space ship.</p>
  <p>You can login and click on stuff and try it out.  You can build things and watch the robot run arround.</p>
  <hr/>
  <h2>How to contact me:</h2>
  <p>Email<?php if(isset($_COOKIE['auth_token'])) echo " at <a href='mailto:developer@safiina.com'>developer@safiina.com</a>";?>.
</div>
</body>
</html>

