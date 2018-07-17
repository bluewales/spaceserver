

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
  
    add_item(item) {
      this.items[item.uid] = item;
  
      this.item_count++;
  
      item.container = this;
      item.pos = this.pos;
  
      this.update_interaction_card();
    }
  
    remove_item(item) {
      if (!this.items[item.uid]) {
        console.log("ERROR cannot remove item.  It's not here.");
        //console.trace();
        return;
      }
      this.item_count--;
      this.items[item.uid] = undefined;
      delete this.items[item.uid];
  
      this.update_interaction_card();
    }
  
  
    get_raw(callback) {
      super.get_raw(null);
  
      this.raw.item = [];
      for (var key in this.items) {
        this.raw.item.push(this.items[key].id);
        this.items[key].get_raw(callback);
      }
      if (callback) callback(this, this.raw);
    }
  
    static generate_raw(pos) {
      return {
        "type": "Crate",
        "pos": pos,
        "progress": 0
      };
    }
  
    static get materials() {
      return ["Steel"];
    }
  }