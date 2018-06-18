/**
 * Created by Luke on 7/9/2017.
 */

class Level extends createjs.Container {
  constructor() {
    super();

    this.layers = {};
  }

  add(item, layer) {
    if(this.layers[layer] === undefined) {
      this.layers[layer] = new createjs.Container();
      this.addChild(this.layers[layer]);
    }
    this.layers[layer].addChild(item);
    this.setChildIndex(this.layers[layer], layer);
  }
  remove(item, layer) {
    if(this.layers[layer] === undefined) {
      return;
    }
    this.layers[layer].removeChild(item);
  }
}

class Ship extends createjs.Container {
  constructor() {
    super();

    this.grid_width = 24;
    this.padding = 1;

    this.floor_layer = 0;
    this.wall_layer = 1;
    this.furniture_layer = 2;
    this.item_layer = 3;
    this.crew_layer = 4;

    this.floors = {};
    this.walls = {};
    this.furniture = {};
    this.items = {};
    this.crew = {};

    this.places = [
      this.floors,
      this.walls,
      this.furniture,
      this.crew
    ];

    this.levels = {};
    this.graph = new Graph(this);
    this.rooms = new Rooms(this);

    this.jobs = new Jobs();

    this.item_store = new ItemStore();
  }

  init(raw, objects) {
    this.type = raw.type;
  }

  start(raw, objects) {
    var floors = raw.floor;
    if(!floors) floors = [];
    for(var i = 0; i < floors.length; i++) {
      this.add_structure(objects[floors[i]]);
    }

    var walls = raw.wall;
    if(!walls) walls = [];
    for(var i = 0; i < walls.length; i++) {
      this.add_structure(objects[walls[i]]);
    }

    var furniture = raw.furniture;
    if(!furniture) furniture = [];
    for(var i = 0; i < furniture.length; i++) {
      this.add_structure(objects[furniture[i]]);
    }

    var crew = raw.crew;
    if(!crew) crew = [];
    for(var i = 0; i < crew.length; i++) {
      this.add_crew_member(objects[crew[i]]);
    }

    var items = raw.item;
    if(!items) items = [];
    for(var i = 0; i < items.length; i++) {
      this.add_item(objects[items[i]]);
    }

    var jobs = raw.jobs;
    if(!jobs) jobs = [];
    for(var i = 0; i < jobs.length; i++) {
      this.jobs.create_job(objects[jobs[i]]);
    }
  }

  get_raw(callback) {
    this.raw = {};
    this.raw.type = this.type;

    for(var i = 0; i < this.places.length; i++) {
      for (var thing of iterate_3d(this.places[i])) {
        var layer = thing.layer;
        if(this.raw[layer] === undefined) this.raw[layer] = [];
        this.raw[layer].push(thing.id);
        thing.get_raw(callback);
      }
    }

    this.raw.jobs = [];
    for(var i = 0; i < this.jobs.queue.length; i++) {
      this.raw.jobs.push(this.jobs.queue[i].id);
      this.jobs.queue[i].get_raw(callback);
    }

    this.raw.item = [];
    for (var key in this.items) {
      this.raw.item.push(this.items[key].id);
      this.items[key].get_raw(callback);
    }

    callback(this, this.raw);
  }

  tick(event) {
    for(var i = 0; i < this.places.length; i++) {
      for (var thing of iterate_3d(this.places[i])) {
        if(thing.tick) thing.tick(event);
      }
    }
  }

  position_transform(x) {
    return x*(this.grid_width+this.padding*2)+this.padding;
  }


  add_thing(pos, place, thing, layer) {
    if(this.levels[pos.z] === undefined) {
      this.levels[pos.z] = new Level();
      this.set_display_level(game.z_level);
    }
    this.levels[pos.z].remove(thing, layer);
    if(place !== undefined) set_3d(place, pos, thing);
    this.levels[pos.z].add(thing, layer);
  }
  remove_thing(pos, place, thing, layer) {
    this.levels[pos.z].remove(thing, layer);
    if(place !== undefined) set_3d(place, pos, undefined);
  }
  get_layer_from_string(str) {
    switch(str) {
      case "floor":
        return this.floor_layer;
      case "wall":
        return this.wall_layer;
      case "furniture":
        return this.furniture_layer;
      case "item":
        return this.item_layer;
      default:
        console.log("ERROR cannot find layer '" + str + "'");
        return undefined;
    }
  }
  get_place_from_string(str) {
    switch(str) {
      case "floor":
        return this.floors;
      case "wall":
        return this.walls;
      case "furniture":
        return this.furniture;
      case "item":
        return this.items;
      default:
        console.log("ERROR cannot find place '" + str + "'");
        return undefined;
    }
  }
  add_structure(structure) {
    var layer = this.get_layer_from_string(structure.layer);
    var place = this.get_place_from_string(structure.layer);
    this.add_thing(structure.pos, place, structure, layer);
    this.graph.update_pos(structure.pos);
    return structure;
  }
  get_floor(pos) {
    return get_3d(this.floors, pos);
  }
  remove_floor(pos) {
    var floor = get_3d(this.floors, pos);
    this.levels[pos.z].remove(floor, this.floor_layer);
    set_3d(this.floors, pos, undefined);
    this.graph.update_pos(pos);
  }
  get_wall(pos) {
    return get_3d(this.walls, pos);
  }
  get_furniture(pos) {
    return get_3d(this.furniture, pos);
  }
  remove_wall(pos) {
    var floor = get_3d(this.walls, pos);
    this.levels[pos.z].remove(wall, this.wall_layer);
    set_3d(this.walls, pos, undefined);
    this.graph.update_pos(pos);
  }
  remove_furniture(pos) {
    var furniture = get_3d(this.furniture, pos);
    this.levels[pos.z].remove(furniture, this.furniture_layer);
    set_3d(this.furniture, pos, undefined);
    this.graph.update_pos(pos);
  }


  add_crew_member(crew_member) {
    this.add_thing(crew_member.pos, this.crew, crew_member, this.crew_layer);
  }
  change_position_crew(crew_member, p) {
    if(get_3d(this.crew, crew_member.pos) !== crew_member) {
      console.log("ERROR!");
    }
    set_3d(this.crew, crew_member.pos, undefined);
    set_3d(this.crew, p, crew_member);
    if(crew_member.pos.z != p.z) {
      this.levels[crew_member.pos.z].remove(crew_member, this.crew_layer);
      this.add_thing(p, this.crew, crew_member, this.crew_layer);
    }
  }

  add_item(item) {
    this.add_thing(item.pos, undefined, item, this.item_layer);
    this.items[item.uid] = item;

    item.container = this;
    return item;
  }

  remove_item(item) {
    this.levels[item.pos.z].remove(item, this.item_layer);
    this.items[item.uid] = undefined;
    delete this.items[item.uid];
  }

  select(selected) {
    if(selected === undefined) {
      return;
    }

    if(selected === this.current_selection) {
      this.clear_selection();
      return;
    }
    this.clear_selection();

    this.current_selection = selected;

    this.interaction_card = selected.interaction_card;

    var x_offset = this.interaction_card.frame.border_width + 1;
    this.interaction_card.x = this.getStage().mouseX + x_offset;
    this.interaction_card.y = this.getStage().mouseY;

    this.interaction_card.active = true;
    this.draw_highlight(selected.pos);
  }

  clear_selection() {
    if(!this.interaction_card) {
      return;
    }
    this.clear_highlight();

    this.interaction_card.active = false;
    this.interaction_card = null;
    this.current_selection = null;
  }



  draw_highlight(pos) {

    var grid = this.grid_width + this.padding*2;

    if(!this.highlight) {
      this.highlight = {};

      this.highlight["square"] = new createjs.Shape();
      this.highlight["square"].is_highlight = true;
      this.highlight["square"].graphics
        .beginStroke('orange')
        .drawRect(-this.padding, -this.padding, grid, grid);

      this.highlight["|"] = new createjs.Shape();
      this.highlight["|"].is_highlight = true;
      this.highlight["|"].graphics
        .beginFill('red')
        .drawRect(grid - this.padding*2, -this.padding, this.padding*2, grid);

      this.highlight["-"] = new createjs.Shape();
      this.highlight["-"].is_highlight = true;
      this.highlight["-"].graphics
        .beginFill('red')
        .drawRect(-this.padding, grid - this.padding*2, grid, this.padding*2);
    }

    if(pos.ori) {
      this.highlight_shape = this.highlight[pos.ori];
    } else {
      this.highlight_shape = this.highlight["square"];
    }

    this.highlight_shape.y = this.position_transform(pos.y);
    this.highlight_shape.x = this.position_transform(pos.x);

    this.addChild(this.highlight_shape);
  }

  clear_highlight() {
    this.removeChild(this.highlight_shape);
  }

  set_display_level(z_level) {
    this.removeAllChildren();
    this.addChild(this.levels[z_level]);
    return;

    var min_z = d3.min(d3.keys(this.levels), function(d) {return d*1;});
    for(var z = min_z; z <= z_level; z++) {
      if(this.levels[z] !== undefined) {
        var darken = Math.pow(0.5, z_level-z);
        this.levels[z].alpha = Math.floor(darken);
        this.addChild(this.levels[z]);
      }
    }
  }
}