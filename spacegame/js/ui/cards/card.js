class Card extends createjs.Container {
  constructor(name, width, height) {
    super();

    this.width = width;
    this.height = height;
    this.name = name;


    this.x = (game.width - this.width)/2;
    this.y = (game.height - this.height)/2;

    this.frame = new CardFrame(this, this.width, this.height);
    this.addChild(this.frame);

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
  set pinned(value) {
    this.frame.pinned = value;
  }
  get pinned() {
    return this.frame.pinned;
  }
  tick() {

  }
}
