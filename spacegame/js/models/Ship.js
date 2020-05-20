class Ship extends THREE.Object3D {

  constructor(ship_data) {
    super();

    this.data = ship_data;

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
    this.window_material = new THREE.MeshPhongMaterial({ color: this.base_color, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
    

    // Positive x is east
    // Positive z is south
    // Positive y is up

    // console.log(JSON.stringify(ship_data));
    let rotations = { "n": Math.PI, "s": 0, "e": Math.PI / 2, "w": -Math.PI / 2 };
    let oposites = { "n": "s", "s": "n", "e": "w", "w": "e" };
    let transforms = {
      "n": { "x": 0, "y": 0, "z": -1 },
      "s": { "x": 0, "y": 0, "z": 1 },
      "e": { "x": 1, "y": 0, "z": 0 },
      "w": { "x": -1, "y": 0, "z": 0 },
    };

    this.cube_grid = {};

    for (var x in ship_data.grid) {
      x *= 1;
      for (var y in ship_data.grid[x]) {
        y *= 1;
        for (var z in ship_data.grid[x][y]) {
          z *= 1;
          if (!ship_data.grid[x][y][z].cell) {
            continue;
          }

          let wall_config = {
            "center": ship_data.grid[x][y][z],
            "n": ship_data.grid[x][y][z - 1],
            "s": ship_data.grid[x][y][z + 1],
            "e": (ship_data.grid[x + 1] && ship_data.grid[x + 1][y]) ? ship_data.grid[x + 1][y][z] : undefined,
            "w": (ship_data.grid[x - 1] && ship_data.grid[x - 1][y]) ? ship_data.grid[x - 1][y][z] : undefined,
            "t": ship_data.grid[x][y + 1] ? ship_data.grid[x][y + 1][z] : undefined,
            "b": ship_data.grid[x][y - 1] ? ship_data.grid[x][y - 1][z] : undefined,
            "tn": ship_data.grid[x][y + 1] ? ship_data.grid[x][y + 1][z - 1] : undefined,
            "ts": ship_data.grid[x][y + 1] ? ship_data.grid[x][y + 1][z + 1] : undefined,
            "te": (ship_data.grid[x + 1] && ship_data.grid[x + 1][y + 1]) ? ship_data.grid[x + 1][y + 1][z] : undefined,
            "tw": (ship_data.grid[x - 1] && ship_data.grid[x - 1][y + 1]) ? ship_data.grid[x - 1][y + 1][z] : undefined,
            "ne": (ship_data.grid[x + 1] && ship_data.grid[x + 1][y]) ? ship_data.grid[x + 1][y][z - 1] : undefined,
            "nw": (ship_data.grid[x - 1] && ship_data.grid[x - 1][y]) ? ship_data.grid[x - 1][y][z - 1] : undefined,
            "se": (ship_data.grid[x + 1] && ship_data.grid[x + 1][y]) ? ship_data.grid[x + 1][y][z + 1] : undefined,
            "sw": (ship_data.grid[x - 1] && ship_data.grid[x - 1][y]) ? ship_data.grid[x - 1][y][z + 1] : undefined
          };

          wall_config['en'] = wall_config['ne'];
          wall_config['wn'] = wall_config['nw'];
          wall_config['es'] = wall_config['se'];
          wall_config['ws'] = wall_config['sw'];

          //console.log(grid_x + " " + grid_y + " " + grid_z);
          var cube = new GridCube(this, wall_config);

          cube.position.x = x * (this.grid_size);
          cube.position.y = y * (this.grid_size);
          cube.position.z = z * (this.grid_size);

          //   Add cube to lookup structure
          //
          if (!this.cube_grid[x]) this.cube_grid[x] = {};
          if (!this.cube_grid[x][y]) this.cube_grid[x][y] = {};
          this.cube_grid[x][y][z] = cube;

          //   Add cube to container so it gets rendered
          //
          this.add(cube);

          if (ship_data.grid[x][y][z].contents) {
            let contents = ship_data.grid[x][y][z].contents;
            let object = undefined;
            if (contents.type == "stairs") {
              object = new Stairs(this, contents);
            } else if (contents.type == "console") {
              object = new ConsolePodium(this, contents);
            }

            if(object) {
              object.position.x = x * this.grid_size;
              object.position.y = y * this.grid_size;
              object.position.z = z * this.grid_size;

              object.rotation.y = rotations[contents.dir];

              this.add(object);
            }
          }
        }
      }
    }


    //   This finds door pairs and links them up
    //
    for (var x in ship_data.grid) {
      x *= 1;
      for (var y in ship_data.grid[x]) {
        y *= 1;
        for (var z in ship_data.grid[x][y]) {
          z *= 1;
          if (!ship_data.grid[x][y][z].cell) {
            continue;
          }

          let cube = this.cube_grid[x][y][z];
          for(let dir in cube.walls) {
            let wall = cube.walls[dir];
            if(wall.is_door) {
              let door = wall;
              let pair_coord = {
                "x": x + transforms[dir].x,
                "y": y + transforms[dir].y,
                "z": z + transforms[dir].z
              };
              let pair_cube = this.cube_grid[pair_coord.x][pair_coord.y][pair_coord.z];
              let pair_door = pair_cube.walls[oposites[dir]];
              if (pair_door.is_door) {
                door.link(pair_door);
              }
            }
          }
        }
      }
    }

  }
}
