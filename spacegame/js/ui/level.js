class UILevel extends createjs.Container {
  constructor(start_level) {
    super();

    this.level = start_level;
    this.height = 50;
    this.width = 200;

    this.box = new createjs.Container();
    this.box.addChild(create_polygon(menu_palette[1], [[-60,0],[60,0],[100,60],[-100,60]]));
    this.text = new createjs.Text("Level " + this.level, "30px Arial", menu_palette[0]);
    this.text.textAlign = "center";
    this.text.y = 10;
    this.box.addChild(this.text);

    this.addChild(this.box);
  }

  set_level(new_level) {
    this.level = new_level;
    this.text.text = "Level " + this.level;
  }

  resize(width, height) {
    this.box.x = width/2;
    this.box.y = height - this.height;
  }
  tick(){
    
  }
}
