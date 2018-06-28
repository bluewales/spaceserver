class Door extends Wall {

  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);

    this.open = 0;
    this.label = "Door";
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
    var pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z};
    var other_pos = {x:this.pos.x+(this.pos.ori=="|"?1:0),y:this.pos.y+(this.pos.ori=="-"?1:0), z:this.pos.z};
    if(get_3d(window.game.ship.crew, pos) || get_3d(window.game.ship.crew, other_pos)) {
      this.open += 1/25;
      if(this.open > 1) this.open = 1;
    } else {
      this.open -= 1/25;
      if(this.open < 0) this.open = 0;
    }
    if(this.progress < 100) this.open = 0;

    this.removeChild(this.drawing);

    this.drawing = this.get_door_art(this.pos.ori, this.open);
    this.addChild(this.drawing);
  }

  static generate_raw(pos) {
    return {
      "type": "Door",
      "pos": pos,
      "progress": 0
    };
  }

  static get materials() {
    return ["Steel", "Steel"];
  }

  get_door_art(ori, open) {
    if(!this.door_art) this.door_art = {};
    if(!this.door_art[open]) {

      this.door_art[open] = {};

      var g = window.game.ship.grid_width;
      var p = window.game.ship.padding;
      var o = open;

      var v_drawing = new createjs.Container();
      v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,0],[g+p,p],[g,0],[g+p,-p]]));
      v_drawing.addChild(create_polygon(ship_palette[2], [[g+p*2,0],[g+p*2,(1-o)*(g/2-p)],[g+p,(1-o)*(g/2-p)+p],[g,(1-o)*(g/2-p)],[g,0],[g+p,p]]));
      v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,(1-o)*(g/2-p)],[g+p*2,(1-o)*(g/2-p)+p],[g,(1-o)*(g/2-p)+p],[g,(1-o)*(g/2-p)],[g+p,(1-o)*(g/2-p)+p]]));
      v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,(1+o)*(g/2-p)+p],[g+p*2,(1+o)*(g/2-p)+2*p],[g+p,(1+o)*(g/2-p)+p],[g,(1+o)*(g/2-p)+2*p],[g,(1+o)*(g/2-p)+p]]));
      v_drawing.addChild(create_polygon(ship_palette[2], [[g+p*2,(1+o)*(g/2-p)+2*p],[g+p*2,g],[g+p,g-p],[g,g],[g,(1+o)*(g/2-p)+2*p],[g+p,(1+o)*(g/2-p)+p]]));
      v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,g],[g+p,g-p],[g,g],[g+p,g+p]]));
      this.door_art[open]['|'] = v_drawing;

      var h_drawing = new createjs.Container();
      h_drawing.addChild(create_polygon(ship_palette[1], [[0,g+p*2],[p,g+p],[0,g],[-p,g+p]]));
      h_drawing.addChild(create_polygon(ship_palette[2], [[0,g+p*2],[(1-o)*(g/2-p),g+p*2],[(1-o)*(g/2-p)+p,g+p],[(1-o)*(g/2-p),g],[0,g],[p,g+p]]));
      h_drawing.addChild(create_polygon(ship_palette[1], [[(1-o)*(g/2-p),g+p*2],[(1-o)*(g/2-p)+p,g+p*2],[(1-o)*(g/2-p)+p,g],[(1-o)*(g/2-p),g],[(1-o)*(g/2-p)+p,g+p]]));
      h_drawing.addChild(create_polygon(ship_palette[1], [[(1+o)*(g/2-p)+p,g+p*2],[(1+o)*(g/2-p)+2*p,g+p*2],[(1+o)*(g/2-p)+p,g+p],[(1+o)*(g/2-p)+2*p,g],[(1+o)*(g/2-p)+p,g]]));
      h_drawing.addChild(create_polygon(ship_palette[2], [[(1+o)*(g/2-p)+2*p,g+p*2],[g,g+p*2],[g-p,g+p],[g,g],[(1+o)*(g/2-p)+2*p,g],[(1+o)*(g/2-p)+p,g+p]]));
      h_drawing.addChild(create_polygon(ship_palette[1], [[g,g+p*2],[g-p,g+p],[g,g],[g+p,g+p]]));
      this.door_art[open]['-'] = h_drawing;
    }

    return this.door_art[open][ori];
  }
}
