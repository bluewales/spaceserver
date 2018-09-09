class BuyCard extends ColumnatedCard {
  constructor() {

    var label = "Buy";

    var columns = [
      new Card(),
      new Card()
    ];

    super(label, columns);

    let colors = ["red", "green"];

    for(let ix in columns) {
      let column = columns[ix];

      column.width = 250;
      column.height = 500;
      column.box = new createjs.Shape();
      column.box.graphics.beginFill(colors[ix]).drawRect(
        0, 0, column.width, column.height
      ).endFill();

      column.addChild(column.box);
    }
  }

  tick() {
  }
}

class SellCard extends ColumnatedCard {
  constructor() {

    var label = "Sell";

    var columns = [
      new InteractionCard("Pictures"),
      new InteractionCard("Names"),
      new InteractionCard("Counts"),
    ];

    super(label, columns);

    this.store = game.ship.item_store;
    this.store.register_change_handler(this.read_items.bind(this));

    this.read_items();
  }

  read_items() {
    var items = this.store.get_available_item_counts()

    this.columns[0].clear_lines();
    this.columns[1].clear_lines();
    this.columns[2].clear_lines();

    this.columns[0].add_text(" ");
    this.columns[1].add_text("Name");
    this.columns[2].add_text("Count");

    for(let ix in items){
      let item = items[ix]; 

      this.columns[0].add_picture(item.sprite_key);
      this.columns[1].add_text(item.label);
      this.columns[2].add_text(item.count + "x");
    }
  }

  tick() {
  }
}

class MarketCard extends TabbedCard {
  constructor() {

    var tabs = {
      "Buy": new BuyCard(),
      "Sell": new SellCard()
    };
    
    var name = "Market";
    super(name, tabs);
  }
}
