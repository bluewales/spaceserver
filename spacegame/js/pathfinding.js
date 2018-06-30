function get_path(from, to) {
  var graph = window.game.ship.graph;
  var start = graph.get_node(from);
  var end = graph.get_node(to);
  
  var path = astar.search(graph, start, end);

  return path;
}

function walled_distance(a, b) {
  var ax = a.x;
  var bx = b.x;
  var ay = a.y;
  var by = b.y;

  if (a.ori == '|' && ax < bx) ax += 1;
  if (a.ori == '-' && ay < by) ay += 1;

  if (b.ori == '|' && bx < ax) bx += 1;
  if (b.ori == '-' && by < ay) by += 1;

  var dx = Math.abs(ax - bx);
  var dy = Math.abs(ay - by);
  var dz = Math.abs(a.z - b.z);

  return dx + dy + dz;
}

function passable(from, to) {

  var dx = from.x - to.x;
  var dy = from.y - to.y;
  var dz = from.z - to.z;
  var dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
  if (dist > 1) return false;
  if (dist < 1) return true;

  if (dx != 0) {
    if (dx > 0) {
      return window.game.ship.graph.link_weight(from, "west");
    } else {
      return window.game.ship.graph.link_weight(from, "east");
    }
  }
  if (dy != 0) {
    if (dy > 0) {
      return window.game.ship.graph.link_weight(from, "north");
    } else {
      return window.game.ship.graph.link_weight(from, "south");
    }
  }
  if (dz != 0) {
    if (dz > 0) {
      return window.game.ship.graph.link_weight(from, "down");
    } else {
      return window.game.ship.graph.link_weight(from, "up");
    }
  }
  console.log("ERROR");
}
