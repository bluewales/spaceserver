class Ship extends THREE.Object3D {

  constructor(ship_data) {
    super();

    this.data = ship_data;

    this.panel_size = 2;
    this.corner_padding = 0.1;
    this.grid_size = this.panel_size + this.corner_padding * 4;
    this.touch_padding = 0.01;

    this.curve_detail = 4;

    this.palette = ship_palette;
    this.base_color = this.palette[5];
    this.decoration_color = new THREE.Color(this.palette[0]);

    this.base_material = new THREE.MeshPhongMaterial({ color: this.base_color, side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
    this.window_material = new THREE.MeshPhongMaterial({ color: this.base_color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    

    // Positive x is east
    // Positive z is south
    // Positive y is up

    for (let grid_x = 0; grid_x < ship_data.grid.length; grid_x += 1) {
      let ship_x = grid_x + ship_data.grid_offset.x;

      for (let grid_y = 0; grid_y < ship_data.grid[grid_x].length; grid_y += 1) {
        let ship_y = grid_y + ship_data.grid_offset.y;

        for (let grid_z = 0; grid_z < ship_data.grid[grid_x][grid_y].length; grid_z += 1) {
          let ship_z = grid_z + ship_data.grid_offset.z;

          if (ship_data.grid[grid_x][grid_y][grid_z].cell) {
            let wall_config = {
              "cube": ship_data.grid[grid_x][grid_y][grid_z],
              "n": ship_data.grid[grid_x][grid_y][grid_z - 1],
              "s": ship_data.grid[grid_x][grid_y][grid_z + 1],
              "e": (ship_data.grid[grid_x + 1] && ship_data.grid[grid_x + 1][grid_y]) ? ship_data.grid[grid_x + 1][grid_y][grid_z] : undefined,
              "w": (ship_data.grid[grid_x - 1] && ship_data.grid[grid_x - 1][grid_y]) ? ship_data.grid[grid_x - 1][grid_y][grid_z] : undefined,
              "t": ship_data.grid[grid_x][grid_y + 1] ? ship_data.grid[grid_x][grid_y + 1][grid_z] : undefined,
              "b": ship_data.grid[grid_x][grid_y - 1] ? ship_data.grid[grid_x][grid_y - 1][grid_z] : undefined,
              "tn": ship_data.grid[grid_x][grid_y + 1] ? ship_data.grid[grid_x][grid_y + 1][grid_z - 1] : undefined,
              "ts": ship_data.grid[grid_x][grid_y + 1] ? ship_data.grid[grid_x][grid_y + 1][grid_z + 1] : undefined,
              "te": (ship_data.grid[grid_x + 1] && ship_data.grid[grid_x + 1][grid_y + 1]) ? ship_data.grid[grid_x + 1][grid_y + 1][grid_z] : undefined,
              "tw": (ship_data.grid[grid_x - 1] && ship_data.grid[grid_x - 1][grid_y + 1]) ? ship_data.grid[grid_x - 1][grid_y + 1][grid_z] : undefined,
              "ne": (ship_data.grid[grid_x + 1] && ship_data.grid[grid_x + 1][grid_y]) ? ship_data.grid[grid_x + 1][grid_y][grid_z - 1] : undefined,
              "nw": (ship_data.grid[grid_x - 1] && ship_data.grid[grid_x - 1][grid_y]) ? ship_data.grid[grid_x - 1][grid_y][grid_z - 1] : undefined,
              "se": (ship_data.grid[grid_x + 1] && ship_data.grid[grid_x + 1][grid_y]) ? ship_data.grid[grid_x + 1][grid_y][grid_z + 1] : undefined,
              "sw": (ship_data.grid[grid_x - 1] && ship_data.grid[grid_x - 1][grid_y]) ? ship_data.grid[grid_x - 1][grid_y][grid_z + 1] : undefined
            };

            wall_config['en'] = wall_config['ne'];
            wall_config['wn'] = wall_config['nw'];
            wall_config['es'] = wall_config['se'];
            wall_config['ws'] = wall_config['sw'];

            //console.log(grid_x + " " + grid_y + " " + grid_z);
            var cube = new GridCube(this, wall_config);

            cube.position.x = ship_x * (this.grid_size);
            cube.position.y = ship_y * (this.grid_size);
            cube.position.z = ship_z * (this.grid_size);

            this.add(cube);
          }

          if (ship_data.grid[grid_x][grid_y][grid_z].contents) {
            let contents = ship_data.grid[grid_x][grid_y][grid_z].contents;
            let dirs = {"n": Math.PI, "s":0, "e": Math.PI / 2, "w": -Math.PI / 2}
            let object = null;
            if (contents.type == "stairs") {
              object = new Stairs(this, contents);
            } else if (contents.type == "console") {
              object = new Console(this, contents);
            }

            if(object) {
              object.position.x = ship_x * this.grid_size;
              object.position.y = ship_y * this.grid_size;
              object.position.z = ship_z * this.grid_size;

              object.rotation.y = dirs[contents.dir];

              this.add(object);
            }
          }
        }
      }
    }
  }
}
