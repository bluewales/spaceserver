/**
 * Created by Luke on 7/9/2017.
 */

class Ship extends createjs.Container {
  constructor() {
    super();

    this.floors = {};
    this.walls = {};
    this.furniture = {};
    this.items = {};
    this.crew = {};
    this.shuttles = {};

    this.money = 100000;

    this.places = [
      this.floors,
      this.walls,
      this.furniture,
      this.crew,
      this.shuttles
    ];

    this.graph = new Graph(this);
    this.rooms = new Rooms(this);

    this.jobs = new Jobs();

    this.item_store = new ItemStore();

    this.graphics = new ShipGraphics();
    this.addChild(this.graphics);
  }

  init(raw, objects) {
    this.type = raw.type;

    if(raw.money !== undefined) {
      this.money = raw.money;
    } else {
      this.money = 100000;
    }
  }

  start(raw, objects) {
    var floors = raw.floor;
    if (!floors) floors = [];
    for (var i = 0; i < floors.length; i++) {
      this.add_structure(objects[floors[i]]);
    }

    var walls = raw.wall;
    if (!walls) walls = [];
    for (var i = 0; i < walls.length; i++) {
      this.add_structure(objects[walls[i]]);
    }

    var furniture = raw.furniture;
    if (!furniture) furniture = [];
    for (var i = 0; i < furniture.length; i++) {
      this.add_structure(objects[furniture[i]]);
    }

    var crew = raw.crew;
    if (!crew) crew = [];
    for (var i = 0; i < crew.length; i++) {
      this.add_crew_member(objects[crew[i]]);
    }

    var items = raw.item;
    if (!items) items = [];
    for (var i = 0; i < items.length; i++) {
      this.add_item(objects[items[i]]);
    }

    var jobs = raw.jobs;
    if (!jobs) jobs = [];
    for (var i = 0; i < jobs.length; i++) {
      this.jobs.register_job(objects[jobs[i]]);
    }
  }

  get_raw(callback) {
    this.raw = {};
    this.raw.type = this.type;

    this.raw.money = this.money;

    for (var i = 0; i < this.places.length; i++) {
      for (var thing of iterate_3d(this.places[i])) {
        var layer = thing.layer;
        if (this.raw[layer] === undefined) this.raw[layer] = [];
        this.raw[layer].push(thing.id);
        thing.get_raw(callback);
      }
    }

    this.raw.jobs = [];
    for (var i = 0; i < this.jobs.queue.length; i++) {
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
    for (var i = 0; i < this.places.length; i++) {
      for (var thing of iterate_3d(this.places[i])) {
        if (thing.tick) thing.tick(event);
      }
    }
    for (var key in this.items) {
      this.items[key].tick(event);
    }
  }

  add_thing(pos, place, thing) {
    if (place !== undefined) set_3d(place, pos, thing);
    this.graphics.add_thing(pos, thing);
  }
  remove_thing(pos, place, thing) {
    if (place !== undefined) set_3d(place, pos, undefined);
    this.graphics.remove_thing(pos, thing);
  }

  get_floor(pos) {
    return get_3d(this.floors, pos);
  }
  get_wall(pos) {
    return get_3d(this.walls, pos);
  }
  get_furniture(pos) {
    return get_3d(this.furniture, pos);
  }

  get_place_from_string(str) {
    switch (str) {
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
    var place = this.get_place_from_string(structure.layer);
    this.add_thing(structure.pos, place, structure);
    this.graph.update_pos(structure.pos);
    return structure;
  }
  remove_structure(structure) {
    var place = this.get_place_from_string(structure.layer);
    this.remove_thing(structure.pos, place, structure);
    this.graph.update_pos(structure.pos);
    if (this.current_selection === structure) {
      this.clear_selection();
    }
  }

  add_crew_member(crew_member) {
    this.add_thing(crew_member.pos, this.crew, crew_member, this.crew_layer);
  }
  change_position_crew(crew_member, p) {
    if (get_3d(this.crew, crew_member.pos) !== crew_member) {
      console.log("ERROR!");
    }
    set_3d(this.crew, crew_member.pos, undefined);
    set_3d(this.crew, p, crew_member);
    this.graphics.move_thing(p, crew_member);
  }

  add_item(item) {
    this.add_thing(item.pos, undefined, item, this.item_layer);
    this.items[item.uid] = item;

    item.container = this;
    return item;
  }

  remove_item(item) {
    this.graphics.remove_thing(item.pos, item);
    this.items[item.uid] = undefined;
    delete this.items[item.uid];
    if (this.current_selection === item) {
      this.clear_selection();
    }
  }

  spawn_item(type, pos) {
    if (pos.ori) {
      var new_pos = { x: pos.x, y: pos.y, z: pos.z };
      if (Math.random() < 0.5) {
        if (pos.ori == "|") {
          new_pos.x += 1;
        } else {
          new_pos.y += 1;
        }
      }
      pos = new_pos;
    }

    var item = new type_lookup[type](pos, this);
    this.add_item(item);

    this.item_store.signal_changed();
  }

  select(selected) {
    if (selected === undefined) {
      return;
    }

    if (selected === this.current_selection) {
      this.clear_selection();
      return;
    }
    this.clear_selection();

    this.current_selection = selected;

    this.interaction_card = selected.interaction_card;

    var x_offset = this.interaction_card.frame.border_width + 25;
    this.interaction_card.x = this.getStage().mouseX + x_offset;
    this.interaction_card.y = this.getStage().mouseY;

    this.interaction_card.active = true;
    this.graphics.draw_highlight(selected.pos);

    this.current_selection.set_highlight(this.highlight_shape);
  }

  clear_selection() {
    if (!this.interaction_card) {
      return;
    }

    this.graphics.clear_highlight();
    this.current_selection.set_highlight(undefined);
    this.current_selection = null;

    var card = this.interaction_card;
    this.interaction_card = null;
    card.active = false;
  }

  set_display_level(z_level) {
    this.graphics.set_display_level(z_level);
  }
}
