class EngineeringConsole extends Overlay {
  constructor(ship) {
    super();

    this.dom = document.createElement("div");
    this.selection = d3.select(this.dom);
    this.ship = ship;

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
      .style("background-color", "#2F182F");

    this.pan_x = 0;    
    this.pan_y = 0;

    this.viewbox_size = 20;

    
    this.sidebar = this.frame.append("div")
      .style("width", "25%")
      .style("height", "100%")
      .style("position", "absolute");

    this.sidebar.append("h1")    
      .text("Engineering")
      .style("padding", "5px")
      .style("font-size", "125%");

    this.sidebar.append("p")
      .text("Pan: W,A,S,D")
      .style("padding", "5px");

    this.sidebar.append("p")
      .text("Up Level: R")
      .style("padding", "5px");

    this.sidebar.append("p")
      .text("Down Level: F")
      .style("padding", "5px");

    this.sidebar.append("p")
      .text("Re-Center: Space")
      .style("padding", "5px");

    this.sidebar.append("p")
      .text("Quit: Q")
      .style("padding", "5px");
      

    this.screen = this.frame.append("svg")
      .style("background-color", "#1122FF")
      .style("margin-left", "25%")
      .style("width", "75%")
      .style("height", "100%")
      .attr("viewBox", this.viewbox_string);

    this.draw();

    this.screen
      .on("click", this.on_click.bind(this));
  }

  x_transform(ship, x) {
    return (x + ship.data.grid_offset.x - 0.5) * ship.grid_size + ship.corner_padding*2;
  }

  y_transform(ship, y) {
    return (y + ship.data.grid_offset.z - 0.5) * ship.grid_size + ship.corner_padding * 2;
  }

  draw() {
    let ship = this.ship;
    let level = this.level;

    // console.log("draw " + level);

    this.screen.selectAll("g").remove();

    this.grid = this.screen
      .selectAll("g")
      .data(ship.data.grid)
      .enter()
      .append("g").attr("x", function (d, i) { return i; })
      .selectAll("g")
      .data(function (d, i) {
        if (!d[level]) {
          return [];
        }
        for (let ix = 0; ix < d[level].length; ix += 1) {
          d[level][ix].x = i;
        }
        return d[level];
      })
      .enter()
      .append("g")
      .attr("x", function (d, i) { return d3.select(this.parentNode).attr("x"); });

    let g = ship.grid_size;
    let p = ship.panel_size;
    let v = ship.corner_padding * 2;

    let x_transform = this.x_transform;
    let y_transform = this.y_transform;

    this.grid.append("rect")
      .attr("width", ship.panel_size)
      .attr("height", ship.panel_size)
      .attr("y", function (d, i) { return y_transform(ship, i); })
      .attr("x", function (d, i) { return x_transform(ship, d.x); })
      .style("fill", function (d) { return "#ffffff"; });

    this.grid.append("polygon")
      .attr("points", function (d, i) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, i);
        return (x - v) + "," + (y - v) + " " + (x + g - v) + "," + (y - v) + " " + (x + p) + "," + (y) + " " + (x) + "," + (y);
      })
      .style("fill", function (d) { return d.walls.n ? "#2F182F" : "#ffffff"; });

    this.grid.append("polygon")
      .attr("points", function (d, i) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, i);
        return (x - v) + "," + (y - v) + " " + (x) + "," + (y - 0) + " " + (x) + "," + (y + p) + " " + (x - v) + "," + (y + p + v);
      })
      .style("fill", function (d) { return d.walls.w ? "#2F182F" : "#ffffff"; });

    this.grid.append("polygon")
      .attr("points", function (d, i) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, i);
        return (x) + "," + (y + p) + " " + (x + p) + "," + (y + p) + " " + (x + p + v) + "," + (y + p + v) + " " + (x - v) + "," + (y + p + v);
      })
      .style("fill", function (d) { return d.walls.s ? "#2F182F" : "#ffffff"; });

    this.grid.append("polygon")
      .attr("points", function (d, i) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, i);
        return (x + p) + "," + (y) + " " + (x + p) + "," + (y + p) + " " + (x + p + v) + "," + (y + p + v) + " " + (x + p + v) + "," + (y - v);
      })
      .style("fill", function (d) { return d.walls.e ? "#2F182F" : "#ffffff"; });
  }

  get viewbox_string() {
    let x = (this.pan_x - this.viewbox_size / 2); 
    let y = (this.pan_y - this.viewbox_size / 2);
    return x + " " + y + " " + this.viewbox_size + " " + this.viewbox_size;
  }

  pan(dx, dy) {
    this.pan_x += dx;
    this.pan_y += dy;
    this.screen.attr("viewBox", this.viewbox_string);
  }

  change_level(dlevel) {
    this.level += dlevel;
    this.draw();
  }

  tick() {
    let dpan = 0.1;
    if(window.keysPressed[window.game.keys.W]) {
      this.pan(0, dpan);
    } else if (window.keysPressed[window.game.keys.S]) {
      this.pan(0, -dpan);
    }
    if (window.keysPressed[window.game.keys.A]) {
      this.pan(dpan, 0);
    } else if (window.keysPressed[window.game.keys.D]) {
      this.pan(-dpan, 0);
    }
  }

  on_click() {
    let ship = this.ship;
    
    let rect = this.screen.node().getBoundingClientRect()

    let g = ship.grid_size;
    let p = ship.panel_size;
    let v = ship.corner_padding * 2;

    // return (x + ship.data.grid_offset.x - 0.5) * g;

    let x = Math.floor((((d3.event.pageX - rect.x) / rect.width - 0.5) * this.viewbox_size + this.pan_x) / g + 0.5) - ship.data.grid_offset.x;
    let y = Math.floor((((d3.event.pageY - rect.y) / rect.height - 0.5) * this.viewbox_size + this.pan_y) / g + 0.5) - ship.data.grid_offset.z;

    console.log(rect);
    console.log(x);
    console.log(y);

    

    this.screen.append("rect")
      .attr("width", ship.panel_size)
      .attr("height", ship.panel_size)
      .attr("x", this.x_transform(ship, x))
      .attr("y", this.y_transform(ship, y))
      .style("fill", function (d) { return "#abcdef"; });
  }

  keypress(keycode) {
    if (keycode == window.game.keys.SP) {
      this.pan(-this.pan_x, -this.pan_y);
      this.change_level(-this.level);
    }
    if (keycode == window.game.keys.R) {
      this.change_level(1);
    }
    if (keycode == window.game.keys.F) {
      this.change_level(-1);
    }
  }

  update_size(width, height) {
    let center = width / 2;

    if (height > width / this.aspect_ratio) {
      // console.log("reduce height from " + height + " to " + width / this.aspect_ratio);
      height = width / this.aspect_ratio;
    }

    if (width > height * this.aspect_ratio) {
      // console.log("reduce width from " + width + " to " + height * this.aspect_ratio);
      width = height * this.aspect_ratio;
    }

    this.width = width;
    this.height = height;

    this.selection
      .style("width", width + "px")
      .style("height", height + "px")
      .style("left", (center - width / 2) + "px");

    this.frame
      .style("width", (width - 80) + "px")
      .style("height", (height - 60) + "px");
  }
}
