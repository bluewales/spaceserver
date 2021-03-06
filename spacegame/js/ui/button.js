class Button extends createjs.Container {
  constructor(config) {
    super();

    this.config = config;
    this.width = config.width;
    this.height = config.height;
    this.text_hight = config.text_hight || 20;
    this.text = new createjs.Text(config.text, this.text_hight + "px Arial", menu_background_color);
    this.on_click = config.on_click;
    this.mode = config.mode;
    this.on_tick = config.on_tick;

    this.enabled = true;


    this.text.textAlign = "center";
    this.text.y = this.height / 2 - this.text_hight / 2;
    this.text.x = this.width / 2;

    this._active = false;
    this.background_color = menu_foreground_color;

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();

    this.addEventListener("mousedown", function (event) {
      if(!this.enabled) return;
      this.box.graphics.clear().beginFill(menu_alt_foreground_color).drawRect(0, 0, this.width, this.height).endFill();
    }.bind(this));

    this.addEventListener("pressup", function (event) {
      if (!this.enabled) return;
      this.box.graphics.clear().beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();
    }.bind(this));

    this.addEventListener("click", function (event) {
      if (!this.enabled) return;
      this.active = !this.active;
      this.debounce = 5;
      if (this.on_click) {
        this.on_click(event);
      }
    }.bind(this));

    this.addChild(this.box);
    this.addChild(this.text);
  }

  set active(value) {

    if (this._active === value) return;
    this._active = value;
    if (this._active) {
      this.background_color = menu_contrast_color;
    } else {
      this.background_color = menu_foreground_color;
    }
    this.box.graphics.clear().beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();
  }

  get active() {
    return this._active;
  }

  tick() {

    if (this.debounce > 0) {
      this.debounce -= 1;
    }
    if (this.debounce == 0 && this.mode == "reset" && this.active) {
      this.active = false;
    }

    if (this.on_tick) this.on_tick();
  }

  enable() {
    this.enabled = true;
    this.background_color = menu_foreground_color;
    this.box.graphics.clear().beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();
  }

  disable() {
    this.enabled = false;
    this.background_color = menu_alt_contrast_color;
    this.box.graphics.clear().beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();
  }
}
