class ControlsCard extends ColumnatedCard {
  constructor() {
    var width = 300;
    var height = 130;
    var label = "Controls";

    var columns = [
      new InteractionCard("Action", width = 200),
      new InteractionCard("Description", width=200)
    ];

    super(label, columns);

    


    this.x = 10;
    this.y = 100;

    this.columns[0].add_text("a,s,d,w");
    this.columns[1].add_text("scroll");

    this.columns[0].add_text("q,e");
    this.columns[1].add_text("change level");

    this.columns[0].add_text("mouse wheel");
    this.columns[1].add_text("zoom");

    this.columns[0].add_text("space bar");
    this.columns[1].add_text("return to center");
  }
}
