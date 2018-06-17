class WallPanel extends Wall {

  constructor() {
    super();
  }

  init(raw, objects) {
    super.init(raw, objects);


    var g = this.ship.grid_width;
    var p = this.ship.padding;

    this.drawing = new createjs.Container();
    if(this.pos.ori == "-") {
      this.drawing.addChild(create_polygon(ship_palette[1], [[0,g],[g,g],[g+p,g+p],[g,g+p*2],[0,g+p*2],[-p,g+p]]));
    } else if(this.pos.ori == "|") {
      this.drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,0],[g+p*2,g],[g+p,g+p],[g,g],[g,0],[g+p,-p]]));
    }

    this.addChild(this.drawing);

    this.name = "Wall Panel";
  }
  start(raw, objects) {
    super.start(raw, objects);
  }
  get passable() {
    return this.progress < 100;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 2 : 0);
  }

  static generate_raw(pos) {
    return {
      "type": "WallPanel",
      "pos": pos,
      "progress": 0
    };
  }
  static get materials() {
    return ["Steel"];
  }
}
