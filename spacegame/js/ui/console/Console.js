class Console extends Overlay {
  constructor(ship) {
    super();

    this.ship = ship;


    this.aspect_ratio = 4 / 3;
    this.level = 0;

    this.width = 100;
    this.height = 100;
    this.center = 50;

    this.screen = null;

    this.vue = Vue.component("menu-overlay", {
      data: (function () { return this; }).bind(this),
      template: `
        <div id="console-frame" class="center" v-bind:style="{'width':(width)+'px', 'height':(height)+'px'}">
          <div id="console-bezel" class="center" v-bind:style="{'width':(width-80)+'px', 'height':(height-60)+'px'}" >
            <component v-bind:is="screen" ></component>
          </div>
        </div>
      `
    });
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
