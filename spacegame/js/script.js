var seventh_root_of_two = Math.pow(2, 1/7);

Object.defineProperty(Object.prototype, "watch", {
  enumerable: false,
  configurable: true,
  writable: false,
  value: function (property, callback) {
    var descriptor = {};
    if(property in this) {
      descriptor = Object.getOwnPropertyDescriptor(this, property);
    }
    var old_set = descriptor.set;
    var old_get = descriptor.get;
    var old_value = descriptor.value;

    delete descriptor.writable;
    delete descriptor.value;

    var property_alias = "_watched_" + property;

    descriptor.set = function (value) {
      this[property_alias] = value;
      callback(value);
      if (old_set) old_set(value);
    };

    if (old_get) {
      descriptor.get = old_get;
    } else {
      descriptor.get = function () {
        return this[property_alias];
      }
    }

    Object.defineProperty(this, property, descriptor);

    this[property] = old_value;
  }
});

function init() {
  window.game = new Game();
}

function* iterate_3d(place) {
  if(place.d === undefined) place.d = {};
  if(place.iter === undefined) {place.iter = []; place.index = 0;}
  if(place.changed) {
    place.index = 0;
    place.changed = false;
    for(var z in place.d) {
      var thing = place.d[z];
      if(thing !== undefined) {
        if(place.index < place.iter.length)
          place.iter[place.index] = thing;
        else
          place.iter.push(thing);
        place.index++;
      }
    }
  }

  for(var i = 0; i < place.index; i++) {
    yield place.iter[i];
  }
}

function pos_to_index(p) {
  var dim = p.ori ? p.ori : ",";

  return p.x + dim + p.y + dim + p.z;
}

function get_3d(place, p) {
  var index = pos_to_index(p);
  if(place.d === undefined) return undefined;
  return place.d[index];
}

function set_3d(place, p, thing) {
  var index = pos_to_index(p);
  if(place.d === undefined) place.d = {};
  place.d[index] = thing;
  place.changed = true;
}

function shuffle_array(a) {
    var i, j, x;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function copy_pos(pos) {
  return {"x": pos.x, "y":pos.y, "z":pos.z, "ori":pos.ori};
}

function copy_posses(posses) {
  var result = [];
  for(var i = 0; i < posses.length; i++) {
    result.push(copy_pos(posses[i]));
  }
  return result;
}

function pos_equals(a, b) {
  if(!a) return false;
  if(!b) return false;
  return a.x == b.x && a.y == b.y && a.z == b.z && ((a.ori === undefined && b.ori === undefined) || (a.ori == b.ori));
}

function create_polygon(color, points, shape) {
  if(shape === undefined) {
    shape = new createjs.Shape();
  }
  shape.graphics.beginFill(color).moveTo(points[0][0], points[0][1]);

  for(var i = 0; i < points.length; i++) {
    shape.graphics.lineTo(points[i][0], points[i][1]);
  }
  shape.graphics.endFill();

  return shape;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getUID(tag) {
  if(!tag) {
    tag = "";
  }
  var id = tag + "-" + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  return id;
}
