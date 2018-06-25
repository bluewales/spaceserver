
class Deconstruct extends Job {
  constructor(structure) {
    super();
    this.label = "Deconstuct";
    this.percent = 0;
    if(structure) {
      this.structure = structure;
      if(this.structure.job) console.log("JOB ERROR, structure already has a job.");
      this.structure.job = this;
      this.pos = this.structure.pos;
    }
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.structure = objects[raw.structure];
    this.percent = 100 - this.structure.progress;
    if(this.structure.job) console.log("JOB ERROR, structure already has a job.");
    this.structure.job = this;
    this.pos = this.structure.pos;
  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  work(crew) {
    var p = crew.pos;


    // tear it down
    if(walled_distance(p, this.pos) > 0) {
      crew.move_towards(this.pos);
    } else {
      this.structure.progress = this.structure.progress-1;
      this.percent = 100 - this.structure.progress;
      if(this.structure.progress <= 0) {
        this.structure.progress = 0;

        // Remove Structure from ship
        this.structure.ship.remove_structure(this.structure);

        // Spawn materials now
        console.log("Need to spawn materials");
        var materials = this.structure.constructor.materials;
        for(var i = 0; i < materials.length; i++) {
          this.structure.ship.spawn_item(materials[i], this.structure.pos);
        }


        return true;
      }
    }
    return false;
  }

  on_complete() {
    this.structure.ship.graph.update_pos(this.structure.pos);
    this.structure.job = undefined;
  }

  get_raw(callback) {
    this.raw = {};
    this.raw.structure = this.structure.id;
    this.raw.type = "Deconstruct";
    callback(this, this.raw);
  }
}
