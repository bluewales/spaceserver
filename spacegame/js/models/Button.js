class Button extends THREE.Mesh {
  get is_door() { return true; }
  constructor(ship) {

    let cube_geometry = new THREE.BoxGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding);
    
    for (var index in cube_geometry.faces) {
      cube_geometry.faces[index].color = ship.decoration_color;
    }

    super(cube_geometry, ship.base_material);
  }

  select() {
    // console.log("button clicked");
    if(this.on_press) {
      this.on_press();
    }
  }
}
