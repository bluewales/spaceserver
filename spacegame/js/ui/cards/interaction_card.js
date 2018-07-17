class InteractionCard extends Card {
  constructor(title) {
    var width = 300;
    var height = 10;

    super(title, width, height);


    this.margin = this.frame.border_width;
    this.default_width = width;
    this.default_height = 0;

    this.lines = [];
    this.line_count = 0;
    this.height = this.default_height;
    this.width = this.default_width;

    this.line_height = 20;

    this.label = title;

    this.button_width = 120;

    this.addChild(this.line1_1);
  }

  set active(value) {
    for(var i = 0; i < this.lines.length; i++) {
      if(value) {
        if(this.lines[i].show) this.lines[i].show();
      } else {
        if(this.lines[i].hide) this.lines[i].hide();
      }
    }
    super.active = value;
  }

  clear_lines() {
    for(var i = 0; i < this.lines.length; i++) {
      this.removeChild(this.lines[i]);
      if(this.lines[i].hide) this.lines[i].hide();
    }
    this.line_count = 0;
    this.height = this.default_height;
    this.width = this.default_width;

    this.frame.height = this.height;
    this.frame.width = this.width;

  }

  add_text(string) {
    var text;
    if(this.lines.length > this.line_count && this.lines[this.line_count].type == "text") {
      text = this.lines[this.line_count];
    } else {
      text = new createjs.Text(string, (this.line_height) + "px Arial", this.foreground_color);
      text.type = "text";
    }
    text.text = string;
    text.height = this.line_height;
    text.width = text.getBounds().width;
    this.add_line(text);
  }

  add_progress_bar(percent) {
    var bar;
    if (this.lines.length > this.line_count && this.lines[this.line_count].type == "bar") {
      bar = this.lines[this.line_count];
    } else {
      bar = new createjs.Shape();
      bar.type = "bar";
    }
    
    bar.height = this.line_height;
    bar.width = 200;

    bar.graphics.clear()
      .beginFill(this.contrast_color)
      .drawRect(0, 0, percent/100 * bar.width, this.line_height)
      .beginFill(null)
      .beginStroke(this.foreground_color)
      .drawRect(0, 0, bar.width, this.line_height);

    this.add_line(bar);
  }

  add_button(label, callback) {
    var button;
    if (this.lines.length > this.line_count && this.lines[this.line_count].type == "button") {
      button = this.lines[this.line_count];
      button.text.text = label;
      button.on_click = callback;
      button.active = false;
    } else {
      var button_config = {
        "width": this.button_width,
        "height": this.line_height + this.margin * 2,
        "text": label,
        "on_click": callback,
        "mode": "reset"
      };
      button = new Button(button_config);
      button.type = "button";
    }
    this.add_line(button);
  }

  add_input(placeHolder) {
    var input;
    if (this.lines.length > this.line_count && this.lines[this.line_count].type == "input") {
      input = this.lines[this.line_count];
      input.placeHolder = placeHolder;
    } else {
      var input = new TextInput(placeHolder);
      input.update();
      input.type = "input";
    }

    this.add_line(input);
  }

  add_line(line) {
    if (this.lines.length > this.line_count) {
      this.lines[this.line_count] = line;
    } else {
      this.lines.push(line);
    }
    this.line_count += 1;
    this.addChild(line);
    line.y = this.height + this.margin;
    line.x = this.margin;
    this.height += line.height + this.margin;
    if(line.width > this.width) {
      this.width = line.width;
    }
    for(var i = 0; i < this.lines.length; i++) {
      this.lines[i].x = this.width/2 - this.lines[i].width/2;
    }
    if(this.active && line.show) line.show();
  }

  on_close() {
    game.ship.clear_selection();
  }
  tick() {
    for(var i = 0; i < this.lines.length; i++) {
      if(this.lines[i].tick) this.lines[i].tick();
    }
  }
}
