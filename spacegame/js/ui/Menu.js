class Menu extends Overlay {
  constructor(ship) {
    super();

    this.dom = document.createElement("div");
    this.selection = d3.select(this.dom);

    this.vue = Vue.component("menu-overlay", {
      template: `
        <div id="menu-overlay" class="ui" v-on:click="$emit('overlay-close')" >
           <div id="menu">
              <h1 style="padding: 20px;">Safiina</h1>
              <p>Click to play</p>
           </div>
        </div>
      `
    });

    this.menu = this.selection
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "-webkit-box")
      .style("display", "-moz-box")
      .style("display", "box")
      .style("-webkit-box-orient", "horizontal")
      .style("-moz-box-orient", "horizontal")
      .style("box-orient", "horizontal")
      .style("-webkit-box-pack", "center")
      .style("-moz-box-pack", "center")
      .style("box-pack", "center")
      .style("-webkit-box-align", "center")
      .style("-moz-box-align", "center")
      .style("box-align", "center")
      .style("color", "#ffffff")
      .style("text-align", "center")
      .style("font-family", "Arial")
      .style("font-size", "14px")
      .style("line-height", "24px")
      .style("cursor", "pointer")
      .classed('ui', true)
      .on("click", function() {
        game.view.hide_overlay();
      })
      .append("div")
      .attr("id", "menu");

    this.menu.append("h1")
      .text("Safiina")
      .style("display", "box")
      .style("padding", "20px")
      .classed('unselectable', true);

    this.menu.append("p")
      .text("Click to play")
      .style("display", "box")
      .classed('unselectable', true);
  }

  update_size(width, height) {
  }
}