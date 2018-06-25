class TopBar extends createjs.Container {
  constructor() {
    super();

    this.height = 40;
    this.width = 100;

    this.button_width = 100;
    this.button_height = this.height;

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(0, 0, this.width, this.height).endFill();
    this.addChild(this.box);

    this.button_data = [
      {
        "name":"Controls",
        "card": new ControlsCard()
      },{
        "name":"Save",
        "on_click": function(event) {
          game.save();
        },
        "mode": "reset"
      }
    ];

    this.buttons = new createjs.Container();
    for(var i = 0; i < this.button_data.length; i++) {

      var button_data = this.button_data[i];

      var button_config = {
        "width": this.button_width,
        "height": this.button_height,
        "text": button_data.name,
        "on_click": button_data.on_click,
        "mode": button_data.mode
      };
      var button = new Button(button_config);

      if(button_data.card) {

        function create_on_click_callback(card) {
          button.on_click = function(event) {
            card.active = event.currentTarget.active;
          }
        }

        create_on_click_callback(button_data.card);

        function create_on_close_callback(button) {
          button_data.card.on_close = function() {
            button.active = false;
          }
        }
        create_on_close_callback(button);
      }

      this.buttons.addChild(button);
      //button.active = true;
      button_data.button = button;
    }
    this.addChild(this.buttons);
  }

  resize(width, height) {

    this.width = width;

    this.box.graphics.clear().beginFill(menu_palette[0]).drawRect(0, 0, this.width, this.height).endFill();

    var buttons = this.buttons.children;

    for(var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var half = Math.round(buttons.length/2)
      button.x = width/2 - this.button_width*(half - i + 0.5) - 50 + (i>=half?this.button_width+100:0);
    }
  }

  tick() {
    var buttons = this.buttons.children;
    for(var i = 0; i < buttons.length; i++) {
      var button = buttons[i];

      button.tick();
    }
  }
}
