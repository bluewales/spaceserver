/**
 * Created by Luke on 7/18/2017.
 */

function p_to_s(p) {
  return pos_to_index(p);
}

class Crew extends createjs.Container {
  constructor() {
    super();
  }
  init(raw, objects) {
    this.type = raw.type;
    this.sprite = "builder_crew";

    this.uid = getUID(this.type);

    this.addChild(new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite));

    this.ship = objects[raw.ship];
    this.pos = raw.pos;
    this.sprite = raw.sprite;

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);



    this.cooldown = (raw.cooldown !== undefined) ? raw.cooldown : 0;
    this.path_progress = (raw.path_progress !== undefined) ? raw.path_progress : 0;
    this.path = raw.path;
    this.current_job = (raw.current_job !== undefined) ? objects[raw.current_job] : undefined;

    this.carried_item = (raw.carried_item !== undefined) ? objects[raw.carried_item] : undefined;
    if (this.carried_item) {
      this.carried_item.x = this.carried_item.y = 0;
      this.addChild(this.carried_item);
    }

    this.speed = 1;

    console.log(raw.name);
    this.label = raw.name;
  }
  start(raw, objects) {
  }
  move_towards(p) {
    //console.log(p_to_s(this.pos) + " move toward " + p_to_s(p));
    this.path = get_path(this.pos, { x: p.x, y: p.y, z: p.z });
    if (p.ori) {
      var other_p = { x: p.x + (p.ori == "|" ? 1 : 0), y: p.y + (p.ori == "-" ? 1 : 0), z: p.z };
      var other_path = get_path(this.pos, other_p);
      if (this.path.length > other_path.length) {
        this.path = other_path;
      }
    }
    if (this.path.length == 0) {
      this.clear_path();
      console.log("Path failed, we probably need to cancel this job. " + p_to_s(p));
    }
  }
  grab(item) {

    if (walled_distance(this.pos, item.pos) !== 0) {
      console.log("ERROR cannot grab item.  It's too far away.");
      return;
    }
    if (this.carried_item !== undefined) {
      console.log("ERROR cannot grab item.  I've already got one.  (I told them I've already got one).");
      return;
    }
    this.carried_item = item;
    item.container = this;
    item.x = item.y = 0;
    delete item.pos;
    this.addChild(item);
  }
  remove_item(item) {
    if (item !== this.carried_item) {
      console.log("ERROR cannot remove item.  I don't have it.");
      return;
    }
    this.carried_item = undefined;
    this.removeChild(item);
  }
  tick(event) {
    //return;
    if (this.cooldown > 0) {
      this.cooldown -= 1;
    } else if (this.path) {
      var c = this.pos;
      var t = this.path[this.path_progress];
      var distance = walled_distance(c, t);
      var path_weight = passable(c, t);
      if (distance == 0) {
        this.path_progress += 1;
        if (this.path_progress == this.path.length) {
          this.clear_path();
        }
      } else if (distance == 1 && path_weight > 0) {
        this.ship.change_position_crew(this, t);
        this.pos = t;
        this.cooldown = 24 * path_weight;
        this.speed = 1 / path_weight;

        this.update_interaction_card();
      } else {
        console.log("Cancel path " + distance + " " + passable(c, t));
        this.clear_path();
      }
    } else if (this.current_job) {
      if (this.current_job.work(this)) {
        this.current_job.complete();
        this.current_job = false;

        this.update_interaction_card();
      }
    } else {
      this.current_job = this.ship.jobs.get_job(this);

      this.update_interaction_card();
    }

    var dx = this.ship.position_transform(this.pos.x) - this.x;
    var dy = this.ship.position_transform(this.pos.y) - this.y;
    if (Math.abs(dx) > this.speed) {
      this.x += this.speed * dx / Math.abs(dx);
    } else {
      this.x = this.ship.position_transform(this.pos.x);

    }
    if (Math.abs(dy) > this.speed) {
      this.y += this.speed * dy / Math.abs(dy);
    } else {
      this.y = this.ship.position_transform(this.pos.y);
    }
    if (this.highlight) {
      this.highlight.x = this.x;
      this.highlight.y = this.y;
    }
  }
  clear_path() {
    this.path = undefined;
    this.path_progress = 0;
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.pos = copy_pos(this.pos);
    this.raw.name = this.label;
    this.raw.ship = this.ship.id;
    this.raw.type = this.type;
    if (this.path) this.raw.path = copy_posses(this.path);
    if (this.current_job) this.raw.current_job = this.current_job.id;

    if (this.carried_item) {
      this.raw.carried_item = this.carried_item.id;
      this.carried_item.get_raw(callback);
    }

    this.raw.path_progress = this.path_progress;
    this.raw.cooldown = this.cooldown;
    callback(this, this.raw);
  }
  get layer() {
    return "crew";
  }

  update_interaction_card() {
    if (!this._interaction_card) {
      return;
    }

    this._interaction_card.clear_lines();

    if (this.current_job) {
      this._interaction_card.add_text(this.current_job.label);
      this._interaction_card.add_button("Cancel", this.current_job.cancel);
    } else {
      this._interaction_card.add_text("Idle");
    }
    if (this.carried_item) {
      this._interaction_card.add_text("Carrying " + this.carried_item.label);
    }
    this._interaction_card.add_text("Position: " + pos_to_index(this.pos));
  }

  get interaction_card() {
    if (!this._interaction_card) {
      this._interaction_card = new InteractionCard(this.label);
      this.update_interaction_card();
    }
    return this._interaction_card;
  }

  set_highlight(highlight) {
    this.highlight = highlight;
  }
}
