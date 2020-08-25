class MixedMesh extends THREE.Object3D {
  constructor(geometry, material) {
    super();
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
  