class CardTable extends createjs.Container {
  constructor() {
    super();
    this.cards = [];
  }
  focus(card) {
    if (card) this.register(card);
    var cards = this.children;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i] !== card) {
        cards[i].focused = false;
      }
      if (!cards[i].pinned && cards[i] !== card) {
        cards[i].active = false;
        this.removeChild(cards[i]);
      }
    }
    if (card !== undefined) {
      card.focused = true;
      if (this.getChildIndex(card) < 0) {
        this.addChild(card);
      }
      this.setChildIndex(card, this.numChildren - 1);
    }
  }
  register(card) {
    if (!this.cards.includes(card)) {
      this.cards.push(card);
    }
  }
  resize(width, height) {
    var cards = this.children;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.x < -card.width / 2) {
        card.x = -card.width / 2;
      }
      if (card.x > width - card.width / 2) {
        card.x = width - card.width / 2;
      }
      if (card.y < -card.height / 2) {
        card.y = -card.height / 2;
      }
      if (card.y > height - card.height / 2) {
        card.y = height - card.height / 2;
      }
    }
  }
  tick() {
    var cards = this.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].tick();
    }
  }
}
