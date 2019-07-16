class CrownFlatLink extends THREE.Mesh {

  constructor(ship) {
    var crown_geometry = new THREE.Geometry();

    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 4);
    var plane = new THREE.Mesh(plane_geometry);
    plane.position.y = ship.grid_size - ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    crown_geometry.mergeMesh(plane);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }

}

class CrownCornerLink extends THREE.Mesh {

  constructor(ship) {

    var crown_geometry = new THREE.Geometry();

    var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 4, ship.curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(cylinder_geometry);
    cylinder.position.x = ship.panel_size / 2;
    cylinder.position.y = ship.grid_size - ship.corner_padding;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding - ship.corner_padding;
    crown_geometry.mergeMesh(cylinder);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }

}

class CrownCornerFlatFill extends THREE.Mesh {

  constructor(ship) {
    var crown_geometry = new THREE.Geometry();

    var plane_geometry = new THREE.PlaneGeometry(ship.corner_padding * 2, ship.corner_padding * 4);
    var plane = new THREE.Mesh(plane_geometry);

    plane.position.x = ship.panel_size / 2 + ship.corner_padding;
    plane.position.y = ship.grid_size - ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    crown_geometry.mergeMesh(plane);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }
}

class CrownCornerPerpendicularFill extends THREE.Mesh {

  constructor(ship) {
    var crown_geometry = new THREE.Geometry();

    var plane_geometry = new THREE.PlaneGeometry(ship.corner_padding * 2, ship.corner_padding * 4);
    var plane = new THREE.Mesh(plane_geometry);

    plane.position.x = ship.panel_size / 2 + ship.corner_padding;
    plane.position.y = ship.grid_size - ship.corner_padding;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    plane.rotation.y = Math.PI / 2;
    crown_geometry.mergeMesh(plane);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }

}

class CrownOutsideFloorCorner extends THREE.Mesh {
  constructor(ship) {

    var crown_geometry = new THREE.Geometry();


    var cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.panel_size, ship.curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(cylinder_geometry);
    cylinder.position.y = ship.panel_size + ship.corner_padding * 3;
    cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
    cylinder.rotation.x = -Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;
    crown_geometry.mergeMesh(cylinder);


    var plane_geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 2);

    var plane = new THREE.Mesh(plane_geometry);
    plane.position.y = ship.panel_size + ship.corner_padding*4;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding*2 + ship.corner_padding;
    plane.rotation.x = Math.PI / 2;
    crown_geometry.mergeMesh(plane);

    var plane = new THREE.Mesh(plane_geometry);
    plane.position.y = ship.panel_size + ship.corner_padding * 2;
    plane.position.z = ship.panel_size / 2 + ship.corner_padding;
    crown_geometry.mergeMesh(plane);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }
}

class CrownOutsideCeilingCorner extends THREE.Mesh {
  constructor(ship) {

    var crown_geometry = new THREE.Geometry();
    var corner = new CrownOutsideFloorCorner(ship);
    corner.position.y = ship.grid_size + ship.panel_size + ship.corner_padding * 2;
    corner.rotation.z = Math.PI;
    crown_geometry.mergeMesh(corner);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }
}

class CrownMultiCorner extends THREE.Mesh {
  constructor(ship, c) {

    let crown_geometry = new THREE.Geometry();

    if (c.forward_wall && c.left_wall && !c.top_cell_forward_wall && c.top_cell_left_wall) {
      let shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2;
      shoe.position.y = ship.panel_size + ship.corner_padding * 3;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.x = Math.PI / 2;
      shoe.rotation.z = Math.PI / 2;
      crown_geometry.mergeMesh(shoe);
    }

    if (c.forward_wall && c.left_wall ){
      let cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2, ship.curve_detail, 1, true, 0, Math.PI / 2);
      let cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.panel_size + ship.corner_padding*2;
      cylinder.position.z = ship.panel_size / 2;
      crown_geometry.mergeMesh(cylinder);
    }

    if (!c.top_cell_forward_wall && c.top_cell_left_wall && c.top_forward_cell_left_wall && c.top_forward_cell_bottom_wall && !c.top_forward_cell_near_wall) {
      let cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2, ship.curve_detail, 1, true, 0, Math.PI / 2);
      let cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.panel_size + ship.corner_padding * 5;
      cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.rotation.x = Math.PI / 2;
      crown_geometry.mergeMesh(cylinder);

    }

    if (c.forward_wall && c.left_wall && c.top_cell_forward_wall && !c.top_cell_left_wall) {
      let shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding * 3;
      shoe.position.z = ship.panel_size / 2;
      shoe.rotation.y = Math.PI / 2;
      shoe.rotation.z = -Math.PI / 2;
      crown_geometry.mergeMesh(shoe);
    }

    if (c.top_cell_forward_wall && !c.top_cell_left_wall && !c.top_left_cell_forward_wall && !c.top_left_cell_near_wall) {
      let shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding * 5;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.y = -Math.PI / 2;
      crown_geometry.mergeMesh(shoe);
    }

    if (!c.forward_wall && !c.forward_cell_near_wall && c.forward_cell_top_wall && c.left_wall && c.top_cell_left_wall && c.top_cell_forward_wall) {
      let shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2;
      shoe.position.y = ship.panel_size + ship.corner_padding * 3;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.z = Math.PI / 2;
      crown_geometry.mergeMesh(shoe);
    }

    if (c.top_cell_forward_wall && c.top_cell_left_wall) {
      let cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2, ship.curve_detail, 1, true, 0, Math.PI / 2);
      let cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2;
      cylinder.position.y = ship.panel_size + ship.corner_padding * 4;
      cylinder.position.z = ship.panel_size / 2;
      crown_geometry.mergeMesh(cylinder);
    }

    if (c.forward_wall && !c.left_wall && c.top_cell_left_wall && c.top_cell_forward_wall && !c.left_cell_near_wall && c.left_cell_top_wall) {
      let shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding * 3;
      shoe.position.z = ship.panel_size / 2;
      shoe.rotation.x = -Math.PI / 2;
      crown_geometry.mergeMesh(shoe);
    }

    if (c.left_cell_forward_wall && c.left_cell_top_wall && !c.left_cell_near_wall) {
      let cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2, ship.curve_detail, 1, true, 0, Math.PI / 2);
      let cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2;
      cylinder.rotation.z = Math.PI / 2;
      crown_geometry.mergeMesh(cylinder);
    }

    if (!c.forward_wall && c.left_wall && !c.forward_cell_left_wall && c.forward_cell_top_wall && !c.forward_cell_near_wall) {
      let shoe = new ColumnShoe(ship, ship.corner_padding, ship.corner_padding);
      shoe.position.x = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.position.y = ship.panel_size + ship.corner_padding;
      shoe.position.z = ship.panel_size / 2 + ship.corner_padding * 2;
      shoe.rotation.x = Math.PI;
      crown_geometry.mergeMesh(shoe);
    }

    if (c.forward_left_cell_back_wall && c.forward_left_cell_top_wall && !c.forward_left_cell_right_wall && !c.forward_cell_near_wall) {
      let cylinder_geometry = new THREE.CylinderGeometry(ship.corner_padding, ship.corner_padding, ship.corner_padding * 2, ship.curve_detail, 1, true, 0, Math.PI / 2);
      let cylinder = new THREE.Mesh(cylinder_geometry);
      cylinder.position.x = ship.panel_size / 2 + ship.corner_padding * 3;
      cylinder.position.y = ship.panel_size + ship.corner_padding;
      cylinder.position.z = ship.panel_size / 2 + ship.corner_padding * 4;
      cylinder.rotation.x = -Math.PI / 2;
      cylinder.rotation.z = Math.PI / 2;
      crown_geometry.mergeMesh(cylinder);
    }



    // let sphere_geometry = new THREE.SphereGeometry(0.1, 32, 32);
    // let sphere = new THREE.Mesh(sphere_geometry);
    // sphere.position.x = ship.panel_size / 2;
    // sphere.position.y = ship.panel_size + ship.corner_padding;
    // sphere.position.z = ship.panel_size / 2;
    // crown_geometry.mergeMesh(sphere);

    crown_geometry.mergeVertices(); // optional
    super(crown_geometry);
  }
}