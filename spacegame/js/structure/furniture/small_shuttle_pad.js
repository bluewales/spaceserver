

class SmallShuttlePad extends Furniture {

  constructor() {
    super();
    this.items = {};
    this.inventory_size = 10;
    this.item_count = 0;
    this.pending_items = 0;

    this.uid = getUID("SmallShuttlePad");

    this.sprite = "small_shuttle_pad";
    this.label = "Shuttle Pad";
    this.size = 2;

    
  }

  init(raw, objects) {
    super.init(raw, objects);

    var g = this.ship.graphics.grid_width;
    var p = this.ship.graphics.padding;

    this.sprite_object = new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite);

    this.sprite_object.x -= p*2 + g;
    this.sprite_object.y -= p*2 + g;

    this.addChild(this.sprite_object);
  }

  start(raw, objects) {
    super.start(raw, objects);

  }

  deconstruct() {

  }

  tick() {

  }


  update_interaction_card() {
    if (!this._interaction_card) {
      return;
    }

    super.update_interaction_card();


  }



  get_raw(callback) {
    super.get_raw(null);

    if (callback) callback(this, this.raw);
  }

  static generate_raw(pos) {
    return {
      "type": "SmallShuttlePad",
      "pos": pos,
      "progress": 0
    };
  }

  static get materials() {
    return ["Steel", "Steel", "Steel", "Steel"];
  }
}
