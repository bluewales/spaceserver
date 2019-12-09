class Window extends MixedMesh {

  constructor(ship, ceiling, floor) {

    var wall_geometry = new THREE.Geometry();

    if (floor) {
      var lower_corner = new PanelCorner(ship);
      lower_corner.position.y = ship.corner_padding;
      lower_corner.position.z = ship.panel_size / 2;
      lower_corner.rotation.x = Math.PI / 2;
      lower_corner.rotation.z = Math.PI / 2;
      wall_geometry.mergeMesh(lower_corner);
    }

    if (ceiling) {
      var upper_corner = new PanelCorner(ship);
      upper_corner.position.y = ship.panel_size + ship.corner_padding;
      upper_corner.position.z = ship.panel_size / 2;
      upper_corner.rotation.z = Math.PI / 2;
      wall_geometry.mergeMesh(upper_corner);
    }

    wall_geometry.mergeVertices(); // optional
    super(wall_geometry);

    var window_geometry = new THREE.Geometry();
    

    var geometry = new THREE.PlaneGeometry(ship.panel_size, ship.panel_size);
    var window_pane = new THREE.Mesh(geometry);
    

    window_pane.position.y = ship.panel_size / 2 + ship.corner_padding;
    window_pane.position.z = ship.panel_size / 2 + ship.corner_padding;
    window_geometry.mergeMesh(window_pane);
    this.add(new THREE.Mesh(window_geometry, ship.window_material));

  }

}