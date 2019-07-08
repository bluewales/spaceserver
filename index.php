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
  <p>I want to make a computer game about a space ship.</p>
  <p>You can login and run around and try it out.  There's not much to see or do, yet.  Development is ongoing, so check back later.</p>
  <hr noshade/>
  <h2>How to contact me:</h2>
  <p>Email<?php if(isset($_COOKIE['auth_token'])) echo " at <a href='mailto:developer@safiina.com'>developer@safiina.com</a>";?>.</p>
</div>
</body>
</html>

