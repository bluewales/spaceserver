class Ship extends THREE.Object3D {

  constructor() {

    super();

    this.panel_size = 2;
    this.corner_padding = 0.25;
    this.void_padding = 0.5;
    this.grid_size = this.panel_size + this.corner_padding * 2 + this.void_padding;

    this.curve_detail = 8;
    this.material_type = THREE.MeshLambertMaterial;


    var ship_data = {
      grid_offset: {
        x: -2, y: 0, z: -2
      },
      grid: [
        [
          " - - - - - ",
          "|o o o o o|",
          "           ",
          "|o o|o|o o|",
          " - -   - - ",
          "|o o o o o|",
          "           ",
          "|o o o o o|",
          "           ",
          "|o o o o o|",
          " - - - - - "
        ],
        [
          " - - - - - ",
          "|o o o o o|",
          "   -       ",
          "|o|o o o o|",
          "           ",
          "|o|o o o o|",
          "   - - - - ",
          "|o|o o o o|",
          "           ",
          "|o o o o o|",
          " - - - - - "
        ]
      ]
    };
/*
    ship_data.grid = [
      [
        " - - ",
        "|o o|",
        "     ",
        "|o o|",
        " - - "
      ]
    ];
*/
    for (let grid_y = 0; grid_y < ship_data.grid.length; grid_y += 1) {
      let ship_y = grid_y + ship_data.grid_offset.y;

      for (let grid_z = 1; grid_z < ship_data.grid[grid_y].length; grid_z += 2) {
        let ship_z = (grid_z - 1) / 2 + ship_data.grid_offset.z;

        for (let grid_x = 1; grid_x < ship_data.grid[grid_y][grid_z].length; grid_x += 2) {
          let ship_x = (grid_x - 1) / 2 + ship_data.grid_offset.x;

          if (ship_data.grid[grid_y][grid_z][grid_x] != 'o') continue;

          let wall_config = [];

          for (let wall_z = -2; wall_z <= 2; wall_z += 1) {
            wall_config[wall_z] = [];

            for (let wall_x = -2; wall_x <= 2; wall_x += 1) {
              let wall = false;
              if (ship_data.grid[grid_y][grid_z + wall_z]) {
                if (ship_data.grid[grid_y][grid_z + wall_z][grid_x + wall_x] == '-' || ship_data.grid[grid_y][grid_z + wall_z][grid_x + wall_x] == '|') {
                  wall = true;
                }
              }
              wall_config[wall_z][wall_x] = wall;
            }
          }
          
          var cube = new GridCube(this, wall_config);

          cube.position.x = ship_x * this.grid_size;
          cube.position.y = ship_y * this.grid_size;
          cube.position.z = ship_z * this.grid_size;

          this.add(cube);
        }
      }
    }
  }
}
