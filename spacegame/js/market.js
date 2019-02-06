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
  }


}
