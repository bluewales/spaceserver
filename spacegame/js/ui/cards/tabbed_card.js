class Tab extends createjs.Container {
  constructor(name, parent) {
    super();
    this.parent = parent;


    this.name = name;
    this.height = this.parent.tab_height;
    this.tab_text_height = this.height - 4 * this.parent.border_width;
    this.label = new createjs.Text(name, (this.tab_text_height) + "px Arial", this.parent.foreground_color);
    this.label.x = this.parent.border_width*2;
    this.label.y = this.parent.border_width*2;

    this.label_width = this.label.getBounds().width;
    this.width = this.label_width + 4 * this.parent.border_width;

    this.box = new createjs.Shape();
    


    this.addChild(this.box);
    this.addChild(this.label);

    this.active = false;

    this.addEventListener("click", function(event) {
      this.parent.set_active_tab(this.name);
    }.bind(this));
  
  }
  get active() {
    return this._active;
  }
  set active(value) {
    if(this._active === value) return;
    this._active = value;

    this.box.graphics.clear();

    this.box.graphics.beginFill(this.parent.foreground_color).drawRoundRectComplex(
      0, 0, this.width, this.height-1,
      this.parent.border_width, this.parent.border_width, 0, 0
    ).endFill();

    if(value) {
      this.box.graphics.beginFill(this.parent.background_color).drawRoundRectComplex(
        this.parent.border_width, this.parent.border_width,
        this.width - 2 * this.parent.border_width, this.height,
        this.parent.border_width, this.parent.border_width, 0, 0
      ).endFill();
    } else {
      this.box.graphics.beginFill(this.parent.background_color).drawRoundRectComplex(
        this.parent.border_width, this.parent.border_width,
        this.width - 2 * this.parent.border_width, this.height - 2 * this.parent.border_width,
        this.parent.border_width, this.parent.border_width, 0, 0
      ).endFill();
    }
  }
}



class TabbedCard extends Card {
  constructor(name, pages) {

    var width = 100;
    var height = 100;

    super(name, width, height);

    this.tab_height = 40;
    
    this.pages = pages;

    this.bar = new createjs.Shape();
    this.addChild(this.bar);

    this.tabs = {};

    var page_count = 0;
    for (let tab_name in pages) {

      let page = pages[tab_name];

      page.frameless = true;
      page.resize_listener = this.resize.bind(this);

      page.y = this.tab_height + this.border_width;

      let tab = new Tab(tab_name, this);
      this.tabs[tab_name] = tab;

      tab.x = page_count * (tab.width + this.border_width) + this.border_width*2;
      tab.y = this.border_width;

      if(page_count == 0) {
        this.set_active_tab(tab_name);
      }

      this.addChild(tab);

      page_count += 1;
    }

    this.resize();
  }

  set_active_tab(tab_name) {
    if(this.active_tab) {
      this.active_tab.active = false;
      this.removeChild(this.active_page);
    }

    var tab = this.tabs[tab_name];
    tab.active = true;
    this.active_tab = tab;

    this.active_page = this.pages[tab_name];
    this.addChild(this.active_page);
  }

  resize() {
    var width = 100;
    var height = 100;

    for (let tab_name in this.pages) {
      let page = this.pages[tab_name];
      if (width < page.width) width = page.width;
      if (height < page.height + this.tab_height + this.border_width) {
        height = page.height + this.tab_height + this.border_width;
      }
    }

    this.width = width;
    this.height = height;

    this.bar.graphics.clear().beginFill(this.foreground_color).drawRect(
      0, this.tab_height,
      this.width, this.border_width
    ).endFill();
  }

  tick() {
    for (let tab_name in this.pages) {
      let page = this.pages[tab_name];
      let tab = this.tabs[tab_name];
      if(tab.active) page.tick();
    }
  }
}