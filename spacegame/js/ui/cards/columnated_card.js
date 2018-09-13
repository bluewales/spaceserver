class ColumnatedCard extends Card {
  constructor(label, columns) {
    var width = 100;
    var height = 100;

    super(label, width, height);

    this.columns = columns;

    for(let ix in this.columns) {
      let column = this.columns[ix];
      column.frameless = true;
      column.resize_listener = this.resize.bind(this);
      column.y = 0;

      column.default_width = 1;

      this.addChild(column);
    }


    this.resize();
  }


  resize() {
    var width = 0;
    var height = 0;
    var first = true;

    for (let ix in this.columns) {

      let column = this.columns[ix];


      if (first) first = false;
      else width += this.border_width;

      column.x = width;
      width += column.width

      if(height < column.height) height = column.height;
    }

    this.width = width;
    this.height = height;
  }

  
  tick() {
    for (let ix in this.columns) {
      let column = this.columns[ix];
      column.tick();
    }
  }
}
