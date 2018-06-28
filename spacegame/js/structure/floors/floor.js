class Floor extends Structure {
  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);
  }
  start(raw, objects) {
    super.start(raw, objects);
  }
  get_raw(callback) {
    super.get_raw(null);
    this.raw.pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z};
    if(callback) callback(this, this.raw);
  }
  get layer() {
    return "floor";
  }
  static can_build(pos) {
    if(game.ship.get_floor(pos)) return false;
    return true;
  }
}
