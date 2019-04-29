/**
 * Created by Luke on 7/9/2017.
 */

class Level extends createjs.Container {
  constructor() {
    super();

    this.layers = {};
  }

  add(item, layer_index) {
    if (this.layers[layer_index] === undefined) {
      this.layers[layer_index] = new createjs.Container();
      this.addChild(this.layers[layer_index]);
    }
    this.layers[layer_index].addChild(item);
    this.setChildIndex(this.layers[layer_index], layer_index);
  }
  remove(item, layer_index) {
    if (this.layers[layer_index] === undefined) {
      return;
    }
    this.layers[layer_index].removeChild(item);
  }
}

class ShipGraphics extends createjs.Container {
  constructor() {
    super();

    this.grid_width = 24;
    this.padding = 1.5;

    this.layer_indexes = {
      "floor": 0,
      "wall": 1,
      "furniture": 2,
      "item": 3,
      "crew": 4,
      "shuttle": 5,
    };
    

    this.levels = {};
  }

  position_transform(x) {
    return x * (this.grid_width + this.padding * 2) + this.padding;
  }

  add_thing(pos, thing) {
    let layer_index = this.layer_indexes[thing.layer];
    if (this.levels[pos.z] === undefined) {
      this.levels[pos.z] = new Level();
    }
    this.levels[pos.z].remove(thing, layer_index);
    this.levels[pos.z].add(thing, layer_index);
  }
  remove_thing(pos, thing) {
    let layer_index = this.layer_indexes[thing.layer];
    this.levels[pos.z].remove(thing, layer_index);
  }
  move_thing(pos, thing) {
    let layer_index = this.layer_indexes[thing.layer];
    if (thing.pos.z != pos.z) {
      this.levels[thing.pos.z].remove(thing, layer_index);
      this.add_thing(pos, thing);
    }
  }


  draw_highlight(pos, size=1) {

    var grid = this.grid_width + this.padding * 2;
    var pad = this.padding;

    if (!this.highlight) {
      this.highlight = {};

      function corner(shape, x1, x2, x3, y1, y2, y3) {
        create_polygon('red', [[x1, y1], [x3, y1], [x3, y2], [x2, y2], [x2, y3], [x1, y3]], shape);
      }

      function corners(shape, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6) {
        corner(shape, x1, x2, x3, y1, y2, y3);
        corner(shape, x6, x5, x4, y1, y2, y3);
        corner(shape, x1, x2, x3, y6, y5, y4);
        corner(shape, x6, x5, x4, y6, y5, y4);
      }

      function square_corners(shape, size) {
        corners(shape,
          -((grid) * size) + grid - pad, -((grid) * size) + grid, -((grid) * size) + grid * 1.25, grid * 0.75 - 2 * pad, grid - 2 * pad, grid - 1 * pad, 
          -((grid) * size) + grid - pad, -((grid) * size) + grid, -((grid) * size) + grid * 1.25, grid * 0.75 - 2 * pad, grid - 2 * pad, grid - 1 * pad);
          //-2 * pad - (grid * (size-1)), -pad - (grid * (size-1)), grid / 4 - (grid * (size-1)), grid - grid / 4 - 2 * pad, grid - pad, grid,
          //-2 * pad - (grid * (size-1)), -pad - (grid * (size-1)), grid / 4 - (grid * (size-1)), grid - grid / 4 - 2 * pad, grid - pad, grid);
      }


      this.highlight[1] = new createjs.Shape();
      this.highlight[1].is_highlight = true;

      this.highlight[2] = new createjs.Shape();
      this.highlight[2].is_highlight = true;

      square_corners(this.highlight[1], 1);
      square_corners(this.highlight[2], 2);
      

      this.highlight["|"] = new createjs.Shape();
      this.highlight["|"].is_highlight = true;
      this.highlight["|"].graphics
        .beginFill('red')
        .drawRect(grid - this.padding * 2, -this.padding, this.padding * 2, grid);

      this.highlight["-"] = new createjs.Shape();
      this.highlight["-"].is_highlight = true;
      this.highlight["-"].graphics
        .beginFill('red')
        .drawRect(-this.padding, grid - this.padding * 2, grid, this.padding * 2);
    }

    if (pos.ori) {
      this.highlight_shape = this.highlight[pos.ori];
    } else {
      this.highlight_shape = this.highlight[size];
    }

    this.highlight_shape.y = this.position_transform(pos.y);
    this.highlight_shape.x = this.position_transform(pos.x);

    this.addChild(this.highlight_shape);

    return this.highlight_shape;
  }

  clear_highlight() {
    this.removeChild(this.highlight_shape);
  }

  set_display_level(z_level) {
    this.removeAllChildren();
    this.addChild(this.levels[z_level]);
    return;

    var min_z = d3.min(d3.keys(this.levels), function (d) { return d * 1; });
    for (var z = min_z; z <= z_level; z++) {
      if (this.levels[z] !== undefined) {
        var darken = Math.pow(0.5, z_level - z);
        this.levels[z].alpha = Math.floor(darken);
        this.addChild(this.levels[z]);
      }
    }
  }
}
