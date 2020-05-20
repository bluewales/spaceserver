<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Safiina</title>

  <link rel="stylesheet" type="text/css" href="style/core.css">
  <link rel="stylesheet" type="text/css" href="/css/style.css">
  <link rel="icon" type="image/png" href="constructor.png">

  <script src="js/SpaceLoader.js<?php echo "?a=".rand();?>" type="text/javascript"></script>
  <script src="js/launch.js<?php echo "?a=".rand();?>" type="text/javascript"></script>
  <script src="js/lib/d3.js"></script>
  <script src="js/lib/preloadjs-0.6.2.min.js" type="text/javascript"></script>
</head>
<body>
  <div id="game"></div>
  <div id="ui" >
    <div id="blocker" v-bind:hidden="!active_overlay" v-on:click="hide_overlay"></div>
    <component class="overlay" v-bind:is="active_overlay" v-on:overlay-close="hide_overlay"></component>
  </div>
  <div id="debug"></div>
</body>
</html>
