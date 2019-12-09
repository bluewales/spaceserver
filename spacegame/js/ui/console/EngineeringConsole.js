class EngineeringConsole extends Console {
  constructor(ship) {
    super(ship);

    

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
    return (x + ship.data.grid_offset.x - 0.5) * ship.grid_size + ship.corner_padding * 2;
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
          d[level][ix].z = ix;
        }
        return d[level];
      })
      .enter()
      .filter(function (d) { return d.cell; })
      .append("g")
      .attr("x", function (d, i) { return d3.select(this.parentNode).attr("x"); });

    let g = ship.grid_size;
    let p = ship.panel_size;
    let c = ship.corner_padding;
    let v = ship.corner_padding * 2;

    let x_transform = this.x_transform;
    let y_transform = this.y_transform;

    this.grid.append("rect")
      .attr("width", p + 2 * v)
      .attr("height", p + 2 * v)
      .attr("y", function (d) { return y_transform(ship, d.z) - v; })
      .attr("x", function (d) { return x_transform(ship, d.x) - v; })
      .style("fill", function (d) { return "#ffffff"; });

    this.grid.append("polygon")
      .attr("points", function (d) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, d.z);
        if (d.walls.n == "door") {
          return [
            (x - v) + "," + (y - v),
            (x + p + v) + "," + (y - v),
            (x + p + v) + "," + (y),
            (x + p * 3 / 4) + "," + (y),
            (x + p * 3 / 4 - c) + "," + (y - v),
            (x + p / 4 + c) + "," + (y - v),
            (x + p / 4) + "," + (y),
            (x - v) + "," + (y)
          ].join(" ");
        } else if (d.walls.n == "wall") {
          return [(x - v) + "," + (y - v), (x + p + v) + "," + (y - v), (x + p + v) + "," + (y), (x - v) + "," + (y)].join(" ");
        } else if (d.walls.n == "window") {
          return [
            (x - v) + "," + (y - v),
            (x + p + v) + "," + (y - v),
            (x + p + v) + "," + (y),
            (x + p - c) + "," + (y),
            (x + p - c) + "," + (y - v / 2),
            (x + c) + "," + (y - v / 2),
            (x + c) + "," + (y),
            (x - v) + "," + (y)
          ].join(" ");
        } else {
          return [(x - v) + "," + (y - v), (x + p + v) + "," + (y - v)].join(" ");
        }
      });

    this.grid.append("polygon")
      .attr("points", function (d) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, d.z);
        if (d.walls.w == "door") {
          return [
            (x - v) + "," + (y - v),
            (x) + "," + (y - v),
            (x) + "," + (y + p / 4),
            (x - v) + "," + (y + p / 4 + c),
            (x - v) + "," + (y + p * 3 / 4 - c),
            (x) + "," + (y + p * 3 / 4),
            (x) + "," + (y + p + v),
            (x - v) + "," + (y + p + v)
          ].join(" ");
        } else if (d.walls.w == "wall") {
          return [(x - v) + "," + (y - v), (x) + "," + (y - v), (x) + "," + (y + p + v), (x - v) + "," + (y + p + v)].join(" ");
        } else if (d.walls.w == "window") {
          return [
            (x - v) + "," + (y - v),
            (x) + "," + (y - v),
            (x) + "," + (y + c),
            (x - v / 2) + "," + (y + c),
            (x - v / 2) + "," + (y + p - c),
            (x) + "," + (y + p - c),
            (x) + "," + (y + p + v),
            (x - v) + "," + (y + p + v)
          ].join(" ");
        } else {
          return [(x - v) + "," + (y - v), (x - v) + "," + (y + p + v)].join(" ");
        }
      });

    this.grid.append("polygon")
      .attr("points", function (d) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, d.z);
        if (d.walls.s == "door") {
          return [
            (x - v) + "," + (y + p),
            (x + p / 4) + "," + (y + p),
            (x + p / 4 + c) + "," + (y + p + v),
            (x + p * 3 / 4 - c) + "," + (y + p + v),
            (x + p * 3 / 4) + "," + (y + p),
            (x + p + v) + "," + (y + p),
            (x + p + v) + "," + (y + p + v),
            (x - v) + "," + (y + p + v)
          ].join(" ");
        } else if (d.walls.s == "wall") {
          return [(x - v) + "," + (y + p), (x + p + v) + "," + (y + p), (x + p + v) + "," + (y + p + v), (x - v) + "," + (y + p + v)].join(" ");
        } else if (d.walls.s == "window") {
          return [
            (x - v) + "," + (y + p),
            (x + c) + "," + (y + p),
            (x + c) + "," + (y + p + v / 2),
            (x + p - c) + "," + (y + p + v / 2),
            (x + p - c) + "," + (y + p),
            (x + p + v) + "," + (y + p),
            (x + p + v) + "," + (y + p + v),
            (x - v) + "," + (y + p + v)
          ].join(" ");
        } else {
          return [(x + p + v) + "," + (y + p + v), (x - v) + "," + (y + p + v)].join(" ");
        }
      });

    this.grid.append("polygon")
      .attr("points", function (d, i) {
        let x = x_transform(ship, d.x);
        let y = y_transform(ship, d.z);
        if (d.walls.e == "door") {
          return [
            (x + p) + "," + (y - v),
            (x + p) + "," + (y + p / 4),
            (x + p + v) + "," + (y + p / 4 + c),
            (x + p + v) + "," + (y + p * 3 / 4 - c),
            (x + p) + "," + (y + p * 3 / 4),
            (x + p) + "," + (y + p + v),
            (x + p + v) + "," + (y + p + v),
            (x + p + v) + "," + (y - v)
          ].join(" ");
        } else if (d.walls.e == "wall") {
          return [(x + p) + "," + (y - v), (x + p) + "," + (y + p + v), (x + p + v) + "," + (y + p + v), (x + p + v) + "," + (y - v)].join(" ");
        } else if (d.walls.e == "window") {
          return [
            (x + p) + "," + (y - v),
            (x + p) + "," + (y + c),
            (x + p + v / 2) + "," + (y + c),
            (x + p + v / 2) + "," + (y + p - c),
            (x + p) + "," + (y + p - c),
            (x + p) + "," + (y + p + v),
            (x + p + v) + "," + (y + p + v),
            (x + p + v) + "," + (y - v)
          ].join(" ");
        } else {
          return [(x + p + v) + "," + (y + p + v), (x + p + v) + "," + (y - v)].join(" ");
        }
      });

    this.grid.selectAll("polygon")
      .style("stroke", "black")
      .style("stroke-width", "0.1%")
      .style("fill", "black")
      .style("fill-opacity", "1.0")

    this.grid.append("image")
      .attr("href", function(d) {
        if(d.contents) {
          if(d.contents.type == "console") {
            return "img/items/console.png";
          } else if (d.contents.type == "stairs") {
            return "img/items/stairs_down.png";
          } else if (d.contents.type == "stairs_base") {
            return "img/items/stairs_up.png";
          } else {
            return "img/items/gear.png";
          }
        }
      })
      // .attr("transform","rotate(" + r + ")")
      .attr("x", function (d) {
        return x_transform(ship, d.x);
      })
      .attr("y", function (d) {
        return y_transform(ship, d.z);
      })
      .attr("width", p + "px");
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

    if(this.r == undefined) {
      this.r = 1;
    } else {
      this.r += 1;
    }

    let dpan = 0.1;
    if (window.keysPressed[window.game.keys.W]) {
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

    // this.screen.append("rect")
    //   .attr("width", ship.panel_size)
    //   .attr("height", ship.panel_size)
    //   .attr("x", this.x_transform(ship, x))
    //   .attr("y", this.y_transform(ship, y))
    //   .style("fill", function (d) { return "#abcdef"; });
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
