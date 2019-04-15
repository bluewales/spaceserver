class InteractionCard extends Card {
  constructor(label, width=300) {
    var height = 10;

    super(label, width, height);


    this.margin = this.frame.border_width;
    this.default_width = width;
    this.default_height = this.margin;

    this.lines = [];
    this.line_count = 0;
    this.height = this.default_height;
    this.width = this.default_width;

    this.line_height = 20;
    this.button_width = 120;

    this.by_id = {};
  }

  set active(value) {
    for(let i in this.lines) {
      if(value) {
        if(this.lines[i].show) this.lines[i].show();
      } else {
        if(this.lines[i].hide) this.lines[i].hide();
      }
    }
    super.active = value;
  }

  clear_lines() {
    for(let i in this.lines) {
      this.removeChild(this.lines[i]);
      if(this.lines[i].hide) this.lines[i].hide();
    }
    this.line_count = 0;
    this.height = this.default_height;
    this.width = this.default_width;

    this.by_id = {};
  }

  add_text(string, bold=false, color=undefined) {

    if(string.length == 0) string = " ";

    var font_string = (this.line_height) + "px Arial";
    if(bold) {
      font_string = "bold " + font_string;
    }
    if(color === undefined) {
      color = this.foreground_color;
    }

    var text;
    if(this.lines.length > this.line_count && this.lines[this.line_count].type == "text") {
      text = this.lines[this.line_count];
      text.color = color;
    } else {
      text = new createjs.Text(string, font_string, color);
      text.type = "text";
    }
    text.text = string;
    text.height = this.line_height;
    text.width = text.getBounds().width;
    return this.add_line(text);
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

    return this.add_line(bar);
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
    if(callback) {
      button.enable();
    } else {
      button.disable();
    }
    return this.add_line(button);
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

    return this.add_line(input);
  }

  add_password(placeHolder) {
    var password;
    if (this.lines.length > this.line_count && this.lines[this.line_count].type == "password") {
      password = this.lines[this.line_count];
      password.placeHolder = placeHolder;
    } else {
      password = new TextInput(placeHolder, "password");
      password.update();
      password.type = "password";
    }

    return this.add_line(password);
  }

  add_picture(sprite_key) {
    var picture;
    if (this.lines.length > this.line_count
        && this.lines[this.line_count].type == "picture"
        && this.lines[this.line_count].sprite_key == sprite_key) {
      picture = this.lines[this.line_count];
    } else {
      picture = new createjs.Container();
      picture.sprite_key = sprite_key;
      picture.type = "picture";

      var sprite = new createjs.Sprite(game.sprites[sprite_key].sprite, sprite_key);
      sprite.y = (this.line_height / 2) - (sprite.spriteSheet._frameHeight/2);

      picture.addChild(sprite);

      picture.width = sprite.spriteSheet._frameWidth;
      picture.height = this.line_height;
    }

    return this.add_line(picture);
  }

  add_number_picker(width=75, min=0, max=0) {
    var picker;
    if (this.lines.length > this.line_count && this.lines[this.line_count].type == "number_picker") {
      picker = this.lines[this.line_count];
      picker.min_value = min;
      picker.max_value = max;
    } else {
      picker = new NumberPicker(width, this.line_height, min, max);
      picker.type = "number_picker";
    }

    return this.add_line(picker);
  }

  add_line(line) {
    line.id = getUID(line.type);
    this.by_id[line.id] = line;

    if (this.lines.length > this.line_count) {
      this.lines[this.line_count] = line;
    } else {
      this.lines.push(line);
    }
    this.line_count += 1;

    this.addChild(line);
    line.y = this.height;
    line.x = this.margin;
    this.height += line.height + this.margin;
    if (this.width < line.width + this.margin*2) {
      this.width = line.width + this.margin*2;
    }
    for(let i in this.lines) {
      this.lines[i].x = this.width/2 - this.lines[i].width/2;
    }
    if(this.active && line.show) line.show();

    return line.id;
  }

  get_input_value(id) {
    return this.by_id[id].value;
  }

  get_line_by_id(id) {
    return this.by_id[id];
  }

  on_close() {
    game.ship.clear_selection();
  }
  tick() {
    for(let i in this.lines) {
      if(this.lines[i].tick) this.lines[i].tick();
    }
  }
}
