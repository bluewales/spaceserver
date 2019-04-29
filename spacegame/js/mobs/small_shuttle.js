class SmallShuttle extends createjs.Container {
  constructor(ship, pos) {
    super();

    this.ship = ship;
    this.pos = pos;

    this.type = "SmallShuttle",
    this.sprite = "small_shuttle";

    this.label = "Shuttle";

    this.size = 2;

    this.uid = getUID(this.type);
    let sprite_image = new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite);
    this.box = new createjs.Container();
    
    this.addChild(this.box);
    this.box.addChild(sprite_image);

    if(ship === undefined) return;

    this.box.x = -this.ship.graphics.padding;
    this.box.y = -this.ship.graphics.padding;

    sprite_image.x = -this.ship.graphics.grid_width;
    sprite_image.y = -this.ship.graphics.grid_width;

    

    this.acceleration = 0.1;
    this.speed = 0.25;

    this.x = 10000;
    this.y = 10000;

    this.dx = -15;
    this.x_offset = 1200;
    this.state = "decelerating";

    this.cooldown = 0;

    this.flame = new createjs.Sprite(game.sprites["flame"].sprite, "flame");
    this.flame.x = -(this.ship.graphics.grid_width + this.ship.graphics.padding) / 2;
    this.flame.y = this.ship.graphics.grid_width - this.ship.graphics.padding * 2;
  }
  init(raw, objects) {
    this.type = raw.type;
    this.sprite = "small_shuttle";

    this.ship = objects[raw.ship];
    this.pos = raw.pos;
    this.sprite = raw.sprite;



    this.label = raw.name;
  }
  start(raw, objects) {
  }
  
  tick(event) {

    this.x = this.ship.graphics.position_transform(this.pos.x) + this.x_offset;
    this.y = this.ship.graphics.position_transform(this.pos.y);

    if ((this.state == "decelerating" || this.state == "leaving") && this.cooldown == 0) {
      this.box.addChild(this.flame);
    } else {
      this.box.removeChild(this.flame);
    }

    if (this.highlight) {
      this.highlight.x = this.x;
      this.highlight.y = this.y;
    }

    if (this.cooldown > 0) {
      this.cooldown -= 1;
      return;
    }

    

    
    this.box.rotation = 90;

    this.x_offset += this.dx;

    if (this.state == "decelerating") {
      if (this.dx < 0) {
        if (this.dx + this.acceleration > 0) {
          this.dx = 0;
          this.cooldown = 30;
          this.state = "landing";
        } else {
          this.dx += this.acceleration;
        }
      }
    }
    else if (this.state == "landing") {
      if(this.x_offset > 0){
        this.x_offset -= this.speed;
        if(this.x_offset <= 0) {
          this.x_offset = 0;
          this.cooldown = 100;
          this.state = "loading";
        }
      }
    }
    else if (this.state == "loading") {
      this.state = "leaving";
    }
    else if (this.state == "leaving") {
      this.dx += this.acceleration;
      if(this.x_offset > 1500) {
        this.dx = -15;
        this.x_offset = 1200;
        this.state = "decelerating";
      }
    }
  }
  
  set state(value) {
    this._state = value;
    this.update_interaction_card();
  }
  get state() {
    return this._state;
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.pos = copy_pos(this.pos);
    this.raw.name = this.label;
    this.raw.ship = this.ship.id;
    this.raw.type = this.type;

    callback(this, this.raw);
  }
  get layer() {
    return "shuttle";
  }

  update_interaction_card() {
    if (!this._interaction_card) {
      return;
    }

    this._interaction_card.clear_lines();

    this._interaction_card.add_text("Position: " + pos_to_index(this.pos));
    this._interaction_card.add_text("State: " + this.state);
  }

  get interaction_card() {
    if (!this._interaction_card) {
      this._interaction_card = new InteractionCard(this.label);
      this.update_interaction_card();
    }
    return this._interaction_card;
  }

  set_highlight(highlight) {
    this.highlight = highlight;
  }
}
