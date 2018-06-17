class HUD extends createjs.Container {
  constructor() {
    super();
    this.width = 0;
    this.height = 0;

    this.addChild(new TopBar());
    this.addChild(new BottomBar());


    return;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.children.forEach(function(child) {
      child.resize(width, height);
    });
  }
  tick() {
    this.children.forEach(function(child) {
      child.tick();
    });
  }
}
