class Item extends createjs.Container {
  constructor(sprite_key, pos, container) {
    super();

    this.sprite_key = sprite_key;
    this.sprite = new createjs.Sprite(game.sprites[this.sprite_key].sprite, this.sprite_key);
    this.sprite.x = 4;
    this.sprite.y = 4;
    this.addChild(this.sprite);

    this.uid = getUID("Item");
    if(pos) {
      this.pos = pos;
      this.ship = game.ship;
      this.container = container;
      this.claimed = false;
      this.ship.item_store.add_item(this);
    }
  }
  init(raw, objects) {
    this.type = raw.type;
    this.pos = raw.pos;

    if(objects === undefined) {

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

    this._interaction_card = new InteractionCard(this.label);

    return this._interaction_card;
  }
  get_raw(callback) {
    this.raw = {};
    if(this.pos) this.raw.pos = copy_pos(this.pos);
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    this.raw.container = this.container.id;
    if(this.claimed) this.raw.claimed = this.claimed.id;
    callback(this, this.raw);
  }
  set_highlight(highlight) {
    this.highlight = highlight;
  }
  tick() {
    if(this.pos) {
      this.x = this.ship.position_transform(this.pos.x);
      this.y = this.ship.position_transform(this.pos.y);
    }
  }
}
