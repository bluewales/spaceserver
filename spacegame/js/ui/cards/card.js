class Card extends createjs.Container {
  constructor(label, width, height) {
    super();

    this._label = label;

    this.frame = new CardFrame(this, width, height);
    this.addChild(this.frame);

    this.width = width;
    this.height = height;

    this.foreground_color = this.frame.foreground_color;
    this.background_color = this.frame.background_color;
    this.contrast_color = this.frame.contrast_color;

    this.x = (game.width - this.width)/2;
    this.y = (game.height - this.height)/2;


    this.on("click", function(event) {this.frame.click(event);});
    this.on("mousedown", function(event) {this.frame.mousedown(event);});

    game.card_table.register(this);
  }

  set active(value) {
    if(this._active === value) return;
    this._active = value;
    if(this._active) {
      game.card_table.focus(this);
    } else {
      game.card_table.removeChild(this);
      if(this.on_close) this.on_close();
    }
  }
  get active() {
    return this._active;
  }

  set width(value) {
    this.frame.width = value;
  }
  get width() {
    return this.frame.width;
  }

  set height(value) {
    this.frame.height = value;
  }
  get height() {
    return this.frame.height;
  }

  set label(value) {
    this._label = value;
    if(this.frame)
      this.frame.title.text = value;
  }
  get label() {
    return this._label;
  }

  set pinned(value) {
    this.frame.pinned = value;
  }
  get pinned() {
    return this.frame.pinned;
  }
  set blocking(value) {
    this.frame.blocking = value;
  }
  get blocking() {
    return this.frame.blocking;
  }
  tick() {

  }
}
