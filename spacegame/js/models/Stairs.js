class Stairs extends THREE.Mesh {

  constructor(ship, stairs_data) {

    let sphere_geometry, sphere;

    let stairs_geometry = new THREE.Geometry();

    let treads = 14;

    

    let tread_height = ship.grid_size / treads;
    let tread_depth = (ship.grid_size * 2 - ship.corner_padding * 2) / treads;
    let stair_width = ship.panel_size;

    for(let i = 0; i < treads; i++) {
      let tread_width = (i == 0 || i == treads - 1) ? stair_width : stair_width - ship.corner_padding * 2;
      let cube_geometry = new THREE.BoxGeometry(tread_width, tread_height * 0.9, tread_depth);
      let cube = new THREE.Mesh(cube_geometry);

      cube.position.z = -ship.panel_size / 2 + tread_depth * (i + 0.5) - ship.corner_padding;
      cube.position.y = -tread_height * i - tread_height / 2;

      stairs_geometry.mergeMesh(cube);
    }

    for(let i = 0; i < 2; i++) {
      let cube_geometry = new THREE.BoxGeometry(ship.corner_padding, tread_height * 0.9, tread_depth * treads);
      
      cube_geometry.vertices[0].x = stair_width / 2;
      cube_geometry.vertices[0].y = -ship.grid_size + tread_height * 0.95;
      cube_geometry.vertices[0].z = -ship.panel_size / 2 + tread_depth * (treads) - ship.corner_padding;

      cube_geometry.vertices[1].x = stair_width / 2;
      cube_geometry.vertices[1].y = -tread_height * 0.05;
      cube_geometry.vertices[1].z = -ship.panel_size / 2 + tread_depth - ship.corner_padding;

      cube_geometry.vertices[2].x = stair_width / 2;
      cube_geometry.vertices[2].y = -ship.grid_size + tread_height * 0.95;
      cube_geometry.vertices[2].z = -ship.panel_size / 2 + tread_depth * (treads - 1) - ship.corner_padding;

      cube_geometry.vertices[3].x = stair_width / 2;
      cube_geometry.vertices[3].y = -tread_height * 0.95;
      cube_geometry.vertices[3].z = -ship.panel_size / 2 + tread_depth - ship.corner_padding;

      cube_geometry.vertices[4].x = stair_width / 2 - ship.corner_padding;
      cube_geometry.vertices[4].y = -tread_height * 0.05;
      cube_geometry.vertices[4].z = -ship.panel_size / 2 + tread_depth - ship.corner_padding;

      cube_geometry.vertices[5].x = stair_width / 2 - ship.corner_padding;
      cube_geometry.vertices[5].y = -ship.grid_size + tread_height * 0.95;
      cube_geometry.vertices[5].z = -ship.panel_size / 2 + tread_depth * (treads) - ship.corner_padding;

      cube_geometry.vertices[6].x = stair_width / 2 - ship.corner_padding;
      cube_geometry.vertices[6].y = -tread_height * 0.95;
      cube_geometry.vertices[6].z = -ship.panel_size / 2 + tread_depth - ship.corner_padding;

      cube_geometry.vertices[7].x = stair_width / 2 - ship.corner_padding;
      cube_geometry.vertices[7].y = -ship.grid_size + tread_height * 0.95;
      cube_geometry.vertices[7].z = -ship.panel_size / 2 + tread_depth * (treads - 1) - ship.corner_padding;

      cube_geometry.computeFlatVertexNormals();

      for (var index in cube_geometry.faces) {
        cube_geometry.faces[index].color = ship.decoration_color;
      }

      let cube = new THREE.Mesh(cube_geometry);

      cube.position.x = (-stair_width + ship.corner_padding) * i;

      stairs_geometry.mergeMesh(cube);

      
    }


    



    stairs_geometry.mergeVertices(); // optional
    super(stairs_geometry, ship.base_material);
    // super(stairs_geometry, new THREE.MeshNormalMaterial({side: THREE.DoubleSide}));
  }
}
