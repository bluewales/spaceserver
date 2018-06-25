class InteractionCard extends Card {
  constructor(title) {
    var width = 300;
    var height = 10;

    super(title, width, height);


    this.margin = this.frame.border_width;
    this.default_width = width;
    this.default_height = 0;

    this.lines = [];
    this.height = this.default_height;
    this.width = this.default_width;

    this.line_height = 20;

    this.name = title;

    this.addChild(this.line1_1);
  }

  clear_lines() {
    for(var i = 0; i < this.lines.length; i++) {
      this.removeChild(this.lines[i]);
    }
    this.lines = [];
    this.height = this.default_height;
    this.width = this.default_width;

    this.frame.height = this.height;
    this.frame.width = this.width;

  }

  add_text(string) {
    var text = new createjs.Text(string, (this.line_height) + "px Arial", this.foreground_color);
    text.height = this.line_height;
    text.width = text.getBounds().width;
    this.add_line(text);
  }

  add_progress_bar(percent) {
    var bar = new createjs.Shape();
    bar.height = this.line_height;
    bar.width = 200;

    bar.graphics
      .beginFill(this.contrast_color)
      .drawRect(0, 0, percent/100 * bar.width, this.line_height)
      .beginFill(null)
      .beginStroke(this.foreground_color)
      .drawRect(0, 0, bar.width, this.line_height);

    this.add_line(bar);
  }

  add_button(label, callback) {
    var button_width = 120;
    var button_config = {
      "width": button_width,
      "height": this.line_height+this.margin*2,
      "text": label,
      "on_click": callback
    };
    var button = new Button(button_config);
    button.x = button_width/2;
    //var box = new createjs.Container();
    //box.addChild(button);
    this.add_line(button);
  }

  add_line(line) {
    this.lines.push(line);
    this.addChild(line);
    line.y = this.height + this.margin;
    line.x = this.margin;
    this.height += line.height + this.margin;
    if(line.width > this.width) {
      this.width = line.width;
    }
  }

  on_close() {
    game.ship.clear_selection();
  }
  tick() {


  }
}
