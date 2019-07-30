class EngineeringConsole extends Overlay {
  constructor(ship) {
    super();

    this.dom = document.createElement("div");
    this.selection = d3.select(this.dom);

    this.aspect_ratio = 4/3;

    this.frame = this.selection
      .style("background-color", ship_palette[2])
      .classed("ui", true)
      .append("div")
        .attr("id", "console_frame")
        .style("width", "1000px")
        .style("height", "500px")
        .style("border-style", "solid")
        .style("border-width", "20px")
        .style("border-color", "#276392 #3C9FDD #40AFF0 #2B72A4")
        .style("background-color", "blue")
        .classed("center", true);

    this.screen = this.frame.append("svg")
      .style("background-color", "#2F182F")
      .style("width", "100%")
      .style("height", "100%")
      .attr("viewBox", "0 0 400 300");

    var jsonCircles = [
      {"radius": 10, "color": "green" },
      {"radius": 10, "color": "purple" },
      {"radius": 10, "color": "blue" },
      {"radius": 10, "color": "red" }
    ];
    
    var circles = this.screen.selectAll("circle")
      .data(jsonCircles)
      .enter()
      .append("circle");

    circles
      .attr("cx", function () { return Math.random()*400; })
      .attr("cy", function () { return Math.random()*300; })
      .attr("r", function (d) { return d.radius; })
      .style("fill", function (d) { return d.color; })
      .on("mouseover", function () {
        let size = d3.select(this).attr("r") * 1;
        d3.select(this)
          .attr("cx", function () { return Math.random()*400; })
          .attr("cy", function () { return Math.random()*300; })
          .attr("r", function () { return size + 1; });
      });
  }

  update_size(width, height) {
    let center = width / 2;

    if (height > width / this.aspect_ratio) {
      console.log("reduce height from " + height + " to " + width / this.aspect_ratio);
      height = width / this.aspect_ratio;
    }

    if (width > height * this.aspect_ratio) {
      console.log("reduce width from " + width + " to " + height * this.aspect_ratio);
      width = height * this.aspect_ratio;
    }

    this.width = width;
    this.height = height;

    this.selection
      .style("width", width + "px")
      .style("height", height + "px")
      .style("left", (center - width / 2) + "px");

    this.frame
      .style("width", (width - 70) + "px")
      .style("height", (height - 70) + "px");
  }
}
