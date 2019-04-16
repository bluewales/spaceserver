class Structure extends createjs.Container {
  constructor() {
    super();
  }

  init(raw, objects) {

    if (objects === undefined) {
      this.ship = game.ship;
    } else {
      this.ship = objects[raw.ship];
    }

    this.type = raw.type;
    this.pos = raw.pos;

    this.progress = raw.progress;
    if (raw.progress === undefined)
      this.progress = 100;

    this.x = this.ship.graphics.position_transform(this.pos.x);
    this.y = this.ship.graphics.position_transform(this.pos.y);

  }
  start(raw, objects) {

  }

  deconstruct() {
    // This is a stub, base classes should implement it if they want
  }



  set progress(value) {
    this._progress = value;
    this.alpha = value >= 100 ? 1 : 0.4 + value / 250;

    this.update_interaction_card();
  }
  get progress() {
    return this._progress;
  }

  set job(value) {
    this.current_job = value;

    this.update_interaction_card();
  }
  get job() {
    return this.current_job;
  }

  update_interaction_card() {
    if (!this._interaction_card) {
      return;
    }

    this._interaction_card.clear_lines();

    if (this.current_job) {
      this._interaction_card.add_text(this.current_job.label);
      this._interaction_card.add_progress_bar(this.current_job.percent);
      this._interaction_card.add_button("Cancel", this.current_job.cancel.bind(this.current_job));
    } else {
      this._interaction_card.add_text("Status: OK");
      this._interaction_card.add_button("Deconstruct", function () {
        deconstruct_structure(this);
      }.bind(this));
    }
    this._interaction_card.add_text("Position: " + pos_to_index(this.pos));
  }

  get interaction_card() {
    if (!this._interaction_card) {
      this._interaction_card = new InteractionCard(this.label);
      this.update_interaction_card();
    }
    return this._interaction_card;
  }

  get_raw(callback) {
    this.raw = {};
    if(this.progress != 100) this.raw.progress = this.progress;
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    if (callback) callback(this, this.raw);
  }

  set_highlight(highlight) {
    this.highlight = highlight;
  }
}
