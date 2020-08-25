class GridCube extends THREE.Object3D {

  constructor(ship, cube_data) {

    super();

    this.ship = ship;
    
    let floor = new Panel(this.ship);
    floor.rotation.x = Math.PI / 2;
    this.add(floor);
    
    let ceiling = new Panel(this.ship);
    ceiling.position.y = this.ship.panel_size + 2 * this.ship.corner_padding;
    ceiling.rotation.x = Math.PI / 2;
    this.add(ceiling);

    var keys = [
      [{ x: 0, z: 1 }, { x: 1, z: 2 }, { x: 2, z: 1 }, { x: 1, z: 0 }],
      [{ x: 1, z: 0 }, { x: 2, z: -1 }, { x: 1, z: -2 }, { x: 0, z: -1 }],
      [{ x: 0, z: -1 }, { x: -1, z: -2 }, { x: -2, z: -1 }, { x: -1, z: 0 }],
      [{ x: -1, z: 0 }, { x: -2, z: 1 }, { x: -1, z: 2 }, { x: 0, z: 1 }],
    ];


    for(var i = 0; i < keys.length; i++) {
      let key = keys[i];

      let rotation = i * Math.PI/2;

      if (cube_data[key[0].z][key[0].x]) {
        var wall = new Wall(this.ship);
        wall.rotation.y = rotation;
        this.add(wall);
      } else {
        var link = new PanelLink(this.ship);
        link.rotation.y = rotation;
        this.add(link);
      }

      if (cube_data[key[0].z][key[0].x] && cube_data[key[3].z][key[3].x]) {
        var wall_corner = new WallCorner(this.ship);
        wall_corner.rotation.y = rotation;
        this.add(wall_corner);
      } else if (cube_data[key[0].z][key[0].x] && cube_data[key[2].z][key[2].x]) {
        var wall_link = new WallLink(this.ship);
        wall_link.rotation.y = rotation;
        this.add(wall_link);
      } else if (!cube_data[key[0].z][key[0].x] && !cube_data[key[1].z][key[1].x] && !cube_data[key[2].z][key[2].x] && !cube_data[key[3].z][key[3].x]) {
        var floor_fill = new PanelFloorFill(this.ship);
        floor_fill.rotation.y = rotation;
        this.add(floor_fill);
      } else if (!cube_data[key[0].z][key[0].x] && cube_data[key[1].z][key[1].x] && cube_data[key[2].z][key[2].x] && !cube_data[key[3].z][key[3].x]) {
        var outside_corner = new WallOutsideCorner(this.ship);
        outside_corner.rotation.y = rotation;
        this.add(outside_corner);
      } else if (!cube_data[key[0].z][key[0].x] && !cube_data[key[1].z][key[1].x] && !cube_data[key[2].z][key[2].x] && cube_data[key[3].z][key[3].x]) {
        var wall_end = new WallEndLeft(this.ship);
        wall_end.rotation.y = rotation;
        this.add(wall_end);
      } else if (!cube_data[key[0].z][key[0].x] && !cube_data[key[1].z][key[1].x] && cube_data[key[2].z][key[2].x] && !cube_data[key[3].z][key[3].x]) {
        var floor_fill = new PanelFloorFill(this.ship);
        floor_fill.rotation.y = rotation;
        this.add(floor_fill);
      } else if (!cube_data[key[0].z][key[0].x] && cube_data[key[1].z][key[1].x] && !cube_data[key[2].z][key[2].x] && !cube_data[key[3].z][key[3].x]) {
        var floor_fill = new PanelFloorFill(this.ship);
        floor_fill.rotation.y = rotation;
        this.add(floor_fill);
      } else if (cube_data[key[0].z][key[0].x] && !cube_data[key[1].z][key[1].x] && !cube_data[key[2].z][key[2].x] && !cube_data[key[3].z][key[3].x]) {
        var wall_end = new WallEndRight(this.ship);
        wall_end.rotation.y = rotation;
        this.add(wall_end);
      }
    }
  }
}
