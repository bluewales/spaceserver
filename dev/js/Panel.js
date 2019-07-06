class Panel extends THREE.Group {
  constructor(ship, transparent=false) {

    super();

    this.ship = ship;

    var geometry = new THREE.PlaneGeometry(this.ship.panel_size, this.ship.panel_size);

    if(transparent) {
      var material = this.ship.window_material;
    } else {
      var material = this.ship.base_material;
    }

    this.add(new THREE.Mesh(geometry, material));

    var edges = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    var boarder_width = 0.1;
    var boarder_height = 0.01;

    var trim_geometry = new THREE.Geometry();

    for (var i = 0; i < 4; i++) {
      var cylinder_geometry = new THREE.BoxGeometry(edges[i].x == 0 ? 2 : boarder_width, edges[i].y == 0 ? 2 : boarder_width, boarder_height);
      var boarder = new THREE.Mesh(cylinder_geometry);

      boarder.position.x = (1 - boarder_width / 2) * edges[i].x;
      boarder.position.y = (1 - boarder_width / 2) * edges[i].y;
      trim_geometry.mergeMesh(boarder);
    }

    trim_geometry.mergeVertices(); // optional
    this.add(new THREE.Mesh(trim_geometry, this.ship.trim_material));
  }
}

class PanelCorner extends THREE.Group {
  constructor(ship) {
    super();
    this.ship = ship;

    var curve_detail = this.ship.curve_detail;

    var geometry = new THREE.CylinderGeometry(this.ship.corner_padding, this.ship.corner_padding, this.ship.panel_size, curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(geometry, this.ship.base_material);

    this.add(cylinder);

    var trim_geometry = new THREE.Geometry();

    var boarder_width = 0.1;
    var boarder_height = 0.01;

    var end_ring_geometry = new THREE.RingGeometry(this.ship.corner_padding - boarder_height / 2, this.ship.corner_padding + boarder_height / 2, curve_detail, 1, 0, Math.PI / 2);
    var end_ring = new THREE.Mesh(end_ring_geometry);
    end_ring.position.y = this.ship.panel_size / 2 - boarder_width;
    end_ring.rotation.x = Math.PI / 2;
    trim_geometry.mergeMesh(end_ring);

    var end_ring = new THREE.Mesh(end_ring_geometry);
    end_ring.position.y = this.ship.panel_size / 2;
    end_ring.rotation.x = Math.PI / 2;
    trim_geometry.mergeMesh(end_ring);

    var inner_end_curve_geometry = new THREE.CylinderGeometry(this.ship.corner_padding - boarder_height / 2, this.ship.corner_padding - boarder_height / 2, boarder_width, curve_detail, 1, true, 0, Math.PI / 2);
    var end_curve = new THREE.Mesh(inner_end_curve_geometry);
    end_curve.position.y = this.ship.panel_size / 2 - boarder_width / 2;
    trim_geometry.mergeMesh(end_curve);

    var outer_end_curve_geometry = new THREE.CylinderGeometry(this.ship.corner_padding + boarder_height / 2, this.ship.corner_padding + boarder_height / 2, boarder_width, curve_detail, 1, true, 0, Math.PI / 2);
    var end_curve = new THREE.Mesh(outer_end_curve_geometry);
    end_curve.position.y = this.ship.panel_size / 2 - boarder_width / 2;
    trim_geometry.mergeMesh(end_curve);

    var end_ring = new THREE.Mesh(end_ring_geometry);
    end_ring.position.y = -this.ship.panel_size / 2;
    end_ring.rotation.x = Math.PI / 2;
    trim_geometry.mergeMesh(end_ring);

    var end_ring = new THREE.Mesh(end_ring_geometry);
    end_ring.position.y = -this.ship.panel_size / 2 + boarder_width;
    end_ring.rotation.x = Math.PI / 2;
    trim_geometry.mergeMesh(end_ring);

    var end_curve = new THREE.Mesh(inner_end_curve_geometry);
    end_curve.position.y = -this.ship.panel_size / 2 + boarder_width / 2;
    trim_geometry.mergeMesh(end_curve);

    var end_curve = new THREE.Mesh(outer_end_curve_geometry);
    end_curve.position.y = -this.ship.panel_size / 2 + boarder_width / 2;
    trim_geometry.mergeMesh(end_curve);

    trim_geometry.mergeVertices(); // optional
    this.add(new THREE.Mesh(trim_geometry, this.ship.trim_material));
  }
}

class PanelLink extends THREE.Mesh {
  constructor(ship) {
    var link_geometry = new THREE.Geometry();

    var geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding + ship.void_padding / 2);

    var plane = new THREE.Mesh(geometry);
    plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 2 + ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    link_geometry.mergeMesh(plane);

    var plane = new THREE.Mesh(geometry);
    plane.position.y = ship.panel_size + ship.corner_padding * 2;
    plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 2 + ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    link_geometry.mergeMesh(plane);

    link_geometry.mergeVertices(); // optional
    super(link_geometry, ship.base_material);
  }
}

class PanelFloorFill extends THREE.Mesh {
  constructor(ship) {
    var fill_geometry = new THREE.Geometry();

    var geometry = new THREE.PlaneGeometry(ship.corner_padding + ship.void_padding / 2, ship.corner_padding + ship.void_padding / 2);

    var plane = new THREE.Mesh(geometry);
    plane.position.x = ship.panel_size / 2 + (ship.corner_padding * 2 + ship.void_padding) / 4;
    plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 2 + ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    fill_geometry.mergeMesh(plane);

    plane = new THREE.Mesh(geometry);
    plane.position.x = ship.panel_size / 2 + (ship.corner_padding * 2 + ship.void_padding) / 4;
    plane.position.y = ship.panel_size + ship.corner_padding * 2;
    plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 2 + ship.void_padding) / 4;
    plane.rotation.x = Math.PI / 2;
    fill_geometry.mergeMesh(plane);

    fill_geometry.mergeVertices(); // optional
    super(fill_geometry, ship.base_material);
  }
}

class ColumnShoe extends THREE.Mesh {
  constructor(ship, inner_radius, slope_radius) {
    


    var curve_detail = ship.curve_detail;

    //var vertex = new THREE.Vector3();
    var normal = new THREE.Vector3();

    var plane_geometry = new THREE.PlaneGeometry(1, 1, curve_detail, curve_detail + 1);

    

    //var positions = plane_geometry.attributes.position;
    var normals = [];

    for(let row = 0; row <= curve_detail; row++) {
      for (let column = 0; column <= curve_detail; column++) {

        i = row * (curve_detail + 1) + column;

        var vertex = plane_geometry.vertices[i];

        let theta = column / (curve_detail) * Math.PI / 2;
        let phi = row / (curve_detail) * Math.PI / 2;

        let level_radius = inner_radius + (1 - Math.cos(phi)) * slope_radius;

        vertex.x = -Math.sin(theta) * level_radius;
        vertex.y = -Math.sin(phi) * slope_radius;
        vertex.z = -Math.cos(theta) * level_radius;

        normal.x = -Math.sin(theta) * (inner_radius + slope_radius);
        normal.y = 0;
        normal.z = -Math.cos(theta) * (inner_radius + slope_radius);

        normal.sub(vertex);
        normal.normalize();
        
        normals[i] = new THREE.Vector3(normal.x, normal.y, normal.z);
      }
    }


    var vertex = new THREE.Vector3();
    vertex.x = -(inner_radius + slope_radius);
    vertex.y = -slope_radius;
    vertex.z = -(inner_radius + slope_radius);

    normal.x = 0;
    normal.y = 1;
    normal.z = 0;
    normal.normalize();

    for (var i = (curve_detail + 1) * (curve_detail + 1); i < plane_geometry.vertices.length; i++) {
      plane_geometry.vertices[i].set(vertex.x, vertex.y, vertex.z);
      normals[i] = new THREE.Vector3(normal.x, normal.y, normal.z);
    }

    for(var i = 0; i < plane_geometry.faces.length; i++) {
      var a = plane_geometry.faces[i].a;
      var b = plane_geometry.faces[i].b;
      var c = plane_geometry.faces[i].c;

      plane_geometry.faces[i].vertexNormals[0] = normals[a];
      plane_geometry.faces[i].vertexNormals[1] = normals[b];
      plane_geometry.faces[i].vertexNormals[2] = normals[c];
    }


    super(plane_geometry, ship.base_material);
  }
}
