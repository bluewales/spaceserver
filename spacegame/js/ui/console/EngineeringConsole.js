class EngineeringConsole extends Console {
  constructor(ship) {
    super(ship);

    

    this.pan_x = 0;
    this.pan_y = 0;
    this.zoom_level = 0;

    this.min_zoom = -8;
    this.max_zoom = 7;

    this.default_viewbox_size = 40;
    this.viewbox_size = this.default_viewbox_size;

    //   Mouse information
    //
    this.last_drag = { "x": 0, "y": 0 };
    this.last_move = { "x": 0, "y": 0 };

    //   Location is mouse information, but in grid-land
    //
    this.last_drag_location = { "x": 0, "y": 0 };
    this.last_move_location = { "x": 0, "y": 0 };
    

    //   A steralized data container for handing to Vue.  
    // Things inside have getters and setters defined below
    //
    this.data.instructions = [
      "Controls",
      "Pan: W,A,S,D",
      "Up Level: R",
      "Down Level: F",
      "Re-Center: Space",
      "Quit: Q"
    ];
    this.data.buttons= [
      { "label": "Room", "mode": "make-room" },
      { "label": "Door", "mode": "make-door" },
      { "label": "Window", "mode": "make-window" },
      { "label": "Wall", "mode": "make-wall" }
    ];
    this.data.icons= {
      "console": "img/items/console.png",
      "stairs": "img/items/stairs_down.png",
      "stairs_base": "img/items/stairs_up.png",
      "default": "img/items/gear.png"
    };
    this.data.viewbox_string = this.get_viewbox_string();
    this.data.grid = ship.data.grid;
    this.data.level = 0;
    this.data.grid_size = ship.grid_size;
    this.data.corner_padding = ship.corner_padding;
    this.data.get_wall = this.get_wall.bind(this);
    this.data.mode = "None";
    this.data.highlight = {
      "x1": 0, "y1": 0, "z1": 0,
      "x2": 0, "y2": 0, "z2": 0,
      "dir": "n",
      "ok": true,
      "pressed": false
    };

    this.data.screen = Vue.component("engineering-console-screen", {
      props: ["data"],
      template: `
      <div id="engineering-console-screen" style="width: 100%; height: 100%;">
        <engineering-console-sidebar v-bind:data="data"></engineering-console-sidebar>
        <engineering-map v-bind:data="data"></engineering-map>
      </div>
      `
    });

    this.sidebar = Vue.component("engineering-console-sidebar", {
      props: ["data"],
      template: `
      <div style="width: 25%; height: 100%; position: absolute;">
        <h1 style="padding: 5px; font-size: 125%;">Engineering</h1>
        <p v-for="instruction in data.instructions" style="padding: 5px;">{{ instruction }}</p>
        <hr>
        <button v-for="button in data.buttons" v-bind:class="{ active: button.mode==data.mode }" v-on:click="change_mode(button.mode)">
          {{ button.label }}
        </button>
      </div>
      `,
      methods: {
        "change_mode": function (new_mode) { this.mode = new_mode; }.bind(this),
      }
    });

    
        

    this.map = Vue.component("engineering-map", {
      props: ["data"],
      template: `
      <svg v-bind:viewBox="data.viewbox_string" 
        id="engineering-map"
        style="background-color: rgb(17, 34, 255); margin-left: 25%; width: 75%; height: 100%;"
        v-on:mousemove="mousemove"
        v-on:mousedown="mousedown"
        v-on:mouseup="mouseup"
        v-on:mouseleave="mouseout"
        v-on:wheel="wheel"
        :key="data.highlight.ok"
      >
        <g v-for="(x_grid, ix) in data.grid">
          <engineering-map-cell v-for="(z_grid, iz) in x_grid[data.level]"
            v-bind:key="[ix, data.level, iz].join(',')"
            v-bind:data="data"
            v-bind:x="(ix-0.5)*(data.grid_size)"
            v-bind:y="(iz-0.5)*(data.grid_size)"
            v-bind:cell="z_grid"
          ></engineering-map-cell>
        </g>
        <g class="highlight" >
          <rect id="room-highlight" v-if="data.mode=='make-room'"
            v-bind:width="data.grid_size*(1 + Math.abs(data.highlight.x2 - data.highlight.x1))"
            v-bind:height="data.grid_size*(1 + Math.abs(data.highlight.z2 - data.highlight.z1))"
            v-bind:x="(Math.min(data.highlight.x1, data.highlight.x2)-0.5)*(data.grid_size)"
            v-bind:y="(Math.min(data.highlight.z1, data.highlight.z2)-0.5)*(data.grid_size)"
            v-bind:fill="data.highlight.ok?(data.highlight.pressed?'green':'yellow'):'red'"
          ></rect>
          <rect id="wall-highlight" v-if="data.mode == 'make-door' || data.mode == 'make-window' || data.mode == 'make-wall'"
            v-bind:width="(data.highlight.dir=='n'||data.highlight.dir=='s'?data.grid_size:0)+data.corner_padding*4"
            v-bind:height="(data.highlight.dir=='n'||data.highlight.dir=='s'?0:data.grid_size)+data.corner_padding*4"
            v-bind:x="(data.highlight.x1+(data.highlight.dir=='e'?+0.5:-0.5))*(data.grid_size)-data.corner_padding*2"
            v-bind:y="(data.highlight.z1+(data.highlight.dir=='s'?+0.5:-0.5))*(data.grid_size)-data.corner_padding*2"
            v-bind:fill="data.highlight.ok?(data.highlight.pressed?'green':'yellow'):'red'"
          ></rect>
        </g>
      </svg>
      `,
      methods: {
        "mousemove": this.on_mousemove.bind(this),
        "mousedown": this.on_mousedown.bind(this),
        "mouseup": this.on_mouseup.bind(this),
        "mouseout": this.on_mouseout.bind(this),
        "wheel": this.on_wheel.bind(this),
      }
    });

  //data.mode == 'make-door' || data.mode == 'make-window' || data.mode == 'make-wall'

    Vue.component("engineering-map-cell", {
      props: ['data', 'x', 'y', 'cell'],
      template: `
      <g>
        <rect v-bind:width="data.grid_size" v-bind:height="data.grid_size" v-bind:x="x" v-bind:y="y" fill="white"></rect>
        <polygon class="cell-border" v-bind:points="data.get_wall(x, y, cell)"></polygon>
        <image v-if="cell.contents" v-bind:href="data.icons[cell.contents.type]" v-bind:x="x" v-bind:y="y" v-bind:width="data.grid_size +'px'"></image>
      </g>
      `
    });
  }

  //   These getters and setters are for steralized data for vue
  //
  set viewbox_string(value) {
    this.data.viewbox_string = value;
  }
  get viewbox_string() {
    return this.data.viewbox_string;
  }
  set level(value) {
    this.data.level = value;
  }
  get level() {
    return this.data.level;
  }
  set highlight(value) {
    this.data.highlight = value;
  }
  get highlight() {
    return this.data.highlight;
  }
  set mode(value) {
    //   If a button is pressed twice, toggle
    //
    if (value == this.data.mode) {
      value = "None";
    }
    console.log("set mode to " + value);
    this.data.mode = value;
  }
  get mode() {
    return this.data.mode
  }

  x_transform(x) {
    return (x - 0.5) * (this.ship.grid_size) + this.ship.corner_padding * 2;
  }

  y_transform(y) {
    return (y - 0.5) * (this.ship.grid_size) + this.ship.corner_padding * 2;
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

    let x = (((pageX - rect.x) / rect.width - 0.5) * this.viewbox_size + this.pan_x) / g + 0.5;
    let y = (((pageY - rect.y) / rect.height - 0.5) * this.viewbox_size + this.pan_y) / g + 0.5;

    let fx = x - Math.floor(x);
    let fy = y - Math.floor(y);

    let dir = "t";
    if (fx > fy) {
      dir =  (1 - fx > fy) ? "n" : "e";
    } else {
      dir = (1 - fx > fy) ? "w" : "s";
    }
    
    let grid_coords = { "x": Math.floor(x), "y": Math.floor(y), "dir": dir };
    return grid_coords;
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
    this.last_drag_location = this.start_drag_location;
    this.start_drag = { "x": pageX, "y": pageY };
    this.last_drag = { "x": pageX, "y": pageY };

    this.highlight.pressed = true;
  }

  cancel_dragging() {

    if (this.dragging) {
      if (this.mode == "None") {
        
      } else if (this.mode == "make-stairs") {

      } else if (this.mode == "make-room") {
        this.ship.structure.create_room(this.highlight);
        this.highlight.ok = this.ship.structure.check_room(this.highlight);
      } else if (this.mode == "make-wall") {
        this.ship.structure.create_wall(this.highlight);
        this.highlight.ok = this.ship.structure.check_wall(this.highlight);
      } else if (this.mode == "make-door") {
        this.ship.structure.create_door(this.highlight);
        this.highlight.ok = this.ship.structure.check_door(this.highlight);
      } else if (this.mode == "make-window") {
        this.ship.structure.create_window(this.highlight);
        this.highlight.ok = this.ship.structure.check_window(this.highlight);
      }
    }

    this.dragging = false;
    
    this.highlight.x1 = this.highlight.x2 = this.last_move_location.x;
    this.highlight.z1 = this.highlight.z2 = this.last_move_location.y;
    this.highlight.pressed = false;
  }

  on_mousemove(event) {
    let move_location = this.page_to_grid(event.pageX, event.pageY);
    

    

    if(this.dragging) {

      this.highlight.x1 = this.start_drag_location.x;
      this.highlight.y1 = this.level;
      this.highlight.z1 = this.start_drag_location.y;
      this.highlight.x2 = move_location.x;
      this.highlight.y2 = this.level;
      this.highlight.z2 = move_location.y;

      let fx = event.pageX - this.start_drag.x;
      let fy = event.pageY - this.start_drag.y;
      if (fx == 0 && fy == 0) {
        this.highlight.dir = move_location.dir;
      } else if (fx > fy) {
        this.highlight.dir = (fx < -fy) ? "n" : "e";
      } else {
        this.highlight.dir = (fx < -fy) ? "w" : "s";
      }

      if(this.mode == "None") {
        let dx = event.pageX - this.last_drag.x;
        let dy = event.pageY - this.last_drag.y;

        let rect = document.getElementById("engineering-map").getBoundingClientRect();

        let x_drag_scale = (this.viewbox_size / rect.width);
        let y_drag_scale = (this.viewbox_size / rect.height);

        this.pan(-dx * x_drag_scale, -dy * y_drag_scale);
      }

      this.last_drag = { "x": event.pageX, "y": event.pageY };
      this.last_drag_location = move_location;
    } else {
      this.highlight.x1 = this.highlight.x2 = move_location.x;
      this.highlight.z1 = this.highlight.z2 = move_location.y;
      this.highlight.dir = move_location.dir;
      this.highlight.ok = true;
    }

    if (this.mode == "None") {

    } else if (this.mode == "make-stairs") {

    } else if (this.mode == "make-room") {
      this.highlight.ok = this.ship.structure.check_room(this.highlight);
    } else if (this.mode == "make-door") {
      this.highlight.ok = this.ship.structure.check_door(this.highlight);
    } else if (this.mode == "make-wall") {
      this.highlight.ok = this.ship.structure.check_wall(this.highlight);
    } else if (this.mode == "make-window") {
      this.highlight.ok = this.ship.structure.check_window(this.highlight);
    }

    this.last_move = { "x": event.pageX, "y": event.pageY };
    this.last_move_location = move_location;
  }

  on_mousedown(event) {
    this.start_dragging(event.pageX, event.pageY);
    this.on_mousemove(event);
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

