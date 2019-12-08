class ConsolePodium extends THREE.Mesh {

  constructor(ship, console_data) {

    let sphere_geometry, sphere;

    let console_geometry = new THREE.Geometry();

    let base_geometry = new THREE.BoxGeometry(ship.panel_size / 2, ship.corner_padding, ship.panel_size / 2);
    base_geometry.computeFlatVertexNormals();
    for (var index in base_geometry.faces) {
      base_geometry.faces[index].color = new THREE.Color(ship.palette[2]);
    }

    let base = new THREE.Mesh(base_geometry);
    base.position.y = ship.corner_padding/2 + ship.touch_padding;
    console_geometry.mergeMesh(base);

    let pedestal_geometry = new THREE.BoxGeometry(ship.corner_padding, ship.panel_size / 2, ship.corner_padding);
    pedestal_geometry.vertices[0].y -= ship.corner_padding/2;
    pedestal_geometry.vertices[1].y += ship.corner_padding/2;
    pedestal_geometry.vertices[5].y -= ship.corner_padding/2;
    pedestal_geometry.vertices[4].y += ship.corner_padding / 2;
    pedestal_geometry.computeFlatVertexNormals();
    for (var index in pedestal_geometry.faces) {
      pedestal_geometry.faces[index].color = new THREE.Color(ship.palette[3]);
    }

    let pedestal = new THREE.Mesh(pedestal_geometry);
    pedestal.position.y = ship.panel_size/4 + ship.touch_padding;
    console_geometry.mergeMesh(pedestal);


    let screen_unit = ship.panel_size / 12;
    let bezel_unit = screen_unit / 12;
    let screen_geometry = new THREE.BoxGeometry(screen_unit * 4, bezel_unit/12, screen_unit * 3);
    screen_geometry.computeFlatVertexNormals();
    for (var index in screen_geometry.faces) {
      screen_geometry.faces[index].color = new THREE.Color(ship.palette[4]);
    }
    screen_geometry.computeVertexNormals();
    let screen = new THREE.Mesh(screen_geometry);
    screen.position.y = ship.panel_size / 2 + ship.corner_padding / 2;
    screen.rotation.x = Math.PI / 4;
    console_geometry.mergeMesh(screen);





    var test_geometry = new THREE.Geometry();

    test_geometry.vertices.push(

      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 4, 0, 0),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 4, 0, screen_unit * 3 + bezel_unit * 4),
      new THREE.Vector3(0, 0, screen_unit * 3 + bezel_unit * 4),

      new THREE.Vector3(bezel_unit, 0, bezel_unit),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 3, 0, bezel_unit),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 3, 0, screen_unit * 3 + bezel_unit * 3),
      new THREE.Vector3(bezel_unit, 0, screen_unit * 3 + bezel_unit * 3),

      new THREE.Vector3(bezel_unit * 2, -bezel_unit, bezel_unit * 2),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 2, -bezel_unit, bezel_unit * 2),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 2, -bezel_unit, screen_unit * 3 + bezel_unit * 2),
      new THREE.Vector3(bezel_unit * 2, -bezel_unit, screen_unit * 3 + bezel_unit * 2),
      
      new THREE.Vector3(0, -bezel_unit * 2, 0),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 4, -bezel_unit * 2, 0),
      new THREE.Vector3(screen_unit * 4 + bezel_unit * 4, -bezel_unit * 2, screen_unit * 3 + bezel_unit * 4),
      new THREE.Vector3(0, -bezel_unit * 2, screen_unit * 3 + bezel_unit * 4));

    test_geometry.faces.push(

      new THREE.Face3(0, 1, 4),
      new THREE.Face3(1, 5, 4),
      new THREE.Face3(1, 2, 6),
      new THREE.Face3(1, 6, 5),

      new THREE.Face3(2, 3, 7),
      new THREE.Face3(2, 7, 6),
      new THREE.Face3(0, 7, 3),
      new THREE.Face3(0, 4, 7),

      new THREE.Face3(4, 5, 8),
      new THREE.Face3(8, 5, 9),
      new THREE.Face3(9, 5, 6),
      new THREE.Face3(9, 6, 10),

      new THREE.Face3(11, 10, 6),
      new THREE.Face3(11, 6, 7),
      new THREE.Face3(8, 11, 7),
      new THREE.Face3(4, 8, 7),

      new THREE.Face3(0, 12, 1),
      new THREE.Face3(12, 13, 1),
      new THREE.Face3(1, 13, 14),
      new THREE.Face3(1, 14, 2),

      new THREE.Face3(3, 2, 14),
      new THREE.Face3(15, 3, 14),
      new THREE.Face3(0, 3, 15),
      new THREE.Face3(12, 0, 15),

      new THREE.Face3(12, 14, 13),
      new THREE.Face3(12, 15, 14));

    // compute Normals
    test_geometry.computeFlatVertexNormals();

    test_geometry.faceVertexUvs[0] = [];
    for (var index in test_geometry.faces) {
      test_geometry.faceVertexUvs[0].push([
        new THREE.Vector2(),
        new THREE.Vector2(),
        new THREE.Vector2()
      ]);
    }

    for (var index in test_geometry.faces) {
      test_geometry.faces[index].color = new THREE.Color(ship.palette[2]);
    }

    // normalize the geometry
    test_geometry.center();

    let test = new THREE.Mesh(test_geometry);
    test.position.y = ship.panel_size / 2 + ship.corner_padding / 2;
    test.rotation.x = Math.PI / 4;
    console_geometry.mergeMesh(test);




    console_geometry.mergeVertices(); // optional
    super(console_geometry, ship.base_material);

    this.overlay = new EngineeringConsole(ship);
  }

  select() {
    game.view.show_overlay(this.overlay);
  }
}
