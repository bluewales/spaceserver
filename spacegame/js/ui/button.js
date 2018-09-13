class Button extends createjs.Container {
  constructor(config) {
    super();

    this.config = config;
    this.width = config.width;
    this.height = config.height;
    this.text_hight = config.text_hight || 20;
    this.text = new createjs.Text(config.text, this.text_hight + "px Arial", menu_palette[1]);
    this.on_click = config.on_click;
    this.mode = config.mode;
    this.on_tick = config.on_tick;


    this.text.textAlign = "center";
    this.text.y = this.height / 2 - this.text_hight / 2;
    this.text.x = this.width / 2;

    this._active = false;
    this.background_color = menu_palette[0];

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();

    this.addEventListener("mousedown", function (event) {
      this.box.graphics.clear().beginFill(menu_palette[2]).drawRect(0, 0, this.width, this.height).endFill();
    }.bind(this));

    this.addEventListener("pressup", function (event) {
      this.box.graphics.clear().beginFill(this.background_color).drawRect(0, 0, this.width, this.height).endFill();
    }.bind(this));

    this.addEventListener("click", function (event) {
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
      this.background_color = menu_palette[3];
    } else {
      this.background_color = menu_palette[0];
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
}
