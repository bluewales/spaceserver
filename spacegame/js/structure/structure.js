class Structure {
  constructor(ship, ship_data) {
    this.ship = ship;
    this.ship_data = ship_data;
  }

  check_room_boundry(config, type) {
    let v = new THREE.Vector3(config.x1, config.y1, config.z1);
    let oposite_v = new THREE.Vector3(config.x1, config.y1, config.z1).add(this.ship.wall_transforms[config.dir]);

    let cell = grid_lookup(this.ship_data.grid, v);
    let oposite_cell = grid_lookup(this.ship_data.grid, oposite_v);

    let dir = config.dir;
    let oposite_dir = this.ship.oposites[config.dir];

    if (cell) {
      if(cell.walls[dir] == type) {
        return false;
      }
      return true;
    }

    if (oposite_cell) {
      if (oposite_cell.walls[oposite_dir] == type) {
        return false;
      }
      return true;
    }

    return false;
  }

  check_wall(config) {
    return this.check_room_boundry(config, "wall");
  }

  check_door(config) {
    return this.check_room_boundry(config, "door");
  }

  check_window(config) {
    return this.check_room_boundry(config, "window");
  }

  check_room(config) {

    let x1 = Math.min(config.x1, config.x2);
    let x2 = Math.max(config.x1, config.x2);
    let y1 = Math.min(config.y1, config.y2);
    let y2 = Math.max(config.y1, config.y2);
    let z1 = Math.min(config.z1, config.z2);
    let z2 = Math.max(config.z1, config.z2);

    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      if (!this.ship_data.grid[x]) continue;
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        if (!this.ship_data.grid[x][y]) continue;
        for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) {
          if (!this.ship_data.grid[x][y][z]) continue;
          if(this.ship_data.grid[x][y][z])
            return false;
        }
      }
    }
    return true;
  }

  create_room_boundry(config, type) {

    if (!this.check_room_boundry(config, type)) return;

    let v = new THREE.Vector3(config.x1, config.y1, config.z1);
    let oposite_v = new THREE.Vector3(config.x1, config.y1, config.z1).add(this.ship.wall_transforms[config.dir]);

    let cell = grid_lookup(this.ship_data.grid, v);
    let oposite_cell = grid_lookup(this.ship_data.grid, oposite_v);

    let dir = config.dir;
    let oposite_dir = this.ship.oposites[config.dir];

    if(cell) {
      cell.walls[dir] = type;
      this.ship.cube_changed(v.x, v.y, v.z);
    }
    if (oposite_cell) {
      oposite_cell.walls[oposite_dir] = type;
      this.ship.cube_changed(oposite_v.x, oposite_v.y, oposite_v.z);
    }
  }

  create_wall(config) {
    this.create_room_boundry(config, "wall");
  }

  create_door(config) {
    this.create_room_boundry(config, "door");
  }

  create_window(config) {
    this.create_room_boundry(config, "window");
  }

  create_room(config) {
    // if(!this.check_room(config)) return;

    let x1 = Math.min(config.x1, config.x2);
    let x2 = Math.max(config.x1, config.x2);
    let y1 = Math.min(config.y1, config.y2);
    let y2 = Math.max(config.y1, config.y2);
    let z1 = Math.min(config.z1, config.z2);
    let z2 = Math.max(config.z1, config.z2);

    for (let x = x1; x <= x2; x++) {
      if (!this.ship_data.grid[x]) {
        this.ship_data.grid[x] = {};
      }
      for (let y = y1; y <= y2; y++) {
        if (!this.ship_data.grid[x][y]) {
          this.ship_data.grid[x][y] = {};
        }
        for (let z = z1; z <= z2; z++) {
          this.ship_data.grid[x][y][z] = {
            "walls": {
              "t": "ceiling",
              "b": "floor",
              "n": (z == z1) ? "wall" : 0,
              "s": (z == z2) ? "wall" : 0,
              "w": (x == x1) ? "wall" : 0,
              "e": (x == x2) ? "wall" : 0
            }
          };


          
          //   If the new cell has walls, make those walls match bordering walls of adjacent cells
          //         
          for (let dir in this.ship.wall_transforms) {
            let oposite_v = new THREE.Vector3(x, y, z).add(this.ship.wall_transforms[dir]);
            if (this.ship_data.grid[x][y][z]['walls'][dir] && grid_lookup(this.ship_data.grid, oposite_v)) {
              this.ship_data.grid[x][y][z]['walls'][dir] = grid_lookup(this.ship_data.grid, oposite_v)['walls'][this.ship.oposites[dir]];
            }
          }

          this.ship.cube_changed(x, y, z);
        }
      }
    }
  }
}