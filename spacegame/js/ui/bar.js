class Bar extends createjs.Container {
  constructor(top, button_data) {
    super();

    this.top = top;
    this.button_data = button_data;

    this.bar_height = 40;
    this.window_width = 100;
    this.window_height = 100;

    this.button_width = 100;
    this.button_height = this.bar_height;

    this.box = new createjs.Shape();
    this.addChild(this.box);

    this.buttons = [];
    for (var i = 0; i < this.button_data.length; i++) {
      var button_data = this.button_data[i];
      var button_config = {
        "width": this.button_width,
        "height": this.button_height,
        "text": button_data.text,
        "on_click": button_data.on_click,
        "mode": button_data.mode,
        "on_tick": button_data.on_tick
      };
      var button = new Button(button_config);

      if (button_data.card) {

        function create_on_click_callback(card) {
          button.on_click = function (event) {
            card.active = event.currentTarget.active;
          }
        }
        create_on_click_callback(button_data.card);

        function create_on_close_callback(button) {
          button_data.card.on_close = function () {
            button.active = false;
          }
        }
        create_on_close_callback(button);
      }

      this.addChild(button);
      this.buttons.push(button);
    }

    this.resize(this.window_width, this.window_height);
  }


  resize(width, height) {
    this.window_width = width;
    this.window_height = height;

    this.y = this.top ? 0 : (this.window_height - this.bar_height);

    this.box.graphics.clear()
      .beginFill(menu_palette[0])
      .drawRect(0, 0, this.window_width, this.bar_height)
      .endFill();

    var center_blank = 100;
    var half = Math.floor(this.buttons.length / 2);

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].x = width / 2 - this.button_width * (half - i + 0.5) - (center_blank / 2) + (i >= half ? this.button_width + center_blank : 0);
    } 
  }

  tick() {
    var buttons = this.buttons;
    for (var i = 0; i < buttons.length; i++) {
      this.buttons[i].tick();
    }
  }
}
