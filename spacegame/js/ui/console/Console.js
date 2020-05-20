class Console extends Overlay {
  constructor(ship) {
    super();

    this.ship = ship;


    this.aspect_ratio = 4 / 3;

    //   A steralized data container for handing to Vue.  
    // Things inside have getters and setters defined below
    //
    this.data = {
      width: 100,
      height: 100,
      center: 50,
      screen: null
    };

    this.vue = Vue.component("menu-overlay", {
      data: (function () { return this.data; }).bind(this),
      template: `
        <div id="console-frame" class="center" v-bind:style="{'width':(width)+'px', 'height':(height)+'px'}">
          <div id="console-bezel" class="center" v-bind:style="{'width':(width-80)+'px', 'height':(height-60)+'px'}" >
            <component v-bind:is="screen" v-bind:data="$data"></component>
          </div>
        </div>
      `
    });
  }

  set width(value) {
    this.data.width = value;
  }
  get width() {
    return this.data.width;
  }
  set height(value) {
    this.data.height = value;
  }
  get height() {
    return this.data.height;
  }
  set center(value) {
    this.data.center = value;
  }
  get center() {
    return this.data.center;
  }
  set screen(value) {
    this.data.screen = value;
  }
  get screen() {
    return this.data.screen;
  }

  update_size(width, height) {
    this.center = width / 2;

    if (height > width / this.aspect_ratio) {
      height = width / this.aspect_ratio;
    }

    if (width > height * this.aspect_ratio) {
      width = height * this.aspect_ratio;
    }

    this.width = width;
    this.height = height;
  }
}
