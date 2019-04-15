function money_format(money) {
  return (money / 1000).toFixed(2) + "¤";  
}

class TradeMenuCard extends ColumnatedCard {
  constructor(label) {
    var column_labels = {
      "icon": "",
      "name": "Item",
      "price": "Price",
      "owned": "Owned",
      "selector": "To " + label,
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

    this.label = label;

    this.column_labels = column_labels;
    this.column_lookup = column_lookup;

    this.store = game.ship.item_store;
    this.store.register_change_handler(this.redraw.bind(this));

    this.prices = game.market.prices;
    
    game.market.watch("prices", function (prices) {
      this.prices = prices;
      this.redraw();
    }.bind(this));

    game.ship.watch("money", function (value) {
      this.account = value;
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
    this.trade_summary = {};

    for (let ix in items) {
      let item = items[ix];

      this.column_lookup["icon"].add_picture(item.sprite_key);
      this.column_lookup["name"].add_text(item.label);
      this.column_lookup["owned"].add_text(item.count);

      let price = this.prices[item.name_key];

      let selector_id = this.column_lookup["selector"].add_number_picker(75, 0, this.max_transaction(item.count, price, this.account));
      
      let price_string = money_format(price);
      this.column_lookup["price"].add_text(price_string);

      let selector = this.column_lookup["selector"].get_line_by_id(selector_id);

      if (this.reseting) {
        selector.on_change = undefined;
        selector.value = 0;
      }

      selector.on_change = this.redraw.bind(this);

      let trading = this.column_lookup["selector"].get_input_value(selector_id);
      let total_price = price * trading;

      let total_price_string = money_format(total_price);
      this.column_lookup["total_price"].add_text(total_price_string);

      total_price_sum += total_price;

      if (trading > 0) {
        this.trade_summary[item.label] = {
          "item": item,
          "trading": trading,
          "price": price
        };
      }
    }

    let total_price_string = money_format(total_price_sum);
    this.column_lookup["selector"].add_text("Total", true);

    let enable_trade = this.trade_ok(total_price_sum, this.account);
    let color = enable_trade ? menu_foreground_color : menu_contrast_color;
    this.column_lookup["total_price"].add_text(total_price_string, true, color);

    if(enable_trade) {
      this.column_lookup["total_price"].add_button(this.label, function () {
        this.trade(this.trade_summary);
        this.reset();
      }.bind(this));
    } else {
      this.column_lookup["total_price"].add_button("- - -", undefined);
    }
  }

  reset() {
    this.reseting = true;
    this.redraw();
    this.reseting = false;
  }

}

class BuyCard extends TradeMenuCard {
  constructor() {
    var label = "Buy";

    super(label);
  }

  max_transaction(count, price, account) {
    return Math.floor(account/price);
  }

  trade_ok(total_price, account) {
    return total_price <= account;
  }
  trade(buy_summary) {
    game.market.register_purchase(buy_summary);
  }
}

class SellCard extends TradeMenuCard {
  constructor() {

    var label = "Sell";

    super(label);
  }
  max_transaction(count, price, account) {
    return count;
  }
  trade_ok(total_price, account) {
    return true;
  }
  trade(sell_summary) {
    game.market.register_sale(sell_summary);
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
