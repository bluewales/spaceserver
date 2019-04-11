function money_format(money) {
  return (money / 1000).toFixed(2) + "¤";  
}

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

    var column_labels = {
      "icon": "",
      "name": "Item",
      "price": "Price",
      "owned": "Owned",
      "selector": "To Sell",
      "total_price": "         "
    };

    var columns = [];
    var column_lookup = {};

    for(let index in column_labels) {
      var column = new InteractionCard(index);
      columns.push(column);
      column_lookup[index] = column;
    }

    super(label, columns);

    this.column_labels = column_labels;
    this.column_lookup = column_lookup;

    this.store = game.ship.item_store;
    this.store.register_change_handler(this.redraw.bind(this));

    game.market.watch("prices", function (prices) {
      this.prices = prices;
      this.redraw();
    }.bind(this));

    this.redraw();
  }

  redraw() {
    var items = this.store.get_available_item_counts();

    for(var index in this.column_lookup) {
      let header = this.column_labels[index];
      this.column_lookup[index].clear_lines();
      this.column_lookup[index].add_text(header, true);
    }

    let total_price_sum = 0;
    this.sell_summary = {};

    for(let ix in items) {
      let item = items[ix]; 

      this.column_lookup["icon"].add_picture(item.sprite_key);
      this.column_lookup["name"].add_text(item.label);
      this.column_lookup["owned"].add_text(item.count);

      let selector_id = this.column_lookup["selector"].add_number_picker(75, 0, item.count);
     
      let price = this.prices[item.name_key];
      let price_string = money_format(price);
      this.column_lookup["price"].add_text(price_string);

      let selector = this.column_lookup["selector"].get_line_by_id(selector_id);
      
      

      if (this.reseting) {
        selector.on_change = undefined;
        selector.value = 0;
      }

      selector.on_change = this.redraw.bind(this);

      let selling = this.column_lookup["selector"].get_input_value(selector_id);
      let total_price = price * selling;

      let total_price_string = money_format(total_price);
      this.column_lookup["total_price"].add_text(total_price_string);

      total_price_sum += total_price;

      if(selling > 0) {
        this.sell_summary[item.label] = {
          "item": item,
          "selling": selling,
          "price": price
        };
      }
    }

    let total_price_string = money_format(total_price_sum);
    this.column_lookup["selector"].add_text("Total", true);
    this.column_lookup["total_price"].add_text(total_price_string, true);

    this.column_lookup["total_price"].add_button("Sell", function() {
      game.market.register_sale(this.sell_summary);  
      this.reset();
    }.bind(this));
  }

  reset() {
    this.reseting = true;
    this.redraw();
    this.reseting = false;
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
      this.add_text("Account: " + money_format(value));
    }.bind(this));
  }
}

class MarketCard extends StratifiedCard {
  constructor() {
    var rows = {
      "Trades": new TradesCard(),
      "Status": new StatusCard()
    };
    var label = "Market";

    super(label, rows);
  }

  set active(value) {
    super.active = value;
    if (value) {
      this.x = (game.width - this.width) / 2;
      this.y = (game.height - this.height) / 2;

      this.reset();
    }
  }
}
