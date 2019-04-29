

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

    this.addChild(new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite));
  }

  init(raw, objects) {
    super.init(raw, objects);

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
    return ["Steel", "Steel"];
  }
}
