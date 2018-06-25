class Steel extends Item {
  constructor(pos, container) {
    super(pos, container);
    this.label = "Steel";
    this.type = "Steel";
    this.sprite_key = "steel_sprite";
    this.addChild(new createjs.Sprite(game.sprites[this.sprite_key].sprite, this.sprite_key));
  }
  init(raw, objects) {
    super.init(raw, objects);


  }
  start(raw, objects) {
    super.start(raw, objects);
  }
}
