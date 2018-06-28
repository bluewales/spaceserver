

class Crate extends Furniture {

  constructor() {
    super();
    this.items = {};
    this.inventory_size = 10;
    this.item_count = 0;
    this.pending_items = 0;

    this.uid = getUID("Crate");
  }

  init(raw, objects) {
    super.init(raw, objects);

    this.sprite = "crate";
    this.label = "Crate";

    this.addChild(new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite));

    var items = raw.item;
    if (!items) items = [];

    for (var i = 0; i < items.length; i++) {
      var item = objects[items[i]];
      this.add_item(item);
    }
  }

  start(raw, objects) {
    super.start(raw, objects);

  }

  deconstruct() {
    // This structure is dying, time to spew it's contents into the world
    for (var key in this.ship.items) {
      var item = this.ship.items[key];
      item.pos = this.pos;
      this.ship.add_item(item);
    }
  }

  tick() {
    if (Math.random() * 1000 < 1) {
      if (this.item_count + this.pending_items < this.inventory_size) {
        for (var key in this.ship.items) {
          var item = this.ship.items[key];
          if (item === undefined) continue;
          if (item.claimed === false) {
            var job = new PutAway(this, item);
            this.ship.jobs.create_job(job);
            break;
          }
        }
      }
    }
  }


  update_interaction_card() {
    if (!this._interaction_card) {
      return;
    }

    super.update_interaction_card();

    var item_summary = {};
    for (var key in this.items) {
      var label = (this.items[key].label);
      if (item_summary[label]) {
        item_summary[label] += 1;
      } else {
        item_summary[label] = 1;
      }
    }


    if (Object.keys(item_summary).length > 0) {
      this._interaction_card.add_text("Contents:");
    } else {
      this._interaction_card.add_text("Empty");
    }
    for (var label in item_summary) {
      this._interaction_card.add_text(item_summary[label] + "x " + label);
    }
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

class PutAway extends Job {
  constructor(crate, item) {
    super();
    if (crate) {
      this.crate = crate;
      this.pos = item.pos;
      this.item = item;

      item.claimed = this;

      this.crate.pending_items++;
    }

    this.label = "PutAway";
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.crate = objects[raw.crate];
    this.item = objects[raw.item];

    this.crate.pending_items++;
  }
  start(raw, objects) {
    super.start(raw, objects);

    this.pos = this.item.pos;
  }

  work(crew) {
    var p = crew.pos;

    if (!this.take_item_to(crew, this.item, this.crate.pos)) return false;

    this.item.claimed = false;
    this.crate.add_item(this.item);

    if (this.crate.pending_items <= 0) {
      console.log("ERROR! negative pending items!")
    }
    this.crate.pending_items--;

    return true;
  }

  on_complete() {

  }

  get_raw(callback) {
    super.get_raw(null);
    this.raw.crate = this.crate.id;
    this.raw.item = this.item.id;
    this.raw.type = "PutAway";

    if (callback) callback(this, this.raw);
  }
}
