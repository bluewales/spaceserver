class Construct extends Job {
  constructor(structure, materials) {
    super();
    this.label = "Constructing";
    this.percent = 0;
    if(structure) {
      this.structure = structure;
      if(this.structure.job) console.log("JOB ERROR, structure already has a job.");
      this.structure.job = this;
      this.pos = this.structure.pos;
      this.materials = materials;
      for(var i = 0; i < materials.length; i++) {
        materials[i].claimed = this;
      }
    }
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.structure = objects[raw.structure];
    this.percent = this.structure.progress;
    if(this.structure.job) console.log("JOB ERROR, structure already has a job.");
    this.structure.job = this;
    this.pos = this.structure.pos;

    this.materials = [];
    if(raw.materials === undefined) raw.materials = [];
    for(var i = 0; i < raw.materials.length; i++) {
      this.materials.push(objects[raw.materials[i]]);
    }
  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  work(crew) {
    var p = crew.pos;

    // get materials
    for(var i = 0; i < this.materials.length; i++) {
      var item = this.materials[i];
      if(item.container !== this) {
        if(!this.take_item_to(crew, item, this.pos)) return false;
        item.container = this;
        item.pos = this.pos;
      }
    }

    // build it
    if(walled_distance(p, this.pos) > 0) {
      crew.move_towards(this.pos);
    } else {
      this.structure.progress = this.structure.progress+1;
      this.percent = this.structure.progress;
      if(this.structure.progress >= 100) {
        this.structure.progress = 100;
        return true;
      }
    }
    return false;
  }

  on_complete() {
    console.log(this);
    this.structure.ship.graph.update_pos(this.structure.pos);
    this.structure.job = undefined;
  }

  cancel() {
    super.cancel();

    this.structure.progress = 0;
/*
    // Spawn materials now
    var materials = this.structure.constructor.materials;
    for (var i = 0; i < this.materials.length; i++) {
      var item = this.materials[i];
      item.claimed = false;
      if (item.container === this) {
        item.pos = this.structure.pos;
        this.structure.ship.add_item(materials[i]);
      }
    }
*/
    // Remove Structure from ship
    this.structure.ship.remove_structure(this.structure);
  }

  get_raw(callback) {
    this.raw = {};
    this.raw.structure = this.structure.id;
    this.raw.type = "Construct";
    this.raw.materials = [];
    for(var i = 0; i < this.materials.length; i++) {
      this.raw.materials.push(this.materials[i].id);
      if(this.materials[i].container == this){
        this.materials[i].get_raw(callback);
      }
    }
    callback(this, this.raw);
  }
}
