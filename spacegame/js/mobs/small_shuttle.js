class SmallShuttle extends createjs.Container {
  constructor(ship, pos) {
    super();

    this.ship = ship;
    this.pos = pos;

    this.type = "SmallShuttle",
    this.sprite = "small_shuttle";

    this.uid = getUID(this.type);
    let sprite_image = new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite)

    if(ship === undefined) return;

    sprite_image.x = -24;
    sprite_image.y = -24;
    this.addChild(sprite_image);

    this.acceleration = 0.1;
    this.speed = 0.25;

    this.x = 10000;
    this.y = 10000;

    this.dx = -15;
    this.x_offset = 1200;
    this.state = "decelerating";

    this.wobble_theta = 0;

    this.cooldown = 0;

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

    let wobble_x = Math.round(Math.sin(this.wobble_theta) * this.ship.graphics.padding);
    let wobble_y = Math.round(Math.cos(this.wobble_theta) * this.ship.graphics.padding);
    this.wobble_theta += 0.025;

    this.x = this.ship.graphics.position_transform(this.pos.x) - this.ship.graphics.padding + this.x_offset + wobble_x;
    this.y = this.ship.graphics.position_transform(this.pos.y) - this.ship.graphics.padding + wobble_y;

    if (this.cooldown > 0) {
      this.cooldown -= 1;
      return;
    }

    
    this.rotation = 90;

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
    if (this.state == "landing") {
      if(this.x_offset > 0){
        this.x_offset -= this.speed;
        if(this.x_offset <= 0) {
          this.x_offset = 0;
          this.cooldown = 100;
          this.state = "loading";
        }
      }
    }
    if (this.state == "loading") {
      this.state = "leaving";
    }
    if (this.state == "leaving") {
      this.dx += this.acceleration;
      if(this.x_offset > 1500) {
        this.dx = -15;
        this.x_offset = 1200;
        this.state = "decelerating";
      }
    }

    
    

    this.update_interaction_card();
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
    this._interaction_card.add_text("Rotation: " + this.theta);
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
