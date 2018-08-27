

class ChargingPad extends Furniture {

    constructor() {
      super();
  
      this.uid = getUID(this.name);
      this.label = "Charging Pad";

      this.sprite = "charging_pad";
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
        "type": "ChargingPad",
        "pos": pos,
        "progress": 0
      };
    }
  
    static get materials() {
      return ["Steel"];
    }
  }