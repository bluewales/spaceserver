class Logo extends createjs.Container {
    constructor() {
      super();
  
      this.height = 50;
      this.width = 300;
  
      this.box = new createjs.Container();
      this.box.addChild(create_polygon(menu_palette[1], [[-110,0],[110,0],[70,60],[-70,60]]));
      this.text = new createjs.Text("Safiina", "30px Elasis", menu_palette[0]);
      this.text.textAlign = "center";
      this.text.y = 17;
      this.box.addChild(this.text);
  
      this.addChild(this.box);
    }
  
  
    resize(width, height) {
      this.box.x = width/2;
      this.box.y = -10;
    }
    tick(){
      
    }
  }
  