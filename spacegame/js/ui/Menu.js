class Menu extends Overlay {
  constructor(ship) {
    super();


    this.vue = Vue.component("menu-overlay", {
      template: `
        <div id="menu-overlay" v-on:click="$emit('overlay-close')">
           <div id="menu" class="center">
              <h1 style="padding: 20px;">Safiina</h1>
              <p style="text-align: center">Click to play</p>
           </div>
        </div>
      `
    });
  }

  update_size(width, height) {
  }
}