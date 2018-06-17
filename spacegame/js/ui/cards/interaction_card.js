class InteractionCard extends Card {
  constructor(title) {
    var width = 300;
    var height = 130;

    super(title, width, height);

    this.name = title;

    this.addChild(this.line1_1);
  }

  on_close() {
    game.ship.clear_selection();
  }
  tick() {


  }
}
