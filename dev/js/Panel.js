class Panel extends THREE.Object3D {

  constructor(ship, transparent=false) {

    super();

    this.ship = ship;

    var geometry = new THREE.PlaneGeometry(this.ship.panel_size, this.ship.panel_size);

    if(transparent) {
      var material = new this.ship.material_type({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    } else {
      var material = new this.ship.material_type({ color: 0xffffff, side: THREE.DoubleSide });
    }

    var main_panel = new THREE.Mesh(geometry, material);

    this.add(main_panel);

    var edges = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    var boarder_width = 0.1;
    var boarder_height = 0.01;

    var material = new this.ship.material_type({ color: 0xd0dddf, side: THREE.DoubleSide });

    for (var i = 0; i < 4; i++) {
      var cylinder_geometry = new THREE.BoxGeometry(edges[i].x == 0 ? 2 : boarder_width, edges[i].y == 0 ? 2 : boarder_width, boarder_height);
      var boarder = new THREE.Mesh(cylinder_geometry, material);

      boarder.position.x = (1 - boarder_width / 2) * edges[i].x;
      boarder.position.y = (1 - boarder_width / 2) * edges[i].y;
      this.add(boarder);
    }


  }

}

class PanelCorner extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var geometry = new THREE.CylinderGeometry(this.ship.corner_padding, this.ship.corner_padding, this.ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var material = new this.ship.material_type({ color: 0xffffff, side: THREE.DoubleSide });
    var cylinder = new THREE.Mesh(geometry, material);

    this.add(cylinder);

    var boarder_width = 0.1;
    var boarder_height = 0.01;

    material = new this.ship.material_type({ color: 0xd0dddf, side: THREE.DoubleSide });

    var end_ring_geometry = new THREE.RingGeometry(this.ship.corner_padding - boarder_height / 2, this.ship.corner_padding + boarder_height / 2, curve_detail, 1, 0, Math.PI / 2);
    var end_ring = new THREE.Mesh(end_ring_geometry, material);
    end_ring.position.y = this.ship.panel_size / 2 - boarder_width;
    end_ring.rotation.x = Math.PI / 2;
    this.add(end_ring);

    end_ring = new THREE.Mesh(end_ring_geometry, material);
    end_ring.position.y = this.ship.panel_size / 2;
    end_ring.rotation.x = Math.PI / 2;
    this.add(end_ring);

    var inner_end_curve_geometry = new THREE.CylinderGeometry(this.ship.corner_padding - boarder_height / 2, this.ship.corner_padding - boarder_height / 2, boarder_width, curve_detail, 1, true, 0, Math.PI / 2);
    var end_curve = new THREE.Mesh(inner_end_curve_geometry, material);
    end_curve.position.y = this.ship.panel_size / 2 - boarder_width / 2;
    this.add(end_curve);

    var outer_end_curve_geometry = new THREE.CylinderGeometry(this.ship.corner_padding + boarder_height / 2, this.ship.corner_padding + boarder_height / 2, boarder_width, curve_detail, 1, true, 0, Math.PI / 2);
    end_curve = new THREE.Mesh(outer_end_curve_geometry, material);
    end_curve.position.y = this.ship.panel_size / 2 - boarder_width / 2;
    this.add(end_curve);

    end_ring = new THREE.Mesh(end_ring_geometry, material);
    end_ring.position.y = -this.ship.panel_size / 2;
    end_ring.rotation.x = Math.PI / 2;
    this.add(end_ring);

    end_ring = new THREE.Mesh(end_ring_geometry, material);
    end_ring.position.y = -this.ship.panel_size / 2 + boarder_width;
    end_ring.rotation.x = Math.PI / 2;
    this.add(end_ring);

    end_curve = new THREE.Mesh(inner_end_curve_geometry, material);
    end_curve.position.y = -this.ship.panel_size / 2 + boarder_width / 2;
    this.add(end_curve);

    end_curve = new THREE.Mesh(outer_end_curve_geometry, material);
    end_curve.position.y = -this.ship.panel_size / 2 + boarder_width / 2;
    this.add(end_curve);
  }
}

class PanelLink extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var geometry = new THREE.PlaneGeometry(this.ship.panel_size, this.ship.corner_padding + this.ship.void_padding / 2);
    var material = new this.ship.material_type({ color: 0xffffff, side: THREE.DoubleSide });

    var plane = new THREE.Mesh(geometry, material);
    plane.position.z = this.ship.panel_size / 2 + (this.ship.corner_padding * 2 + this.ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    this.add(plane);

    plane = new THREE.Mesh(geometry, material);
    plane.position.y = this.ship.panel_size + this.ship.corner_padding * 2;
    plane.position.z = this.ship.panel_size / 2 + (this.ship.corner_padding * 2 + this.ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    this.add(plane);

    return;
  }
}

class PanelFloorFill extends THREE.Object3D {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var geometry = new THREE.PlaneGeometry(this.ship.corner_padding + this.ship.void_padding / 2, this.ship.corner_padding + this.ship.void_padding / 2);
    var material = new this.ship.material_type({ color: 0xffffff, side: THREE.DoubleSide });

    var plane = new THREE.Mesh(geometry, material);
    plane.position.x = this.ship.panel_size / 2 + (this.ship.corner_padding * 2 + this.ship.void_padding) / 4;
    plane.position.z = this.ship.panel_size / 2 + (this.ship.corner_padding * 2 + this.ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    this.add(plane);

    plane = new THREE.Mesh(geometry, material);
    plane.position.x = this.ship.panel_size / 2 + (this.ship.corner_padding * 2 + this.ship.void_padding) / 4;
    plane.position.y = this.ship.panel_size + this.ship.corner_padding * 2;
    plane.position.z = this.ship.panel_size / 2 + (this.ship.corner_padding * 2 + this.ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    this.add(plane);

    return;
  }
}

class ColumnShoe extends THREE.Object3D {
  constructor(ship, inner_radius, slope_radius) {
    super();
    this.ship = ship;


    var curve_detail = this.ship.curve_detail;

    var vertex = new THREE.Vector3();
    var normal = new THREE.Vector3();

    //var geometry = new THREE.PlaneGeometry(this.ship.corner_padding, this.ship.corner_padding);
    var geometry = new THREE.PlaneBufferGeometry(this.ship.corner_padding, this.ship.corner_padding, curve_detail, curve_detail + 1);

    var positions = geometry.attributes.position;
    var normals = geometry.attributes.normal;

    for(let row = 0; row <= curve_detail; row++) {
      for (let column = 0; column <= curve_detail; column++) {
        let theta = column / (curve_detail) * Math.PI / 2;
        let phi = row / (curve_detail) * Math.PI / 2;

        let level_radius = inner_radius + (1 - Math.cos(phi)) * slope_radius;

        vertex.x = -Math.sin(theta) * level_radius;
        vertex.y = -Math.sin(phi) * slope_radius;
        vertex.z = -Math.cos(theta) * level_radius;

        normal.x = -Math.sin(theta) * (inner_radius + slope_radius);
        normal.y = 0;
        normal.z = -Math.cos(theta) * (inner_radius + slope_radius)

        normal.sub(vertex);
        normal.normalize();

        i = row * (curve_detail + 1) + column;

        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        normals.setXYZ(i, normal.x, normal.y, normal.z);
      }
    }

    vertex.x = -(inner_radius + slope_radius);
    vertex.y = -slope_radius;
    vertex.z = -(inner_radius + slope_radius);

    normal.x = 0;
    normal.y = 1;
    normal.z = 0;
    normal.normalize();

    for (var i = (curve_detail + 1) * (curve_detail + 1); i < positions.count; i++) {
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      normals.setXYZ(i, normal.x, normal.y, normal.z);
    }

    var material = new this.ship.material_type({ color: 0xffffff, side: THREE.DoubleSide });

    var plane = new THREE.Mesh(geometry, material);

    this.add(plane);
  }
}