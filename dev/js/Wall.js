class Wall extends THREE.Group {

  constructor(ship) {

    super();

    this.ship = ship;

    var panel = new Panel(this.ship, true);
    panel.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    panel.position.z = this.ship.panel_size / 2 + this.ship.corner_padding;
    this.add(panel);

    var lower_corner = new PanelCorner(this.ship);
    lower_corner.position.y = this.ship.corner_padding;
    lower_corner.position.z = this.ship.panel_size / 2;
    lower_corner.rotation.x = Math.PI / 2;
    lower_corner.rotation.z = Math.PI / 2;
    this.add(lower_corner);

    var upper_corner = new PanelCorner(this.ship);
    upper_corner.position.y = this.ship.panel_size + this.ship.corner_padding;
    upper_corner.position.z = this.ship.panel_size / 2;
    upper_corner.rotation.z = Math.PI / 2;
    this.add(upper_corner);
  }

}

class WallCorner extends THREE.Group {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    

    var corner = new PanelCorner(ship);
    corner.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    corner.position.x = this.ship.panel_size / 2;
    corner.position.z = this.ship.panel_size / 2;
    this.add(corner);

    var vertex_geometry = new THREE.Geometry();

    var geometry = new THREE.SphereGeometry(this.ship.corner_padding, curve_detail, curve_detail, 0, Math.PI / 2, 0, Math.PI / 2);
    var upper_vertex = new THREE.Mesh(geometry);
    upper_vertex.position.y = this.ship.panel_size + this.ship.corner_padding;
    upper_vertex.position.x = this.ship.panel_size / 2;
    upper_vertex.position.z = this.ship.panel_size / 2;
    upper_vertex.rotation.y = Math.PI / 2;
    vertex_geometry.mergeMesh(upper_vertex);

    var lower_vertex = new THREE.Mesh(geometry);
    lower_vertex.position.y = this.ship.corner_padding;
    lower_vertex.position.x = this.ship.panel_size / 2;
    lower_vertex.position.z = this.ship.panel_size / 2;
    lower_vertex.rotation.y = Math.PI / 2;
    lower_vertex.rotation.x = Math.PI / 2;
    vertex_geometry.mergeMesh(lower_vertex);

    vertex_geometry.mergeVertices(); // optional
    this.add(new THREE.Mesh(vertex_geometry, this.ship.base_material));
  }
}

class WallOutsideCorner extends THREE.Mesh {
  constructor(ship) {
    ship = ship;

    var curve_detail = ship.curve_detail;

    var whole_geometry = new THREE.Geometry();

    var geometry = new THREE.CylinderGeometry(ship.void_padding, ship.void_padding, ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(geometry);

    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding;
    cylinder.position.y = ship.panel_size / 2 + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding;
    cylinder.rotation.y = Math.PI;
    whole_geometry.mergeMesh(cylinder);

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding);
    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding + ship.corner_padding / 2;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding + ship.corner_padding / 2;
    plane.rotation.y = Math.PI / 2; 
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    var shoe = new ColumnShoe(ship, ship.void_padding, ship.corner_padding);
    shoe.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding;
    shoe.position.y = ship.corner_padding;
    shoe.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding;
    whole_geometry.mergeMesh(shoe);

    var geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding, curve_detail, 1, true, 0, Math.PI / 2);
    var material = ship.base_material;
    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding + ship.corner_padding / 2;
    cylinder.position.y = ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = ship.panel_size / 2;
    cylinder.position.y = ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding + ship.corner_padding / 2;
    cylinder.rotation.x = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    var shoe = new ColumnShoe(ship, ship.void_padding, ship.corner_padding);
    shoe.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding;
    shoe.position.y = ship.panel_size + ship.corner_padding;
    shoe.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding;
    shoe.rotation.z = Math.PI;
    shoe.rotation.y = Math.PI/2;
    whole_geometry.mergeMesh(shoe);

    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding + ship.corner_padding / 2;
    cylinder.position.y = ship.panel_size + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2;
    cylinder.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = ship.panel_size / 2;
    cylinder.position.y = ship.panel_size + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding + ship.corner_padding / 2;
    cylinder.rotation.z = Math.PI / 2;
    cylinder.rotation.y = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    whole_geometry.mergeVertices(); // optional
    super(whole_geometry, ship.base_material);
  }
}

class WallEndLeft extends THREE.Mesh {
  constructor(ship) {

    var curve_detail = ship.curve_detail;

    var whole_geometry = new THREE.Geometry();

    var shoe = new ColumnShoe(ship, ship.void_padding/2, ship.corner_padding);
    shoe.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding/2;
    shoe.position.y = ship.corner_padding;
    shoe.position.z = ship.panel_size / 2;
    shoe.rotation.y = Math.PI / 2;
    whole_geometry.mergeMesh(shoe);

    var shoe = new ColumnShoe(ship, ship.void_padding/2, ship.corner_padding);
    shoe.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding/2;
    shoe.position.y = ship.panel_size + ship.corner_padding;
    shoe.position.z = ship.panel_size / 2;
    shoe.rotation.z = Math.PI;
    shoe.rotation.y = Math.PI;
    whole_geometry.mergeMesh(shoe);

    var geometry = new THREE.CylinderGeometry(ship.void_padding/2, ship.void_padding/2, ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var material = ship.base_material;
    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding/2;
    cylinder.position.y = ship.panel_size / 2 + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2;
    cylinder.rotation.y = -Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    whole_geometry.mergeVertices(); // optional
    super(whole_geometry, ship.base_material);
  }
}

class WallEndRight extends THREE.Mesh {
  constructor(ship) {

    var curve_detail = ship.curve_detail;

    var whole_geometry = new THREE.Geometry();

    var shoe = new ColumnShoe(ship, ship.void_padding / 2, ship.corner_padding);
    shoe.position.x = ship.panel_size / 2;
    shoe.position.y = ship.corner_padding;
    shoe.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding / 2;
    shoe.rotation.y = -Math.PI / 2;
    whole_geometry.mergeMesh(shoe);

    var shoe = new ColumnShoe(ship, ship.void_padding / 2, ship.corner_padding);
    shoe.position.x = ship.panel_size / 2;
    shoe.position.y = ship.panel_size + ship.corner_padding;
    shoe.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding / 2;
    shoe.rotation.z = Math.PI;
    shoe.rotation.y = 0;
    whole_geometry.mergeMesh(shoe);

    var geometry = new THREE.CylinderGeometry(ship.void_padding / 2, ship.void_padding / 2, ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var material = ship.base_material;
    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = ship.panel_size / 2;
    cylinder.position.y = ship.panel_size / 2 + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding + ship.void_padding / 2;
    cylinder.rotation.y = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    whole_geometry.mergeVertices(); // optional
    super(whole_geometry, ship.base_material);
  }
}

class WallLink extends THREE.Mesh {
  constructor(ship) {

    var curve_detail = ship.curve_detail;

    var link_geometry = new THREE.Geometry();

    var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2 + ship.void_padding, curve_detail, 1, true, 0, Math.PI / 2);

    var cylinder = new THREE.Mesh(cylinder_geometry);
    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding / 2;
    cylinder.position.z = ship.panel_size / 2;
    cylinder.position.y = ship.corner_padding;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(cylinder);

    var cylinder = new THREE.Mesh(cylinder_geometry);
    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding / 2;
    cylinder.position.z = ship.panel_size / 2;
    cylinder.position.y = ship.panel_size + ship.corner_padding;
    cylinder.rotation.x = 0;
    cylinder.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(cylinder);

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 2 + ship.void_padding);

    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding + ship.void_padding / 2;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(plane);

    link_geometry.mergeVertices(); // optional
    super(link_geometry, ship.base_material);
  }
}