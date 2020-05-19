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
    this.viewbox_string = this.get_viewbox_string();

    this.instructions = [
      "Controls",
      "Pan: W,A,S,D",
      "Up Level: R",
      "Down Level: F",
      "Re-Center: Space",
      "Quit: Q"
    ];

    this.buttons = [
      { "label": "Room", "mode": "make-room" },
      { "label": "Door", "mode": "make-door" },
      { "label": "Window", "mode": "make-window" },
      { "label": "Stairs", "mode": "make-stairs" }
    ];

    this.icons = {
      "console": "img/items/console.png",
      "stairs": "img/items/stairs_down.png",
      "stairs_base": "img/items/stairs_up.png",
      "default": "img/items/gear.png"
    };

    this.screen = Vue.component("engineering-console-screen", {
      data: (function () { return this; }).bind(this),
      template: `
      <div id="engineering-console-screen" style="width: 100%; height: 100%;">
        <engineering-console-sidebar></engineering-console-sidebar>
        <engineering-map></engineering-map>
      </div>
      `
    });

    this.sidebar = Vue.component("engineering-console-sidebar", {
      data: (function () { return this; }).bind(this),
      template: `
      <div style="width: 25%; height: 100%; position: absolute;">
        <h1 style="padding: 5px; font-size: 125%;">Engineering</h1>
        <p v-for="instruction in instructions" style="padding: 5px;">{{ instruction }}</p>
        <hr>
        <button v-for="button in buttons" v-bind:class="{ active: button.mode==$data.mode }" v-on:click="$data.mode=button.mode">
          {{ button.label }}
        </button>
      </div>
      `
    });

    this.map = Vue.component("engineering-map", {
      data: (function () { return this; }).bind(this),
      template: `
      <svg v-bind:viewBox="viewbox_string" 
        id="engineering-map"
        style="background-color: rgb(17, 34, 255); margin-left: 25%; width: 75%; height: 100%;"
        v-on:mousemove="$data.on_mousemove($event)"
        v-on:mousedown="$data.on_mousedown($event)"
        v-on:mouseup="$data.on_mouseup($event)"
        v-on:mouseleave="$data.on_mouseout($event)"
        v-on:wheel="$data.on_wheel($event)"
      >
        <g v-for="(x_grid, ix) in ship.data.grid">
          <engineering-map-cell v-for="(z_grid, iz) in x_grid[level]" v-if="z_grid.cell"
            v-bind:key="[ix, level, iz].join(',')"
            v-bind:x="$data.x_transform(ix) - ship.corner_padding * 2"
            v-bind:y="$data.y_transform(iz) - ship.corner_padding * 2"
            v-bind:grid="z_grid"
          ></engineering-map-cell>
          </g>
        </g>
      </svg>
      `,
      methods: {
        
      }
    });

    Vue.component("engineering-map-cell", {
      data: (function () { return this; }).bind(this),
      props: ['x', 'y', 'grid'],
      template: `
      <g>
        <rect v-bind:width="ship.grid_size" v-bind:height="ship.grid_size" v-bind:x="x" v-bind:y="y" fill="white"></rect>
        <polygon class="cell-border" v-bind:points="$data.get_wall(x, y, grid)"></polygon>
        <image v-if="grid.contents" v-bind:href="icons[grid.contents.type]" v-bind:x="x" v-bind:y="y" v-bind:width="ship.grid_size +'px'"></image>
      </g>
      `
    });

    
  }

  set mode(value) {
    //   If a button is pressed twice, toggle
    //
    if (this.mode && value == this._mode) {
      value = "None";
    }

    console.log("set mode to " + value);
    this._mode = value;
  }

  get mode() {
    return this._mode
  }

  x_transform(x) {
    return (x + this.ship.data.grid_offset.x - 0.5) * (this.ship.grid_size) + this.ship.corner_padding * 2;
  }

  y_transform(y) {
    return (y + this.ship.data.grid_offset.z - 0.5) * (this.ship.grid_size) + this.ship.corner_padding * 2;
  }

  get_wall(x, y, grid) {
    let ship = this.ship;

    let g = ship.grid_size;
    let p = ship.panel_size;
    let c = ship.corner_padding;
    let v = ship.corner_padding * 2;

    let result = [];

    result = result.concat([(x)+','+(y), (x+g)+','+(y), (x+g)+','+(y+g), (x)+','+(y+g), (x)+','+(y)]);

    if (grid.walls.w) {
      result = result.concat([(x+v)+','+(y)]);
      if (grid.walls.w == "window") {
        result = result.concat([(x+v)+','+(y+v*2), (x+c)+','+(y+v*2), (x+c)+','+(y+g-v*2), (x+v)+','+(y+g-v*2)]);
      } else if (grid.walls.w == "door") {
        result = result.concat([(x+v)+','+(y+g*1/4), (x)+','+(y+g*1/4+c), (x)+','+(y+g*3/4-c), (x+v)+','+(y+g*3/4)]);
      }
      result = result.concat([(x+v)+','+(y+g), (x)+','+(y+g)]);
    } else {
      result = result.concat([(x)+','+(y+g)]);
    }

    if (grid.walls.s) {
      result = result.concat([(x)+','+(y+g-v)]);
      if (grid.walls.s == "window") {
        result = result.concat([(x+v*2)+','+(y+g-v), (x+v*2)+','+(y+g-c), (x+g-v*2)+','+(y+g-c), (x+g-v*2)+','+(y+g-v)]);
      } else if (grid.walls.s == "door") {
        result = result.concat([(x+g*1/4)+','+(y+g-v), (x+g*1/4+c)+','+(y+g), (x+g*3/4-c)+','+(y+g), (x+g*3/4)+','+(y+g-v)]);
      }
      result = result.concat([(x+g)+','+(y+g-v), (x+g)+','+(y+g)]);
    } else {
      result = result.concat([(x+g)+','+(y+g)]);
    }

    if (grid.walls.e) {
      result = result.concat([(x+g-v)+','+(y+g)]);
      if (grid.walls.e == "window") {
        result = result.concat([(x+g-v)+','+(y+g-v*2), (x+g-c)+','+(y+g-v*2), (x+g-c)+','+(y+v*2), (x+g-v)+','+(y+v*2)]);
      } else if (grid.walls.e == "door") {
        result = result.concat([(x+g-v)+','+(y+g*3/4), (x+g)+','+(y+g*3/4-c), (x+g)+','+(y+g*1/4+c), (x+g-v)+','+(y+g*1/4)]);
      }
      result = result.concat([(x+g-v)+','+(y), (x+g)+','+(y)]);
    } else {
      result = result.concat([(x+g)+','+(y)]);
    }

    if (grid.walls.n) {
      result = result.concat([(x+g)+','+(y+v)]);
      if (grid.walls.n == "window") {
        result = result.concat([(x+g-v*2)+','+(y+v), (x+g-v*2)+','+(y+c), (x+v*2)+','+(y+c), (x+v*2)+','+(y+v)]);
      } else if (grid.walls.n == "door") {
        result = result.concat([(x+g*3/4)+','+(y+v), (x+g*3/4-c)+','+(y), (x+g*1/4+c)+','+(y), (x+g*1/4)+','+(y+v)]);
      }
      result = result.concat([(x)+','+(y+v), (x)+','+(y)]);
    } else {
      result = result.concat([(x)+','+(y)]);
    }

    return result.join(" ");

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
    
    this.viewbox_string = this.get_viewbox_string();
  }

  zoom(dz) {
    this.zoom_level += dz;

    if (this.zoom_level < this.min_zoom) {
      this.zoom_level = this.min_zoom;
    }
    if (this.zoom_level > this.max_zoom) {
      this.zoom_level = this.max_zoom;
    }
    this.viewbox_size = this.default_viewbox_size*Math.pow(1.2, this.zoom_level);

    this.viewbox_string = this.get_viewbox_string();
  }

  change_level(dlevel) {
    this.level += dlevel;
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

    let rect = document.getElementById("engineering-map").getBoundingClientRect();

    let g = ship.grid_size;
    let p = ship.panel_size;
    let v = ship.corner_padding * 2;

    let x = Math.floor((((pageX - rect.x) / rect.width - 0.5) * this.viewbox_size + this.pan_x) / g + 0.5) - ship.data.grid_offset.x;
    let y = Math.floor((((pageY - rect.y) / rect.height - 0.5) * this.viewbox_size + this.pan_y) / g + 0.5) - ship.data.grid_offset.z;

    return {"x": x, "y": y};
  }

  is_on_screen(pageX, pageY) {
    let rect = document.getElementById("engineering-map").getBoundingClientRect();
    if (pageX < rect.x || pageX > rect.x + rect.width) {
      return false;
    }
    if (pageY < rect.y || pageY > rect.y + rect.height) {
      return false;
    }
    return true;
  }

  start_dragging(pageX, pageY) {
    this.dragging = true;
    this.start_drag_location = this.page_to_grid(pageX, pageY);
    this.last_drag = { "x": pageX, "y": pageY };
  }

  cancel_dragging() {
    this.dragging = false;
  }

  on_mousemove(event) {
    if(this.dragging) {
      if(this.mode == "None") {
        let dx = event.pageX - this.last_drag.x;
        let dy = event.pageY - this.last_drag.y;

        let rect = document.getElementById("engineering-map").getBoundingClientRect();

        let x_drag_scale = (this.viewbox_size / rect.width);
        let y_drag_scale = (this.viewbox_size / rect.height);

        this.pan(-dx * x_drag_scale, -dy * y_drag_scale);

        this.last_drag = { "x": event.pageX, "y": event.pageY };
      } else if(this.mode == "make-stairs") {

      } else if (this.mode == "make-room") {
        
      } else if (this.mode == "make-door") {

      }
    }
  }

  on_mousedown(event) {
    this.start_dragging(event.pageX, event.pageY);
  }

  on_mouseup(event) {
    if(this.dragging) {
      this.stop_drag_location = this.page_to_grid(event.pageX, event.pageY);

      if (this.stop_drag_location.x == this.start_drag_location.x && this.stop_drag_location.y == this.start_drag_location.y) {
        this.on_click(event);
      }

      this.cancel_dragging();
    }
  }

  on_mouseout(event) {
    //   we get mouse out events every time the cursors crosses an entity, most events are meaningless
    //
    if (!this.is_on_screen(event.pageX, event.pageY)) {
      //   If we are really out of the screen
      //
      this.cancel_dragging();
    }
  }

  on_wheel(event) {
    let dy = event.deltaY > 0 ? 1 : -1;
    this.zoom(dy);
  }

  

  on_click(event) {
    // let ship = this.ship;
    // let click_location = this.page_to_grid(pageX, pageY);
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
}
