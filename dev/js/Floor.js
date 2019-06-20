class Floor extends THREE.Mesh {

  constructor() {

    var geometry = new THREE.PlaneGeometry(2, 2);
    var material = new THREE.MeshToonMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    

    super(geometry, material);

    var edges = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    var width = 0.1;
    var height =  0.01;

    for(var i = 0; i < 4; i++) {
      var cylinder_geometry = new THREE.BoxGeometry(edges[i].x == 0 ? 2 : width, edges[i].y == 0 ? 2 : width, height);
      //var material = new THREE.MeshToonMaterial({ color: 0x00ff00 });
      var boarder = new THREE.Mesh(cylinder_geometry, material);

      boarder.position.x = (1 - width / 2) * edges[i].x;
      boarder.position.y = (1 - width / 2) *edges[i].y;
      this.add(boarder);
    }

    this.rotation.x -= Math.PI / 2;
  }

}
