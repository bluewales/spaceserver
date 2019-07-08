class Ship extends THREE.Object3D {

  constructor(raw) {
    super();

    this.raw = raw;

    this.panel_size = 2;
    this.corner_padding = 0.25;
    this.void_padding = 0.5;
    this.grid_size = this.panel_size + this.corner_padding * 2 + this.void_padding;

    this.curve_detail = 5;
    this.material_type = THREE.MeshPhongMaterial;

    this.base_material = new THREE.MeshToonMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.trim_material = new THREE.MeshToonMaterial({ color: 0xd0dddf, side: THREE.DoubleSide });
    this.window_material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

    var ship_data = this.raw;

    // Positive x is east
    // Positive z is south
    
    for (let grid_x = 0; grid_x < ship_data.grid.length; grid_x += 1) {
      let ship_x = grid_x + ship_data.grid_offset.x;

      for (let grid_y = 0; grid_y < ship_data.grid[grid_x].length; grid_y += 1) {
        let ship_y = grid_y + ship_data.grid_offset.y;

        for (let grid_z = 0; grid_z < ship_data.grid[grid_x][grid_y].length; grid_z += 1) {
          let ship_z = grid_z + ship_data.grid_offset.z;

          if (!ship_data.grid[grid_x][grid_y][grid_z]) continue;

          let wall_config = {
            "grid": ship_data.grid[grid_x][grid_y][grid_z],
            "n": ship_data.grid[grid_x][grid_y][grid_z - 1],
            "s": ship_data.grid[grid_x][grid_y][grid_z + 1],
            "e": (ship_data.grid[grid_x + 1] && ship_data.grid[grid_x + 1][grid_y]) ? ship_data.grid[grid_x + 1][grid_y][grid_z] : undefined,
            "w": (ship_data.grid[grid_x - 1] && ship_data.grid[grid_x - 1][grid_y]) ? ship_data.grid[grid_x - 1][grid_y][grid_z] : undefined
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
