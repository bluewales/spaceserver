class Panel extends THREE.Mesh {
  constructor(ship, transparent = false) {

    var panel_geometry = new THREE.Geometry();

    var geometry = new THREE.PlaneGeometry(ship.panel_size, ship.panel_size);

    if (transparent) {
      var material = ship.window_material;
    } else {
      var material = ship.base_material;
    }

    panel_geometry.mergeMesh(new THREE.Mesh(geometry));

    var edges = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

    var boarder_width = ship.corner_padding;
    var boarder_height = ship.touch_padding;


    for (var i = 0; i < 4; i++) {
      var box_geometry = new THREE.BoxGeometry(edges[i].x == 0 ? ship.panel_size : boarder_width, edges[i].y == 0 ? ship.panel_size : boarder_width, boarder_height);
      for (var index in box_geometry.faces) {
        box_geometry.faces[index].color = ship.decoration_color;
      }
      var boarder = new THREE.Mesh(box_geometry);

      boarder.position.x = (ship.panel_size - boarder_width) / 2 * edges[i].x;
      boarder.position.y = (ship.panel_size - boarder_width) / 2 * edges[i].y;
      panel_geometry.mergeMesh(boarder);
    }

    panel_geometry.mergeVertices(); // optional
    super(panel_geometry, material);
  }
}

class PanelCorner extends THREE.Mesh {
  constructor(ship, length = undefined, radius = undefined) {

    if (length === undefined) {
      length = ship.panel_size;
    }

    if (radius === undefined) {
      radius = ship.corner_padding;
    }

    var corner_geometry = new THREE.Geometry();

    var cylinder_geometry = new THREE.CylinderGeometry(radius, radius, length, ship.curve_detail, 1, true, 0, Math.PI / 2);
    var cylinder = new THREE.Mesh(cylinder_geometry);
    corner_geometry.mergeMesh(cylinder);


    corner_geometry.mergeVertices(); // optional
    super(corner_geometry, ship.base_material);
  }
}

class PanelLink extends MixedMesh {
  constructor(ship, ceiling, floor) {
    var link_geometry = new THREE.Geometry();

    var geometry = new THREE.PlaneGeometry(ship.panel_size, ship.corner_padding * 2);

    if (floor) {
      var bottom_plane = new THREE.Mesh(geometry);
      bottom_plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 4) / 4;
      bottom_plane.rotation.x = Math.PI / 2;
      link_geometry.mergeMesh(bottom_plane);
    }

    if (ceiling) {
      var top_plane = new THREE.Mesh(geometry);
      top_plane.position.y = ship.panel_size + ship.corner_padding * 2;
      top_plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 4) / 4;
      top_plane.rotation.x = Math.PI / 2;
      link_geometry.mergeMesh(top_plane);
    }

    link_geometry.mergeVertices(); // optional
    super(link_geometry, ship.base_material);
  }
}

class PanelFloorFill extends THREE.Mesh {
  constructor(ship) {
    var fill_geometry = new THREE.Geometry();

    var geometry = new THREE.PlaneGeometry(ship.corner_padding * 2, ship.corner_padding * 2);

    var plane = new THREE.Mesh(geometry);
    plane.position.x = ship.panel_size / 2 + (ship.corner_padding * 4) / 4;
    plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 4) / 4;
    plane.rotation.x = Math.PI / 2;
    fill_geometry.mergeMesh(plane);

    plane = new THREE.Mesh(geometry);
    plane.position.x = ship.panel_size / 2 + (ship.corner_padding * 4) / 4;
    plane.position.y = ship.panel_size + ship.corner_padding * 2;
    plane.position.z = ship.panel_size / 2 + (ship.corner_padding * 4) / 4;
    plane.rotation.x = Math.PI / 2;
    fill_geometry.mergeMesh(plane);

    fill_geometry.mergeVertices(); // optional
    super(fill_geometry, ship.base_material);
  }
}

class ColumnShoe extends THREE.Mesh {
  constructor(ship, inner_radius, slope_radius) {


    var normal = new THREE.Vector3();
    var plane_geometry = new THREE.PlaneGeometry(1, 1, ship.curve_detail, ship.curve_detail + 1);

    var normals = [];

    for (let row = 0; row <= ship.curve_detail; row++) {
      for (let column = 0; column <= ship.curve_detail; column++) {

        i = row * (ship.curve_detail + 1) + column;

        var vertex = plane_geometry.vertices[i];

        let theta = column / (ship.curve_detail) * Math.PI / 2;
        let phi = row / (ship.curve_detail) * Math.PI / 2;

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

    for (var i = (ship.curve_detail + 1) * (ship.curve_detail + 1); i < plane_geometry.vertices.length; i++) {
      plane_geometry.vertices[i].set(vertex.x, vertex.y, vertex.z);
      normals[i] = new THREE.Vector3(normal.x, normal.y, normal.z);
    }

    for (var i = 0; i < plane_geometry.faces.length; i++) {
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
