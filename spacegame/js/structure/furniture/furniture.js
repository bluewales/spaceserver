class Furniture extends Structure {
  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);
  }

  start(raw, objects) {
    super.start(raw, objects);
  }
  deconstruct() {
    console.log("deconstruct " + this.label + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
    this.ship.remove_furniture(this.pos);
  }
  get_raw(callback) {
    super.get_raw(null);
    this.raw.pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z};
    if(callback) callback(this, this.raw);
  }
  get layer() {
    return "furniture";
  }
  static can_build(pos) {
    if(game.ship.get_furniture(pos)) return false;
    var floor = game.ship.get_floor(pos)
    if(floor && floor.type == "FloorPlate") return true;
  }
}
