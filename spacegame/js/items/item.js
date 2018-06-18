class Item extends createjs.Container {
  constructor() {
    super();

    this.uid = getUID("Item");
  }
  init(raw, objects) {


    this.type = raw.type;
    this.pos = raw.pos;

    if(objects === undefined) {
      this.ship = game.ship;
      this.container = game.ship;
      this.claimed = false;
    } else {
      this.ship = objects[raw.ship];
      this.container = objects[raw.container];
      if(raw.claimed) {
        this.claimed = objects[raw.claimed];
      } else {
        this.claimed = false;
      }
    }

    this.ship.item_store.add_item(this);

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);
  }
  start(raw, objects) {
  }

  set container(c) {
    if(this._container && c != this._container) {
      this._container.remove_item(this);
    }
    this._container = c;
  }
  get container() {
    return this._container;
  }

  static get_type_from_string(str) {
    return type_lookup[str];
  }
  static create(ship, raw) {
    var type = Item.get_type_from_string(raw.type);
    return new type(ship, raw);
  }
  get layer() {
    return "item";
  }
  get interaction_card() {
    if(this._interaction_card) {
      return this._interaction_card;
    }

    this._interaction_card = new InteractionCard(this.name);

    return this._interaction_card;
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.pos = copy_pos(this.pos);
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    this.raw.container = this.container.id;
    if(this.claimed) this.raw.claimed = this.claimed.id;
    callback(this, this.raw);
  }
}