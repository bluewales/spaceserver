class BottomBar extends Bar {
  constructor() {

    var button_data = [
      {
        "text":"Build",
        "card": new BuildCard()
      }
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Crew"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Jobs"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Trade"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Navigation"));
    ];

    super(false, button_data);

  }
}
