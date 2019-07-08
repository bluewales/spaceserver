class GridCube extends THREE.Mesh {

  constructor(ship, cube_data) {
    var cube_geometry = new THREE.Geometry();

    //   Grid cubes always have a floor and ceiling
    //
    let floor = new Panel(ship);
    floor.rotation.x = Math.PI / 2;
    cube_geometry.mergeMesh(floor);

    let ceiling = new Panel(ship);
    ceiling.position.y = ship.panel_size + 2 * ship.corner_padding;
    ceiling.rotation.x = Math.PI / 2;
    cube_geometry.mergeMesh(ceiling);

    //   An array of directions to iterate through.  At each dir we look at the forward wall and the forward-left corner
    //
    var dirs = ["s", "e", "n", "w", "s", "e", "n"];

    //   Rotate through the 4 directions
    //
    for (var i = 0; i < 4; i++) {
      let rotation = i * Math.PI / 2;

      //   Set up wall references
      //
      let forward_wall = cube_data.grid.walls[dirs[i]];
      let left_wall = cube_data.grid.walls[dirs[i + 1]];

      let forward_cell = cube_data[dirs[i]];
      let forward_cell_near_wall = forward_cell ? cube_data[dirs[i]].walls[dirs[i + 2]] : false;
      let forward_cell_left_wall = forward_cell ? cube_data[dirs[i]].walls[dirs[i + 1]] : false;

      let left_cell = cube_data[dirs[i + 1]];
      let left_cell_near_wall = left_cell ? cube_data[dirs[i + 1]].walls[dirs[i + 3]] : false;
      let left_cell_forward_wall = left_cell ? cube_data[dirs[i + 1]].walls[dirs[i]] : false;

      //   handle straight on
      //
      if (forward_wall) {
        var wall = new Wall(ship);
        wall.rotation.y = rotation;
        cube_geometry.mergeMesh(wall);
      } else {
        var link = new PanelLink(ship);
        link.rotation.y = rotation;
        cube_geometry.mergeMesh(link);
      }

      //   then handle the corner
      //
      if (forward_wall && left_wall) {
        var wall_corner = new WallCorner(ship);
        wall_corner.rotation.y = rotation;
        cube_geometry.mergeMesh(wall_corner);
      } else if (forward_wall && !left_wall && !left_cell_near_wall && left_cell_forward_wall) {
        var wall_link = new WallLink(ship);
        wall_link.rotation.y = rotation;
        cube_geometry.mergeMesh(wall_link);
      } else if (!forward_wall && !left_wall && !left_cell_near_wall && !forward_cell_near_wall && !(left_cell_forward_wall && forward_cell_left_wall)) {
        var floor_fill = new PanelFloorFill(ship);
        floor_fill.rotation.y = rotation;
        cube_geometry.mergeMesh(floor_fill);
      } else if (!forward_wall && !left_wall && !left_cell_near_wall && left_cell_forward_wall && !forward_cell_near_wall && forward_cell_left_wall) {
        var outside_corner = new WallOutsideCorner(ship);
        outside_corner.rotation.y = rotation;
        cube_geometry.mergeMesh(outside_corner);
      } else if (!forward_wall && left_wall && left_cell_near_wall && !left_cell_forward_wall && !forward_cell_near_wall && !forward_cell_left_wall) {
        var wall_end = new WallEndLeft(ship);
        wall_end.rotation.y = rotation;
        cube_geometry.mergeMesh(wall_end);
      } else if (forward_wall && !left_wall && !left_cell_near_wall && !left_cell_forward_wall && forward_cell_near_wall && !forward_cell_left_wall) {
        var wall_end = new WallEndRight(ship);
        wall_end.rotation.y = rotation;
        cube_geometry.mergeMesh(wall_end);
      }
    }

    cube_geometry.mergeVertices(); // optional
    super(cube_geometry, ship.base_material);
  }
}
