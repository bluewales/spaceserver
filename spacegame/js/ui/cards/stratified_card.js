class StratifiedCard extends Card {
  constructor(label, rows) {
    var width = 100;
    var height = 100;

    super(label, width, height);

    this.rows = rows;

    for (let ix in this.rows) {
      let row = this.rows[ix];
      row.frameless = true;
      row.resize_listener = this.resize.bind(this);
      row.x = 0;

      this.addChild(row);
    }


    this.resize();
  }


  resize() {
    var width = 0;
    var height = 0;
    var first = true;

    for (let ix in this.rows) {

      let row = this.rows[ix];

      if (first) first = false;
      else height += this.border_width;

      row.y = height;
      height += row.height;

      if (width < row.width) width = row.width;
    }

    this.width = width;
    this.height = height;
  }


  tick() {
    for (let ix in this.rows) {
      let row = this.rows[ix];
      row.tick();
    }
  }

  reset() {
    super.reset();
    for (let ix in this.rows) {
      let row = this.rows[ix];
      row.reset();
    }
  }
}
