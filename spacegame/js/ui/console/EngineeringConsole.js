class EngineeringConsole extends Console {
  constructor(ship) {
    super(ship);

    this.mode = "None";

    this.pan_x = 0;
    this.pan_y = 0;
    this.zoom_level = 0;

    this.min_zoom = -8;
    this.max_zoom = 7;

    this.default_viewbox_size = 40;
    this.viewbox_size = this.default_viewbox_size;
  //   The sidebar header
    //
    this.sidebar = this.frame.append("div")
      .style("width", "25%")
      .style("height", "100%")
      .style("position", "absolute");

    //   The sidebar Header
    //
    this.sidebar.append("h1")
      .text("Engineering")
      .style("padding", "5px")
      .style("font-size", "125%");

    this.instructions = [
      "Controls",
      "Pan: W,A,S,D",
      "Up Level: R",
      "Down Level: F",
      "Re-Center: Space",
      "Quit: Q"
    ];

    this.sidebar.selectAll("p")
      .data(this.instructions)
      .enter()
      .append("p")
      .text(function (d) { return d; })
      .style("padding", "5px");

    this.sidebar.append("hr");

    this.buttons = [
      { "label": "Room", "parent": this, "mode": "make-room" },
      { "label": "Door", "parent": this, "mode": "make-door" },
      { "label": "Stairs", "parent": this, "mode": "make-stairs" }
    ]

    //   The "Make Room" button
    //
    this.sidebar.selectAll("div")
      .data(this.buttons)
      .enter()
      .append("div")
      .classed("button", true)
      .style("width", "80%")
      .style("margin", "5px auto 5px auto")
      .on("click", function (d) {
        if(d['parent'].mode == d['mode']) {
          d['parent'].mode = "None";
        } else {
          d['parent'].mode = "None";
          d['parent'].mode = d['mode'];
          d3.select(this).classed("active", true);
        }
        
      })
      .append("p").text(function (d) { return d['label']; });

    //   The screen where we show the ship
    //
    this.screen = this.frame.append("svg")
      .style("background-color", "#1122FF")
      .style("margin-left", "25%")
      .style("width", "75%")
      .style("height", "100%")
      .attr("viewBox", this.get_viewbox_string());

    this.draw();

    this.screen.on("mousemove", this.on_mousemove.bind(this));
    this.screen.on("mousedown", this.on_mousedown.bind(this));
    this.screen.on("mouseup", this.on_mouseup.bind(this));
    this.screen.on("mouseleave", this.on_mouseout.bind(this));
    this.screen.on("wheel", this.on_wheel.bind(this));
  }

  set mode(value) {
    if(value == this._mode) {
      return;
    }

    console.log("set mode to " + value);

    if(value == "None") {
      //   Clear any active buttons
      //
      d3.selectAll(".button.active").classed("active", false);

      //   Clear any active highlights
      //
    }
    this._mode = value;
  }

  get mode() {
    return this._mode
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

  get_viewbox_string() {
    let x = (this.pan_x - this.viewbox_size / 2);
    let y = (this.pan_y - this.viewbox_size / 2);
    return x + " " + y + " " + this.viewbox_size + " " + this.viewbox_size;
  }

  pan(dx, dy) {
    this.pan_x += dx;
    this.pan_y += dy;
    this.screen.attr("viewBox", this.get_viewbox_string());
  }

  zoom(dz) {
    this.zoom_level += dz;

    if (this.zoom_level < this.min_zoom) {
      this.zoom_level = this.min_zoom;
    }
    if (this.zoom_level > this.max_zoom) {
      this.zoom_level = this.max_zoom;
    }
    this.viewbox_size = this.default_viewbox_size * Math.pow(1.2, this.zoom_level);

    this.screen.attr("viewBox", this.get_viewbox_string());
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

    let dpan = 0.1 * Math.pow(1.2, this.zoom_level);
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

  page_to_grid(pageX, pageY) {
    let ship = this.ship;

    let rect = this.screen.node().getBoundingClientRect();

    let g = ship.grid_size;
    let p = ship.panel_size;
    let v = ship.corner_padding * 2;

    let x = Math.floor((((pageX - rect.x) / rect.width - 0.5) * this.viewbox_size + this.pan_x) / g + 0.5) - ship.data.grid_offset.x;
    let y = Math.floor((((pageY - rect.y) / rect.height - 0.5) * this.viewbox_size + this.pan_y) / g + 0.5) - ship.data.grid_offset.z;

    return {"x": x, "y": y};
  }

  is_on_screen(pageX, pageY) {
    let rect = this.screen.node().getBoundingClientRect();
    if (pageX < rect.x || pageX > rect.x + rect.width) {
      return false;
    }
    if (pageY < rect.y || pageY > rect.y + rect.height) {
      return false;
    }
    return true;
  }

  start_dragging() {
    this.dragging = true;
    this.start_drag_location = this.page_to_grid(d3.event.pageX, d3.event.pageY);
    this.last_drag = { "x": d3.event.pageX, "y": d3.event.pageY };
  }

  cancel_dragging() {
    this.dragging = false;
  }

  on_mousemove() {
    if(this.dragging) {
      if(this.mode == "None") {
        let dx = d3.event.pageX - this.last_drag.x;
        let dy = d3.event.pageY - this.last_drag.y;

        let rect = this.screen.node().getBoundingClientRect();

        let x_drag_scale = (this.viewbox_size / rect.width);
        let y_drag_scale = (this.viewbox_size / rect.height);

        this.pan(-dx * x_drag_scale, -dy * y_drag_scale);

        this.last_drag = { "x": d3.event.pageX, "y": d3.event.pageY };
      } else if(this.mode == "make-stairs") {

      } else if (this.mode == "make-room") {
        
      } else if (this.mode == "make-door") {

      }
    }
  }

  on_mousedown() {
    this.start_dragging();
  }

  on_mouseup() {
    if(this.dragging) {
      this.stop_drag_location = this.page_to_grid(d3.event.pageX, d3.event.pageY);

      if (this.stop_drag_location.x == this.start_drag_location.x && this.stop_drag_location.y == this.start_drag_location.y) {
        this.on_click();
      }

      this.cancel_dragging();
    }
  }

  on_mouseout() {
    //   we get mouse out events every time the cursors crosses an entity, most events are meaningless
    //
    if (!this.is_on_screen(d3.event.pageX, d3.event.pageY)) {
      //   If we are really out of the screen
      //
      this.cancel_dragging();
    }
  }

  on_wheel() {
    let dy = d3.event.deltaY > 0 ? 1 : -1;
    this.zoom(dy);
  }

  on_click() {
    // let ship = this.ship;
    // let click_location = this.page_to_grid(d3.event.pageX, d3.event.pageY);
    // let rect_id = "rect_" + click_location.x + "_" + click_location.y;
    // let rect = d3.select("#" + rect_id);
    // console.log("CLICK: " + click_location.x + " " + click_location.y);
    // if (rect.empty()) {
    //   this.screen.append("rect")
    //     .attr("width", ship.panel_size)
    //     .attr("height", ship.panel_size)
    //     .attr("x", this.x_transform(ship, click_location.x))
    //     .attr("y", this.y_transform(ship, click_location.y))
    //     .style("fill", function (d) { return "#abcdef"; })
    //     .attr("id", rect_id);
    // } else {
    //   rect.remove();
    // }
  }

  keypress(keycode) {
    if (keycode == window.game.keys.Q) {

      //   If we are in a mode, then 'Q' quits the mode
      //
      if(this.mode != "None") {
        this.mode = "None";
        return true;
      }
    }
    if (keycode == window.game.keys.SP) {
      this.pan(-this.pan_x, -this.pan_y);
      this.zoom(-this.zoom_level);
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
