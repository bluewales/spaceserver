class Ship extends THREE.Object3D {

  constructor(ship_data) {
    super();

    this.data = ship_data;
    this.structure = new Structure(this, ship_data);

    this.panel_size = 2.25;
    this.corner_padding = 0.1;

    // this.panel_size *= 5;
    // this.corner_padding *= 5;

    this.grid_size = this.panel_size + this.corner_padding * 4;
    this.touch_padding = 0.01;

    this.curve_detail = 3;

    this.palette = ship_palette;
    this.base_color = this.palette[5];
    this.decoration_color = new THREE.Color(this.palette[0]);

    this.base_material = new THREE.MeshLambertMaterial({ color: this.base_color, side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
    this.window_material = new THREE.MeshPhongMaterial({ color: this.base_color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    

    // Positive x is east
    // Positive z is south
    // Positive y is up

    // console.log(JSON.stringify(ship_data));
    this.rotations = { "n": Math.PI, "s": 0, "e": Math.PI / 2, "w": -Math.PI / 2 };
    this.oposites = { "n": "s", "s": "n", "e": "w", "w": "e" };
    this.wall_transforms = {
      "n": new THREE.Vector3(0, 0, -1),
      "s": new THREE.Vector3(0, 0, 1),
      "e": new THREE.Vector3(1, 0, 0),
      "w": new THREE.Vector3(-1, 0, 0),
    };
    this.transforms = {
      "n": new THREE.Vector3(0, 0, -1),
      "s": new THREE.Vector3(0, 0, 1),
      "e": new THREE.Vector3(1, 0, 0),
      "w": new THREE.Vector3(-1, 0, 0),
      "t": new THREE.Vector3(0, 1, 0),
      "b": new THREE.Vector3(0, -1, 0),
      "0": new THREE.Vector3(0, 0, 0),
    };

    let dir_pairs = ["ne", "se", "nw", "sw", "tn", "ts","te","tw","bn","bs","be","bw"];
    for(let ix in dir_pairs) {
      let dir = dir_pairs[ix];
      this.transforms[dir] = new THREE.Vector3().addVectors(
        this.transforms[dir[0]], 
        this.transforms[dir[1]]
      );
    }

    this.cube_grid = {};

    for (var x in ship_data.grid) {
      x *= 1;
      for (var y in ship_data.grid[x]) {
        y *= 1;
        for (var z in ship_data.grid[x][y]) {
          z *= 1;
          this.update_cube(x, y, z);
        }
      }
    }
  }

  

  cube_changed(x, y, z) {
    for (let dir in this.transforms) {
      let t = this.transforms[dir];
      this.update_cube(x + t.x, y + t.y, z + t.z);
    }
  }

  //   When changing the structure of the ship, make sure the changes are in effect on the ship's grid before calling update cube
  //
  update_cube(x, y, z) {
    let here = new THREE.Vector3(x, y, z);

    //   Remove existing cube from this spot.  This might be problematic.
    // TODO: Make sure the cube is cleaned up and doesn't lead to avoidable memory leaks.
    // TODO: In many cases, the cube wont need to be changed at all.  If we can check the 
    //       existing cube, maybe we can improve performance by leaving it alone.
    //
    let old_cube = grid_lookup(this.cube_grid, here);
    if (old_cube) {
      this.remove(old_cube);
      this.cube_grid[x][y][z] = undefined;
    }

    //   If there's not supposed to be a cube here, exit early
    //
    if (!grid_lookup(this.data.grid, here)) {
      return;
    }

    //   Put together lookup information for figuring out wall stuff
    //
    let wall_config = {};
    for (let dir in this.transforms) {
      let coord = new THREE.Vector3(x, y, z).add(this.transforms[dir]);
      wall_config[dir] = grid_lookup(this.data.grid, coord);
    }

    //   Create the cube mesh
    //
    var cube = new GridCube(this, wall_config);

    //   Calculate the position of the cube
    //
    cube.position.add(here);
    cube.position.multiplyScalar(this.grid_size);

    //   Add cube to lookup structure
    //
    if (!this.cube_grid[x]) this.cube_grid[x] = {};
    if (!this.cube_grid[x][y]) this.cube_grid[x][y] = {};
    if (this.cube_grid[x][y][z]) this.remove(this.cube_grid[x][y][z]);
    this.cube_grid[x][y][z] = cube;

    //   Add cube to ship container so it gets rendered
    //
    this.add(cube);


    this.link_doors(x, y, z);

    //   If the grid comes with a content, they are created and added to the ship
    //
    if (this.data.grid[x][y][z].contents) {
      let contents = this.data.grid[x][y][z].contents;
      let object = undefined;
      if (contents.type == "stairs") {
        object = new Stairs(this, contents);
      } else if (contents.type == "console") {
        object = new ConsolePodium(this, contents);
      }

      if (object) {
        object.rotation.y = this.rotations[contents.dir];
        cube.add(object);
      }
    }
  }

  link_doors(x, y, z) {
    let cube = this.cube_grid[x][y][z];
    for (let dir in cube.walls) {
      let wall = cube.walls[dir];
      if (wall.is_door) {
        let door = wall;
        let pair_coord = new THREE.Vector3(x,y,z).add(this.transforms[dir]);
        let pair_cube = grid_lookup(this.cube_grid, pair_coord);
        if(pair_cube) {
          let pair_door = pair_cube.walls[this.oposites[dir]];
          if (pair_door.is_door) {
            door.link(pair_door);
          }
        }
      }
    }
  }
}

