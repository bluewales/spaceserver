class Door extends MixedMesh {

  get is_door() {return true;}
  constructor(ship, ceiling, floor) {

    var door_geometry = new THREE.Geometry();

    var door_width = ship.panel_size * 4 / 8;


    let bottom_left_jamb_corner = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
    bottom_left_jamb_corner.rotation.x = Math.PI / 2;
    bottom_left_jamb_corner.rotation.y = Math.PI / 2;
    bottom_left_jamb_corner.position.x = -door_width / 2 + ship.corner_padding * 2;
    bottom_left_jamb_corner.position.y = ship.corner_padding * 3;
    bottom_left_jamb_corner.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(bottom_left_jamb_corner);

    let top_left_jamb_corner = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
    top_left_jamb_corner.rotation.x = Math.PI / 2;
    top_left_jamb_corner.position.x = -door_width / 2 + ship.corner_padding * 2;
    top_left_jamb_corner.position.y = ship.panel_size - ship.corner_padding;
    top_left_jamb_corner.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(top_left_jamb_corner);

    let left_jamb = new PanelCorner(ship, ship.panel_size - ship.corner_padding  * 4);
    left_jamb.rotation.y = Math.PI / 2;
    left_jamb.position.x = -door_width / 2;
    left_jamb.position.y = ship.panel_size / 2 + ship.corner_padding;
    left_jamb.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(left_jamb);

    let bottom_jamb = new PanelCorner(ship, door_width - ship.corner_padding * 4);
    bottom_jamb.rotation.y = Math.PI;
    bottom_jamb.rotation.z = Math.PI / 2;
    bottom_jamb.position.y = ship.corner_padding;
    bottom_jamb.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(bottom_jamb);

    let top_jamb = new PanelCorner(ship, door_width - ship.corner_padding * 4);
    top_jamb.rotation.x = Math.PI;
    top_jamb.rotation.z = Math.PI / 2;
    top_jamb.position.y = ship.panel_size + ship.corner_padding;
    top_jamb.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(top_jamb);

    let bottom_right_jamb_corner = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
    bottom_right_jamb_corner.rotation.x = Math.PI / 2;
    bottom_right_jamb_corner.rotation.y = Math.PI;
    bottom_right_jamb_corner.position.x = door_width / 2 - ship.corner_padding * 2;
    bottom_right_jamb_corner.position.y = ship.corner_padding * 3;
    bottom_right_jamb_corner.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(bottom_right_jamb_corner);

    let top_right_jamb_corner = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
    top_right_jamb_corner.rotation.x = Math.PI / 2;
    top_right_jamb_corner.rotation.y = -Math.PI / 2;
    top_right_jamb_corner.position.x = door_width / 2 - ship.corner_padding * 2;
    top_right_jamb_corner.position.y = ship.panel_size - ship.corner_padding;
    top_right_jamb_corner.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(top_right_jamb_corner);

    let right_jamb = new PanelCorner(ship, ship.panel_size - ship.corner_padding * 4);
    right_jamb.rotation.y = Math.PI;
    right_jamb.position.x = door_width / 2;
    right_jamb.position.y = ship.panel_size / 2 + ship.corner_padding;
    right_jamb.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    door_geometry.mergeMesh(right_jamb);

    for (var index in door_geometry.faces) {
      door_geometry.faces[index].color = ship.decoration_color;
    }

    let right_panel_geometry = new THREE.PlaneGeometry((ship.panel_size - door_width) / 2, ship.panel_size);
    let right_panel = new THREE.Mesh(right_panel_geometry);
    right_panel.position.y = ship.panel_size / 2 + ship.corner_padding;
    right_panel.position.x = -(ship.panel_size + door_width) / 4;
    right_panel.position.z = ship.panel_size / 2 + ship.corner_padding;
    door_geometry.mergeMesh(right_panel);

    let left_panel_geometry = new THREE.PlaneGeometry((ship.panel_size - door_width) / 2, ship.panel_size);
    let left_panel = new THREE.Mesh(left_panel_geometry);
    left_panel.position.y = ship.panel_size / 2 + ship.corner_padding;
    left_panel.position.x = (ship.panel_size + door_width) / 4;
    left_panel.position.z = ship.panel_size / 2 + ship.corner_padding;
    door_geometry.mergeMesh(left_panel);


    /*
    var panel = new Panel(ship, true);
    
    panel.position.z = ship.panel_size / 2 + ship.corner_padding;
    door_geometry.mergeMesh(panel);
    */

    
    if (floor) {
      var lower_corner = new PanelCorner(ship);
      lower_corner.position.y = ship.corner_padding;
      lower_corner.position.z = ship.panel_size / 2;
      lower_corner.rotation.x = Math.PI / 2;
      lower_corner.rotation.z = Math.PI / 2;
      door_geometry.mergeMesh(lower_corner);
    }

    if (ceiling) {
      var upper_corner = new PanelCorner(ship);
      upper_corner.position.y = ship.panel_size + ship.corner_padding;
      upper_corner.position.z = ship.panel_size / 2;
      upper_corner.rotation.z = Math.PI / 2;
      door_geometry.mergeMesh(upper_corner);
    }

    door_geometry.mergeVertices(); // optional
    super(door_geometry);

    let right_door_geometry = new THREE.PlaneGeometry(door_width / 2, ship.panel_size, 2, 1);
    right_door_geometry.vertices[1].x = door_width / 4 - ship.corner_padding * (1 / 4);
    right_door_geometry.vertices[2].z = ship.corner_padding * (1 / 4);
    right_door_geometry.vertices[4].x = door_width / 4 - ship.corner_padding * (1 / 4);
    right_door_geometry.vertices[5].z = ship.corner_padding * (1 / 4);
    right_door_geometry.computeFaceNormals();
    right_door_geometry.computeFlatVertexNormals();
    let right_door_material = ship.base_material;
    this.right_door = new THREE.Mesh(right_door_geometry, right_door_material);
    this.add(this.right_door);
    this.right_door.position.x = -door_width / 4;
    this.right_door.position.y = ship.panel_size / 2 + ship.corner_padding;
    this.right_door.position.z = ship.panel_size / 2 + ship.corner_padding * (1 + 3/4);

    let left_door_geometry = new THREE.PlaneGeometry(door_width / 2, ship.panel_size, 2, 1);
    left_door_geometry.vertices[0].z = ship.corner_padding * (1 / 4);
    left_door_geometry.vertices[1].x = -door_width / 4 + ship.corner_padding * (1 / 4);
    left_door_geometry.vertices[3].z = ship.corner_padding * (1 / 4);
    left_door_geometry.vertices[4].x = -door_width / 4 + ship.corner_padding * (1 / 4);
    
    left_door_geometry.computeFaceNormals();
    left_door_geometry.computeFlatVertexNormals();
    let left_door_material = ship.base_material;
    this.left_door = new THREE.Mesh(left_door_geometry, left_door_material);
    this.add(this.left_door);
    this.left_door.position.x = door_width / 4;
    this.left_door.position.y = ship.panel_size / 2 + ship.corner_padding;
    this.left_door.position.z = ship.panel_size / 2 + ship.corner_padding * (1 + 3 / 4);

    this.close_position = door_width / 4;
    this.open_position = door_width * 3 / 4 - ship.corner_padding * 3 / 2;
    this.door_position = this.close_position;
    this.target_position = this.close_position;

    this.open_button = new Button(ship);
    this.add(this.open_button);
    this.open_button.position.x = -door_width / 2 - (ship.panel_size - door_width) / 4;
    this.open_button.position.y = 1.6;
    this.open_button.position.z = ship.panel_size / 2 + ship.corner_padding;
    this.open_button.on_press = function() {
      if (this.door_position == this.close_position) {
        this.open();
      }
      if (this.door_position == this.open_position) {
        this.close();
      } 
      
    }.bind(this);

    this.t = 0;
    this.door_time = 400;

    this.current_tick = undefined;
    this.linked_door = undefined;
  }

  set door_position(value) {
    this._door_position = value;
    this.left_door.position.x = value;
    this.right_door.position.x = -value;
  }

  get door_position() {
    return this._door_position;
  }


  link(door) {
    if(this.linked_door !== door) {
      this.linked_door = door;
      door.link(this);
    }
  }


  open() {
    this.stop_moving();
    this.current_tick = register_tick(this.move.bind(this));
    this.target_position = this.open_position;
    if (this.linked_door) this.linked_door.stop_moving();
  }

  close() {
    this.stop_moving();
    this.current_tick = register_tick(this.move.bind(this));
    this.target_position = this.close_position;
    if (this.linked_door) this.linked_door.stop_moving();
  }

  move(dt) {
    if(this.target_position != this.door_position) {
      let dif = this.target_position - this.door_position;
      let delta = (this.open_position - this.close_position) / this.door_time * dt;

      if(dif > 0) {
        this.door_position += delta;
        if(this.door_position > this.target_position) {
          this.door_position = this.target_position;
        }
      } else {
        this.door_position -= delta;
        if (this.door_position < this.target_position) {
          this.door_position = this.target_position;
        }
      }
      

      if (this.linked_door) this.linked_door.door_position = this.door_position;
      this.t = 0;
    }
    if(this.door_position == this.open_position){
      this.t += dt;
      if (this.t > 5000) {
        this.target_position = this.close_position;
      }
    }
    if (this.door_position == this.close_position) {
      this.stop_moving();
    }
  }

  stop_moving() {
    remove_tick(this.current_tick);
    this.current_tick = undefined;
  }
}
