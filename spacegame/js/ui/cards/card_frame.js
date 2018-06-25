class CardFrame extends createjs.Container {
  constructor(parent, width, height) {
    super();

    this.parent = parent;

    this.border_width = 6;
    this.header_width = 40;

    this.box = new createjs.Shape();
    this.ex = new createjs.Shape();

    this.addChild(this.box);

    this.width = width;
    this.height = height;

    this.foreground_color = menu_palette[0];
    this.background_color = menu_palette[1];
    this.contrast_color = menu_palette[4];

    this.title = new createjs.Text(this.parent.name, (this.header_width-this.border_width*2) + "px Arial", menu_palette[0]);
    this.title.x = this.border_width;
    this.title.y = -this.header_width;
    this.addChild(this.title);


    this.addChild(this.ex);

    this.ex.on("click", function(event) {this.parent.active=false; event.stopPropagation();}.bind(this));
    this.ex.on("mousedown", function(event) {this.draw_ex(this.background_color, menu_palette[3]); event.stopPropagation();}.bind(this));
    this.ex.on("pressup", function(event) {this.draw_ex(this.foreground_color, menu_palette[4]); event.stopPropagation();}.bind(this));
    this.ex.on("pressmove", function(event) {event.stopPropagation();}.bind(this));


    this.on("click", this.click.bind(this));
    this.on("mousedown", this.mousedown.bind(this));
    this.on("pressmove", this.drag.bind(this));

    this.pinned = true;
  }
  click(event) {
    game.card_table.focus(this.parent);
  }
  mousedown(event) {
    this.drag_start = [event.stageX, event.stageY];
    game.card_table.focus(this.parent);
  }
  drag(event) {
    this.parent.x += event.stageX - this.drag_start[0];
    this.parent.y += event.stageY - this.drag_start[1];
    this.drag_start = [event.stageX, event.stageY];
  }
  draw_ex() {
    this.ex.graphics.clear();
    this.ex.graphics.beginFill(this.foreground_color).drawRect(
      0,
      0,
      this.ex_width,
      this.ex_width
    ).endFill();

    this.ex.graphics
      .setStrokeStyle(this.border_width)
      .beginStroke(this.contrast_color)
      .moveTo(this.border_width, this.border_width)
      .lineTo(this.ex_width-this.border_width, this.ex_width-this.border_width)
      .moveTo(this.ex_width-this.border_width, this.border_width)
      .lineTo(this.border_width, this.ex_width-this.border_width);
  }

  draw_box() {
    this.box.graphics.clear();
    this.box.graphics.beginFill(this.foreground_color).drawRect(
      -this.border_width,
      -this.border_width*2 - this.header_width,
      this._width+this.border_width*4,
      this._height+this.border_width*4 + this.header_width
    ).endFill();

    this.box.graphics.beginFill(this.background_color).drawRect(
      0,
      -this.header_width - this.border_width,
      this._width+this.border_width*2,
      this._height + this.header_width + this.border_width*2
    ).endFill();

    this.box.graphics.beginFill(this.foreground_color).drawRect(
      this.border_width,
      -this.border_width,
      this._width,
      this.border_width
    ).endFill();

    this.ex_width = this.header_width-this.border_width*2;
    this.ex.x = this._width + this.border_width - this.header_width+this.border_width*2;
    this.ex.y = -this.header_width;

    this.draw_ex();
  }

  set width(value) {
    this._width = value;
    this.draw_box();
  }
  get width() {
    return this._width;
  }

  set height(value) {
    this._height = value;
    this.draw_box();
  }
  get height() {
    return this._height;
  }


  set pinned(value) {
    if(this._pinned === value) return;
    this._pinned = value;
    if(this._pinned) {
      this.removeChild(this.un_pinned);
      //this.addChild(this.is_pinned);
    } else {
      this.removeChild(this.is_pinned);
      //this.addChild(this.un_pinned);
    }
  }
  get pinned() {
    return this._pinned;
  }

}
