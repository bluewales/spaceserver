class Console extends Overlay {
  constructor(ship) {
    super();

    this.ship = ship;

    this.dom = document.createElement("div");
    this.selection = d3.select(this.dom);

    this.aspect_ratio = 4 / 3;

    this.level = 0;

    this.frame = this.selection
      .style("background-color", ship_palette[2])
      .classed("ui", true)
      .append("div")
      .attr("id", "console_frame")
      .style("width", "1000px")
      .style("height", "500px")
      .style("border-style", "solid")
      .style("border-width", "15px 20px")
      .style("border-color", "#276392 #3C9FDD #40AFF0 #2B72A4")
      .style("background-color", "blue")
      .classed("center", true)
      .style("background-color", "black");
  }
}
