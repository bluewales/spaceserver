class Structure extends createjs.Container {
  constructor() {
    super();
  }

  init(raw, objects) {

    if(objects === undefined) {
      this.ship = game.ship;
    } else {
      this.ship = objects[raw.ship];
    }

    this.type = raw.type;
    this.pos = raw.pos;

    this.progress = raw.progress;
    if(raw.progress === undefined)
    this.progress = 0;

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);


  }
  start(raw, objects) {

  }

  create_interaction_card() {
    this._interaction_card = new InteractionCard(this.name);
  }

  update_interaction_card() {
    if(!this._interaction_card) {
      return;
    }
    if(this.progress >= 100) {

    }
  }

  set progress(value) {
    this._progress = value;
    this.alpha = value >= 100 ? 1 : 0.4 + value/250;

    this.update_interaction_card();
  }
  get progress() {
    return this._progress;
  }

  get interaction_card() {
    if(!this._interaction_card) {
      this.create_interaction_card();
    }
    this.update_interaction_card();
    return this._interaction_card;
  }

  get_raw(callback) {
    this.raw = {};
    this.raw.progress = this.progress;
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    if(callback) callback(this, this.raw);
  }

}
