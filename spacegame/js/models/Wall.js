class Wall extends THREE.Mesh {

  constructor(ship, ceiling, floor) {

    var wall_geometry = new THREE.Geometry();

    var panel = new Panel(ship, true);
    panel.position.y = ship.panel_size / 2 + ship.corner_padding;
    panel.position.z = ship.panel_size / 2 + ship.corner_padding;
    wall_geometry.mergeMesh(panel);

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
  }

}

class WallCorner extends THREE.Mesh {
  constructor(ship, ceiling, floor) {
    
    

    var corner_geometry = new THREE.Geometry();

    var corner = new PanelCorner(ship);
    corner.position.y = ship.panel_size / 2 + ship.corner_padding;
    corner.position.x = ship.panel_size / 2;
    corner.position.z = ship.panel_size / 2;
    corner_geometry.mergeMesh(corner);

    var geometry = new THREE.SphereGeometry(ship.corner_padding, ship.curve_detail, ship.curve_detail, 0, Math.PI / 2, 0, Math.PI / 2);

    if(ceiling) {
      var upper_vertex = new THREE.Mesh(geometry);
      upper_vertex.position.y = ship.panel_size + ship.corner_padding;
      upper_vertex.position.x = ship.panel_size / 2;
      upper_vertex.position.z = ship.panel_size / 2;
      upper_vertex.rotation.y = Math.PI / 2;
      corner_geometry.mergeMesh(upper_vertex);
    }

    if (floor) {
      var lower_vertex = new THREE.Mesh(geometry);
      lower_vertex.position.y = ship.corner_padding;
      lower_vertex.position.x = ship.panel_size / 2;
      lower_vertex.position.z = ship.panel_size / 2;
      lower_vertex.rotation.y = Math.PI / 2;
      lower_vertex.rotation.x = Math.PI / 2;
      corner_geometry.mergeMesh(lower_vertex);
    }

    corner_geometry.mergeVertices(); // optional
    super(corner_geometry);
  }
}

class WallOutsideCorner extends THREE.Mesh {
  constructor(ship, ceiling, floor) {
    
    

    var whole_geometry = new THREE.Geometry();

    var geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.panel_size, ship.curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(geometry);

    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.position.y = ship.panel_size / 2 + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.rotation.y = Math.PI;
    whole_geometry.mergeMesh(cylinder);

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 2);
    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding * 3;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding * 3;
    plane.rotation.y = Math.PI / 2; 
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    if(floor) {
      var shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      whole_geometry.mergeMesh(shoe);

      var geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2, ship.curve_detail, 1, true, 0, Math.PI / 2);
      var cylinder = new THREE.Mesh(geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.position.y = ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.rotation.x = Math.PI / 2;
      cylinder.rotation.z = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);

      var cylinder = new THREE.Mesh(geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.rotation.x = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);
    }

    if(ceiling) {
      var shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.z = Math.PI;
      shoe.rotation.y = Math.PI/2;
      whole_geometry.mergeMesh(shoe);

      var cylinder = new THREE.Mesh(geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.rotation.z = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);

      var cylinder = new THREE.Mesh(geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.rotation.z = Math.PI / 2;
      cylinder.rotation.y = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);
    }

    whole_geometry.mergeVertices(); // optional
    super(whole_geometry);
  }
}

class WallEndLeft extends THREE.Mesh {
  constructor(ship, ceiling, floor) {

    

    var whole_geometry = new THREE.Geometry();

    if (floor) {
      var shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.y = Math.PI / 2;
      whole_geometry.mergeMesh(shoe);

      var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding + ship.corner_padding, ship.curve_detail, 1, true, 0, Math.PI / 2);
      var cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2 + ship.corner_padding;
      cylinder.rotation.x = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);
    }

    if (ceiling) {
      var shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.z = Math.PI;
      shoe.rotation.y = Math.PI;
      whole_geometry.mergeMesh(shoe);

      var cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2 + ship.corner_padding;
      cylinder.rotation.x = Math.PI / 2;
      cylinder.rotation.y = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);
    }

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 2);
    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.y = Math.PI / 2;
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.panel_size, ship.curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(cylinder_geometry);

    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.position.y = ship.panel_size / 2 + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.rotation.y = -Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    whole_geometry.mergeVertices(); // optional
    super(whole_geometry);
  }
}

class WallEndRight extends THREE.Mesh {
  constructor(ship, ceiling, floor) {

    

    var whole_geometry = new THREE.Geometry();

    var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding + ship.corner_padding, ship.curve_detail, 1, true, 0, Math.PI / 2);

    if (floor) {
      var shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.y = -Math.PI / 2;
      whole_geometry.mergeMesh(shoe);

      var cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding;
      cylinder.position.y = ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.rotation.x = Math.PI / 2;
      cylinder.rotation.z = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);
    }

    if (ceiling) {
      var shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.z = Math.PI;
      shoe.rotation.y = 0;
      whole_geometry.mergeMesh(shoe);

      var cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.rotation.z = Math.PI / 2;
      whole_geometry.mergeMesh(cylinder);
    }

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding + ship.corner_padding);
    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.z = Math.PI / 2;
    whole_geometry.mergeMesh(plane);

    var geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.panel_size, ship.curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(geometry);

    cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.position.y = ship.panel_size / 2 + ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.rotation.y = Math.PI / 2;
    whole_geometry.mergeMesh(cylinder);

    whole_geometry.mergeVertices(); // optional
    super(whole_geometry);
  }
}

class WallLink extends THREE.Mesh {
  constructor(ship, ceiling, floor) {

    

    var link_geometry = new THREE.Geometry();

    var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 4, ship.curve_detail, 1, true, 0, Math.PI / 2);

    if(floor) {
      var cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.position.y = ship.corner_padding;
      cylinder.rotation.x = Math.PI / 2;
      cylinder.rotation.z = Math.PI / 2;
      link_geometry.mergeMesh(cylinder);
    }

    if (ceiling) {
      var cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.rotation.x = 0;
      cylinder.rotation.z = Math.PI / 2;
      link_geometry.mergeMesh(cylinder);
    }

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 4);

    var plane = new THREE.Mesh(plane_geometry);
    plane.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
    plane.position.y = ship.panel_size / 2 + ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.z = Math.PI / 2;
    link_geometry.mergeMesh(plane);

    link_geometry.mergeVertices(); // optional
    super(link_geometry);
  }
}
