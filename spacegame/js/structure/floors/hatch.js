class Hatch extends Floor {

  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);

    this.type = raw.type;
    this.sprite_key = "h";
    this.pos = raw.pos;

    var grid = this.ship.graphics.grid_width+this.ship.graphics.padding*2;
    this.skirt = new createjs.Shape();
    this.skirt.graphics.beginFill(ship_palette[0])
      .drawRect(-this.ship.graphics.padding, -this.ship.graphics.padding, grid, grid);
    this.addChild(this.skirt);

    this.open = 0;

    this.drawing = new createjs.Container();
    this.addChild(this.drawing);
    this.label = "Hatch";
  }
  start(raw, objects) {
    super.start(raw, objects);
  }
  get passable() {
    return true;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 1 : 0);
  }
  tick(event) {
    var other_pos = {"x":this.pos.x,"y":this.pos.y, "z":this.pos.z-1};

    if(get_3d(game.ship.crew, this.pos) || get_3d(game.ship.crew, other_pos)) {
      this.open += 1/32;
      if(this.open > 1) this.open = 1;
    } else {
      this.open -= 1/32;
      if(this.open < 0) this.open = 0;
    }
    if(this.progress < 100) this.open = 0;

    this.removeChild(this.drawing);
    this.drawing = this.get_hatch_art(this.open);
    this.addChild(this.drawing);
  }

  static generate_raw(pos) {
    return {
      "type": "Hatch",
      "pos": pos,
      "progress": 0
    };
  }

  static get materials() {
    return ["Steel","Steel"];
  }

  get_hatch_art(open) {
    if(!this.hatch_art) this.hatch_art = {};
    if(!this.hatch_art[open]) {

      var g = game.ship.graphics.grid_width;
      var p = game.ship.graphics.padding;
      var o = open;

      var drawing = new createjs.Container();

      var shape = new createjs.Shape();
      shape.graphics.beginFill(ship_palette[1]).drawCircle(g/2, g/2, g/2, g/2);
      drawing.addChild(shape);

      var petals = 13;
      var R = g/2 - p;
      var r = (R-p*2) * (open);
      var c = g/2;

      var centers = [];

      for(var i = 0; i < petals; i++) {
        var theta = 2*Math.PI * (i) / petals;
        var theta2 = 2*Math.PI * (i+1) / petals;
        var phi1 = theta - Math.acos(r/R);
        var phi2 = theta2 - Math.acos(r/R);
        var phi = (phi1+phi2)/2;
        var cr = r/Math.cos(Math.abs(phi2-phi1)/2);

        var p1 = [c+R*Math.sin(theta),c+R*Math.cos(theta)];
        var p2 = [c+R*Math.sin(theta2),c+R*Math.cos(theta2)];
        var p3 = [c+cr*Math.sin(phi),c+cr*Math.cos(phi)];
        drawing.addChild(create_polygon(ship_palette[2], [p1,p2,p3]));

        centers.push(p3);
      }
      drawing.addChild(create_polygon("black", centers));

      this.hatch_art[open] = drawing;
    }

    return this.hatch_art[open];
  }


}
