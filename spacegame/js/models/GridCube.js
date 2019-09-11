class GridCube extends THREE.Mesh {

  constructor(ship, cube_data) {
    var cube_geometry = new THREE.Geometry();

    let cell = cube_data.cube;
    let top_wall = cell.walls['t'];
    let bottom_wall = cell.walls['b'];

    if (bottom_wall) {
      let floor = new Panel(ship);
      floor.rotation.x = Math.PI / 2;
      cube_geometry.mergeMesh(floor);
    }

    if (top_wall) {
      let ceiling = new Panel(ship);
      ceiling.position.y = ship.panel_size + 2 * ship.corner_padding;
      ceiling.rotation.x = Math.PI / 2;
      cube_geometry.mergeMesh(ceiling);
    }

    //   An array of directions to iterate through.  At each dir we look at the forward wall and the forward-left corner
    //
    var dirs = ["s", "e", "n", "w", "s", "e", "n"];

    //   Rotate through the 4 directions
    //
    for (var i = 0; i < 4; i++) {
      let rotation = i * Math.PI / 2;

      let f = dirs[i]; // forward
      let l = dirs[i + 1]; // left
      let b = dirs[i + 2]; // back
      let r = dirs[i + 3]; // right

      //   Set up wall references in the config object
      //
      let c = {}
      c.cell = cell;
      c.top_wall = top_wall;
      c.bottom_wall = bottom_wall;

      c.forward_dir = f;

      c.forward_wall = c.cell.walls[f];
      c.left_wall = c.cell.walls[l];

      c.top_cell = cube_data['t'];
      c.top_cell_near_wall = c.top_cell ? c.top_cell.walls['b'] : false;
      c.top_cell_forward_wall = c.top_cell ? c.top_cell.walls[f] : false;
      c.top_cell_left_wall = c.top_cell ? c.top_cell.walls[l] : false;

      c.forward_cell = cube_data[f];
      c.forward_cell_near_wall = c.forward_cell ? c.forward_cell.walls[b] : false;
      c.forward_cell_left_wall = c.forward_cell ? c.forward_cell.walls[l] : false;
      c.forward_cell_top_wall = c.forward_cell ? c.forward_cell.walls['t'] : false;
      c.forward_cell_bottom_wall = c.forward_cell ? c.forward_cell.walls['b'] : false;

      c.left_cell = cube_data[l];
      c.left_cell_near_wall = c.left_cell ? c.left_cell.walls[r] : false;
      c.left_cell_forward_wall = c.left_cell ? c.left_cell.walls[f] : false;
      c.left_cell_top_wall = c.left_cell ? c.left_cell.walls['t'] : false;
      c.left_cell_bottom_wall = c.left_cell ? c.left_cell.walls['b'] : false;

      c.top_forward_cell = cube_data['t' + f];
      c.top_forward_cell_near_wall = c.top_forward_cell ? c.top_forward_cell.walls[b] : false;
      c.top_forward_cell_left_wall = c.top_forward_cell ? c.top_forward_cell.walls[l] : false;
      c.top_forward_cell_bottom_wall = c.top_forward_cell ? c.top_forward_cell.walls['b'] : false;

      c.top_left_cell = cube_data['t' + l];
      c.top_left_cell_near_wall = c.top_left_cell ? c.top_left_cell.walls[r] : false;
      c.top_left_cell_forward_wall = c.top_left_cell ? c.top_left_cell.walls[f] : false;
      c.top_left_cell_bottom_wall = c.top_left_cell ? c.top_left_cell.walls['b'] : false;

      c.forward_left_cell = cube_data[f + l];
      c.forward_left_cell_right_wall = c.forward_left_cell ? c.forward_left_cell.walls[r] : false;
      c.forward_left_cell_back_wall = c.forward_left_cell ? c.forward_left_cell.walls[b] : false;
      c.forward_left_cell_top_wall = c.forward_left_cell ? c.forward_left_cell.walls['t'] : false;

      //   handle straight on
      //
      let wall = false;
      if (c.forward_wall) {
        wall = new Wall(ship, c.top_wall, c.bottom_wall);
      } else {
        wall = new PanelLink(ship, c.top_wall && c.forward_cell_top_wall, c.bottom_wall && c.forward_cell_bottom_wall);
      }
      if (wall) {
        wall.rotation.y = rotation;
        cube_geometry.mergeMesh(wall);
      }

      //   then handle the corner
      //
      let corner = false;
      if (c.forward_wall && c.left_wall) {
        corner = new WallCorner(ship, c.top_wall, c.bottom_wall);
      } else if (c.forward_wall && !c.left_wall && !c.left_cell_near_wall && c.left_cell_forward_wall) {
        corner = new WallLink(ship, c.top_wall && c.left_cell_top_wall, c.bottom_wall && c.left_cell_bottom_wall);
      } else if (!c.forward_wall && !c.left_wall && !c.left_cell_near_wall && !c.forward_cell_near_wall && !c.left_cell_forward_wall && !c.forward_cell_left_wall) {
        corner = new PanelFloorFill(ship);
      } else if (!c.forward_wall && !c.left_wall && !c.left_cell_near_wall && c.left_cell_forward_wall && !c.forward_cell_near_wall && c.forward_cell_left_wall) {
        corner = new WallOutsideCorner(ship, c.top_wall && c.forward_cell_top_wall && c.left_cell_top_wall, c.bottom_wall && c.forward_cell_bottom_wall && c.left_cell_bottom_wall);
      } else if (!c.forward_wall && c.left_wall && c.left_cell_near_wall && !c.left_cell_forward_wall && c.forward_cell && !c.forward_cell_near_wall && !c.forward_cell_left_wall) {
        corner = new WallEndLeft(ship, c.top_wall && c.forward_cell_top_wall, c.bottom_wall && c.forward_cell_bottom_wall);
      } else if (c.forward_wall && c.left_cell && !c.left_wall && !c.left_cell_near_wall && !c.left_cell_forward_wall && c.forward_cell_near_wall && !c.forward_cell_left_wall) {
        corner = new WallEndRight(ship, c.top_wall && c.left_cell_top_wall, c.bottom_wall && c.left_cell_bottom_wall);



        // var sphere_geometry = new THREE.SphereGeometry(0.1, 32, 32);
        // var sphere = new THREE.Mesh(sphere_geometry);
        // cube_geometry.mergeMesh(sphere);
      }
      if (corner) {
        corner.rotation.y = rotation;
        cube_geometry.mergeMesh(corner);
      }

      if (c.top_cell && !c.top_wall && !c.top_cell_near_wall) {
        //   the crown is the part at the top of the wall near the ceiling
        //
        let crown = false;
        if (c.forward_wall && c.top_cell_forward_wall) {
          crown = new CrownFlatLink(ship);
        } else if (c.forward_wall && c.top_cell && !c.top_cell_forward_wall) {
          crown = new CrownOutsideFloorCorner(ship);
        } else if (!c.forward_wall && c.top_cell_forward_wall && c.forward_cell_top_wall) {
          crown = new CrownOutsideCeilingCorner(ship);
        }
        if (crown) {
          crown.rotation.y = rotation;
          cube_geometry.mergeMesh(crown);
        }

        let crown_corner = false;
        if (c.forward_wall && c.top_cell_forward_wall && c.left_wall && c.top_cell_left_wall) {
          crown_corner = new CrownCornerLink(ship);
        } else if (c.forward_wall && c.top_cell_forward_wall && !c.top_cell_left_wall && !c.left_wall && c.left_cell_forward_wall && !c.left_cell_near_wall) {
          crown_corner = new CrownCornerFlatFill(ship);
        } else if (!c.forward_wall && !c.top_cell_forward_wall && c.top_cell_left_wall && c.left_wall && c.forward_cell_left_wall && !c.forward_cell_near_wall) {
          crown_corner = new CrownCornerPerpendicularFill(ship);
        } else {
          crown_corner = new CrownMultiCorner(ship, c);
        }


        if (crown_corner) {
          crown_corner.rotation.y = rotation;
          cube_geometry.mergeMesh(crown_corner);
        }
      }

    }

    //   Randomize colors
    //
    for (var index in cube_geometry.faces) {
      //cube_geometry.faces[index].color = new THREE.Color(Math.floor(Math.random() * 0xFFFFFF));
    }



    cube_geometry.mergeVertices(); // optional
    super(cube_geometry, ship.base_material);
  }
}
