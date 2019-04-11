class Market {
  constructor() {
    this.store = {};
    this.by_uid = {};

    this.handlers = [];

    //   Default prices
    //
    this.prices = {
      "steel": "45370",
      "plastic": "21643",
      "circuit board": "32128"
    };

    this.reload_prices();
  }

  reload_prices() {
    console.log("reload prices");

    game.api.download_prices("Earth", ["steel", "plastic", "circuit board"], function(prices) {
      this.prices = prices;
    }.bind(this));
  }

  register_sale(sell_summary) {
    console.log("Selling");
    console.log(sell_summary);
  }

  tick(event) {

  }
}
