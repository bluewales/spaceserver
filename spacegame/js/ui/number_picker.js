class NumberPicker extends createjs.Container {
  constructor(width, height, min = 0, max = 0) {
    super();

    this.width = width;
    this.height = height;

    this.min_value = min;
    this.max_value = max;

    this.value = 0;

    this.foreground_color = menu_palette[0];
    this.background_color = menu_palette[1];
    this.contrast_color = menu_palette[4];

    var minus_config = {
      "width": this.height,
      "height": this.height,
      "text": "-",
      "text_height": this.height,
      "on_click": function (event) {
        this.value -= 1;
      }.bind(this),
      "mode": "reset"
    };

    var plus_config = {
      "width": this.height,
      "height": this.height,
      "text": "+",
      "text_height": this.height,
      "on_click": function (event) {
        this.value += 1;
      }.bind(this),
      "mode": "reset"
    };

    this.plus_button = new Button(plus_config);
    this.minus_button = new Button(minus_config);

    this.value_text = new createjs.Text("0", (this.height) + "px Arial", this.foreground_color);
    this.value_text.x = this.width / 2;
    this.value_text.textAlign = "center";
    this.addChild(this.value_text);

    this.plus_button.x = this.width - this.height;

    
    this.addChild(this.minus_button);
    this.addChild(this.plus_button);
  }

  set value(value) {
    this._value = value;
    if (this._value > this.max_value && this.max_value >= this.min_value) this._value = this.max_value;
    if (this._value < this.min_value) this._value = this.min_value;
    if (this.value_text) {
      this.value_text.text = this._value;
    }
    if (this.on_change) {
      this.on_change(value);
    }
  }
  get value() {
    return this._value;
  }

  tick() {
    this.plus_button.tick();
    this.minus_button.tick();
  }
}
  