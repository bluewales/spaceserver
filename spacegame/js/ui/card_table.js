class CardTable extends createjs.Container {
  constructor() {
    super();
    this.cards = [];
  }
  focus(card) {
    if(card) this.register(card);
    var cards = this.children;
    for(var i = 0; i < cards.length; i++) {
      if(cards[i] !== card) {
        cards[i].focused = false;
      }
      if(!cards[i].pinned && cards[i] !== card) {
        cards[i].active = false;
        this.removeChild(cards[i]);
      }
    }
    if(card !== undefined) {
      card.focused = true;
      if(this.getChildIndex(card) < 0){
        this.addChild(card);
      }
      this.setChildIndex(card, this.numChildren-1);
    }
  }
  register(card) {
    if(!this.cards.includes(card)) {
      this.cards.push(card);
    }
  }
  resize(width, height) {
    var cards = this.children;
    var margin = 20;
    for(var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if(card.x < margin - card.width) {
        card.x = margin - card.width;
      }
      if(card.x > width - margin) {
        card.x = width - margin;
      }
      if(card.y < margin - card.height) {
        card.y = margin - card.height;
      }
      if(card.y > height - margin) {
        card.y = height - margin;
      }
    }
  }
  tick() {
    var cards = this.children;
    for(var i = 0; i < cards.length; i++) {
      cards[i].tick();
    }
  }
}
