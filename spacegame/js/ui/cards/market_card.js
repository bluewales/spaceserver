class BuyCard extends ColumnatedCard {
  constructor() {

    var label = "Buy";

    var columns = [
      new Card(),
      new Card()
    ];

    super(label, columns);

    let colors = ["red", "green", "purple"];

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
}

class SellCard extends ColumnatedCard {
  constructor() {

    var label = "Sell";

    var columns = [
      new InteractionCard("Pictures"),
      new InteractionCard("Names"),
      new InteractionCard("Counts"),
      new InteractionCard("Selectors"),
    ];

    super(label, columns);

    this.store = game.ship.item_store;
    this.store.register_change_handler(this.read_items.bind(this));

    this.count_index = 0;
    this.icon_index = 1;
    this.name_index = 2;
    this.picker_index = 3;

    this.read_items();
  }

  read_items() {
    var items = this.store.get_available_item_counts();

    this.columns[this.count_index].clear_lines();
    this.columns[this.icon_index].clear_lines();
    this.columns[this.name_index].clear_lines();
    this.columns[this.picker_index].clear_lines();

    for(let ix in items){
      let item = items[ix]; 

      this.columns[this.count_index].add_text(item.count + "x");
      this.columns[this.icon_index].add_picture(item.sprite_key);
      this.columns[this.name_index].add_text(item.label);
      this.columns[this.picker_index].add_number_picker(75, 0, item.count);
    }
  }
}

class TradesCard extends TabbedCard {
  constructor() {

    var tabs = {
      "Buy": new BuyCard(),
      "Sell": new SellCard()
    };

    var label = "Trades";
    super(label, tabs);
  }
}

class StatusCard extends InteractionCard {
  constructor() {
    super("Status", 1);
    
    game.ship.watch("money", function(value) {
      this.clear_lines();
      this.add_text("Account: ¤" + Math.floor(value));
    }.bind(this));

  }
}

class MarketCard extends StratifiedCard {
  constructor() {
    var tabs = {
      "Trades": new TradesCard(),
      "Status": new StatusCard()
    };
    var label = "Market";

    super(label, tabs);
  }

  set active(value) {
    super.active = value;
    if (value) {
      this.x = (game.width - this.width) / 2;
      this.y = (game.height - this.height) / 2;
    }
  }
}
