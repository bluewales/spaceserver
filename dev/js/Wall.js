class Wall extends THREE.Object3D {

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

class WallCorner extends THREE.Object3D {
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

class WallOutsideCorner extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var whole_geometry = new THREE.Geometry();

    var geometry = new THREE.CylinderGeometry(this.ship.void_padding, this.ship.void_padding, this.ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var material = this.ship.base_material;
    var cylinder = new THREE.Mesh(geometry);

    cylinder.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding;
    cylinder.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding;
    cylinder.rotation.y = Math.PI;
    whole_geometry.mergeMesh(cylinder);

    var material = this.ship.base_material;
    var plane_geometry = new THREE.PlaneGeometry(this.ship.panel_size, this.ship.corner_padding);
    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding + this.ship.corner_padding / 2;
    plane.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    plane.position.z = this.ship.panel_size / 2 + this.ship.corner_padding;
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    plane = new THREE.Mesh(plane_geometry);
    plane.position.x = this.ship.panel_size / 2 + this.ship.corner_padding;
    plane.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    plane.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding + this.ship.corner_padding / 2;
    plane.rotation.y = Math.PI / 2; 
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    var shoe = new ColumnShoe(this.ship, this.ship.void_padding, this.ship.corner_padding);
    shoe.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding;
    shoe.position.y = this.ship.corner_padding;
    shoe.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding;
    this.add(shoe);

    var geometry = new THREE.CylinderGeometry(this.ship.corner_padding, this.ship.corner_padding, this.ship.corner_padding, curve_detail, 1, true, 0, Math.PI / 2);
    var material = this.ship.base_material;
    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding + this.ship.corner_padding / 2;
    cylinder.position.y = this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    

    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = this.ship.panel_size / 2;
    cylinder.position.y = this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding + this.ship.corner_padding / 2;
    cylinder.rotation.x = Math.PI / 2;
    //cylinder.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    var shoe = new ColumnShoe(this.ship, this.ship.void_padding, this.ship.corner_padding);
    shoe.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding;
    shoe.position.y = this.ship.panel_size + this.ship.corner_padding;
    shoe.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding;
    shoe.rotation.z = Math.PI;
    shoe.rotation.y = Math.PI/2;
    this.add(shoe);

    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding + this.ship.corner_padding / 2;
    cylinder.position.y = this.ship.panel_size + this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2;
    cylinder.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    var cylinder = new THREE.Mesh(geometry);
    cylinder.position.x = this.ship.panel_size / 2;
    cylinder.position.y = this.ship.panel_size + this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding + this.ship.corner_padding / 2;
    cylinder.rotation.z = Math.PI / 2;
    cylinder.rotation.y = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    whole_geometry.mergeVertices(); // optional
    this.add(new THREE.Mesh(whole_geometry, this.ship.base_material));
  }
}

class WallEndLeft extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var shoe = new ColumnShoe(this.ship, this.ship.void_padding/2, this.ship.corner_padding);
    shoe.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding/2;
    shoe.position.y = this.ship.corner_padding;
    shoe.position.z = this.ship.panel_size / 2;
    shoe.rotation.y = Math.PI / 2;
    this.add(shoe);

    var shoe = new ColumnShoe(this.ship, this.ship.void_padding/2, this.ship.corner_padding);
    shoe.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding/2;
    shoe.position.y = this.ship.panel_size + this.ship.corner_padding;
    shoe.position.z = this.ship.panel_size / 2;
    shoe.rotation.z = Math.PI;
    shoe.rotation.y = Math.PI;
    this.add(shoe);

    var geometry = new THREE.CylinderGeometry(this.ship.void_padding/2, this.ship.void_padding/2, this.ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var material = this.ship.base_material;
    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding/2;
    cylinder.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2;
    cylinder.rotation.y = -Math.PI / 2;
    this.add(cylinder);
  }
}

class WallEndRight extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var shoe = new ColumnShoe(this.ship, this.ship.void_padding / 2, this.ship.corner_padding);
    shoe.position.x = this.ship.panel_size / 2;
    shoe.position.y = this.ship.corner_padding;
    shoe.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding / 2;
    shoe.rotation.y = -Math.PI / 2;
    this.add(shoe);

    var shoe = new ColumnShoe(this.ship, this.ship.void_padding / 2, this.ship.corner_padding);
    shoe.position.x = this.ship.panel_size / 2;
    shoe.position.y = this.ship.panel_size + this.ship.corner_padding;
    shoe.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding / 2;
    shoe.rotation.z = Math.PI;
    shoe.rotation.y = 0;
    this.add(shoe);

    var geometry = new THREE.CylinderGeometry(this.ship.void_padding / 2, this.ship.void_padding / 2, this.ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var material = this.ship.base_material;
    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = this.ship.panel_size / 2;
    cylinder.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    cylinder.position.z = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding / 2;
    cylinder.rotation.y = Math.PI / 2;
    this.add(cylinder);
  }
}

class WallLink extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var link_geometry = new THREE.Geometry();

    var cylinder_geometry = new THREE.CylinderGeometry(this.ship.corner_padding, this.ship.corner_padding, this.ship.corner_padding * 2 + this.ship.void_padding, curve_detail, 1, true, 0, Math.PI / 2);

    var cylinder = new THREE.Mesh(cylinder_geometry);
    cylinder.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding / 2;
    cylinder.position.z = this.ship.panel_size / 2;
    cylinder.position.y = this.ship.corner_padding;
    cylinder.rotation.x = Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(cylinder);

    var cylinder = new THREE.Mesh(cylinder_geometry);
    cylinder.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding / 2;
    cylinder.position.z = this.ship.panel_size / 2;
    cylinder.position.y = this.ship.panel_size + this.ship.corner_padding;
    cylinder.rotation.x = 0;
    cylinder.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(cylinder);

    var plane_geometry = new THREE.PlaneGeometry(this.ship.panel_size, this.ship.corner_padding * 2 + this.ship.void_padding);

    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = this.ship.panel_size / 2 + this.ship.corner_padding + this.ship.void_padding / 2;
    plane.position.y = this.ship.panel_size / 2 + this.ship.corner_padding;
    plane.position.z = this.ship.panel_size / 2 + this.ship.corner_padding
    plane.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(plane);

    link_geometry.mergeVertices(); // optional
    this.add(new THREE.Mesh(link_geometry, this.ship.base_material));
  }
}