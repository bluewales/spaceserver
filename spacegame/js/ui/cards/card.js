class Card extends createjs.Container {
  constructor(label, width, height) {
    super();

    this._label = label;
    this._frameless = false;

    this.frame = new CardFrame(this, width, height);
    this.addChild(this.frame);

    this.width = width;
    this.height = height;

    this.foreground_color = this.frame.foreground_color;
    this.background_color = this.frame.background_color;
    this.contrast_color = this.frame.contrast_color;

    this.x = (game.width - this.width)/2;
    this.y = (game.height - this.height)/2;

    this.resize_listeners = [];


    this.on("click", function(event) {
      if(this._frameless) {
        return; 
      }
      this.frame.click(event);
    });
    this.on("mousedown", function(event) {
      if(this._frameless) {
        return; 
      }
      this.frame.mousedown(event);
    });
    this.on("pressmove", function(event) {
      if(this._frameless) {
        return; 
      }
      this.frame.drag(event);
    });

    game.card_table.register(this);
  }

  set active(value) {
    if(this._active === value) return;
    this._active = value;
    if(this._frameless) return;
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
    this.signal_resized();
  }
  get width() {
    return this.frame.width;
  }

  set height(value) {
    this.frame.height = value;
    this.signal_resized();
  }
  get height() {
    return this.frame.height;
  }

  set resize_listener(listener) {
    this.resize_listeners.push(listener);
  }

  signal_resized() {
    for (let ix in this.resize_listeners) {   
      let listener = this.resize_listeners[ix];
      listener(this);
    }
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

  set frameless(value) {
    if (this._frameless === value) return;
    this._frameless = value;

    if(this._frameless) {
      this.removeChild(this.frame);

      this.x = 0;
      this.y = 0;
    } else {
      this.addChildAt(this.frame, 0);
    }
  }
  get frameless() {
    return this._frameless;
  }

  get border_width () {
    return this.frame.border_width;
  }
  get header_width() {
    return this.frame.header_width;
  }

  on_close() {
    game.ship.clear_selection();
  }

  tick() {
    
  }
}
