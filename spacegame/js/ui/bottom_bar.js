class BottomBar extends createjs.Container {
  constructor() {
    super();

    this.bar_height = 40;
    this.width = 100;
    this.height = 100;

    this.button_width = 100;
    this.button_height = this.bar_height;

    this.box = new createjs.Container();
    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(0, this.height-this.bar_height, this.width, this.height).endFill();
    this.addChild(this.box);

    this.button_data = [
      {
        "name":"Build",
        "card": new BuildCard()
      }
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Crew"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Jobs"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Trade"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Navigation"));
    ];

    this.buttons = new createjs.Container();
    for(var i = 0; i < this.button_data.length; i++) {
      var button_data = this.button_data[i];
      var button_config = {
        "width": this.button_width,
        "height": this.button_height,
        "text": button_data.name,
        "on_click": button_data.on_click
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
      button.active = true;
      button_data.card.active = true;
      this.button_data[i].button = button;
    }
    this.addChild(this.buttons);

  }


  resize(width, height) {
    this.width = width;
    this.height = height;

    this.box.graphics.clear().beginFill(menu_palette[0]).drawRect(0, this.height-this.bar_height, this.width, this.height).endFill();

    var buttons = this.buttons.children;

    for(var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var half = buttons.length/2;
      button.x = width/2 - this.button_width*(half - i);
      button.y = height - this.button_height;
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
