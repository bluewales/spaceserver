class SpaceLoader {
  constructor() {
    this.sources = {
      /* javascript */
      "three": { "source": "js/lib/three.min.js" },
      "effectComposer": { "source": "js/lib/EffectComposer.js" },
      "copyShader": { "source": "js/lib/CopyShader.js" },
      "SSAARenderPass": { "source": "js/lib/SSAARenderPass.js" },
      "shaderPass": { "source": "js/lib/ShaderPass.js" },
      "renderPass": { "source": "js/lib/RenderPass.js" },
      "outlinePass": { "source": "js/lib/OutlinePass.js" },
      "FXAAShader": { "source": "js/lib/FXAAShader.js" },
      "SMAAShader": { "source": "js/lib/SMAAShader.js" },
      "SMAAPass": { "source": "js/lib/SMAAPass.js" },
      "api": { "source": "js/api.js" },
      "consolePodium": { "source": "js/models/ConsolePodium.js" },
      "crown": { "source": "js/models/Crown.js" },
      "mixedMesh": { "source": "js/models/MixedMesh.js" },
      "gridCube": { "source": "js/models/GridCube.js" },
      "market": { "source": "js/market.js" },
      "palettes": { "source": "js/palettes.js" },
      "panel": { "source": "js/models/Panel.js"},
      "pointerLockControls": { "source": "js/lib/PointerLockControls.js"},
      "ship": { "source": "js/models/Ship.js"},
      "stairs": { "source": "js/models/Stairs.js" },
      "script": { "source": "js/script.js" },
      "wall": { "source": "js/models/Wall.js"},
      "door": { "source": "js/models/Door.js" },
      "game": { "source": "js/Game.js" },
      "overlay": { "source": "js/ui/Overlay.js" },
      "console": { "source": "js/ui/console/Console.js" },
      "engineerinConsole": { "source": "js/ui/console/EngineeringConsole.js" },
      "menu": { "source": "js/ui/Menu.js" },
      "view": { "source": "js/View.js" },
      "button": { "source": "js/models/Button.js" },
      "window": { "source": "js/models/Window.js" },
    };

    this.manifest = [];

    for (var name in this.sources) {
      var source = this.sources[name];
      this.manifest.push({ src: source.source + "?a=" + Math.random(), id: name });
      //this.manifest.push({ src: source.source, id: name });
    }

    this.loader = new createjs.LoadQueue(false);
    this.loader.on("complete", this.load_save.bind(this));

    this.width = d3.select("#game").node().getBoundingClientRect().width - 1;
    this.height = d3.select("#game").node().getBoundingClientRect().height - 1;


    var loading_div = d3.select("#game")
      .style("width", this.width + "px")
      .style("background-color", "white")
      .append("div")
      .attr("id", "loading")
      .style("color", "#333")
      .style("top", (this.height / 2 - 150) + "px")
      .style("position", "absolute")
      .style("margin", "auto")
      .style("width", this.width + "px");

    loading_div.append("h1")
      .style("color", "#333")
      .text("Safiina")
      .style("margin", "auto")
      .style("position", "static")
      .style("text-align", "center")
      .style("padding", "20px");

    loading_div.append("p")
      .style("color", "#333")
      .text("Loading")
      .style("text-align", "center")
      .style("margin", "auto");

    loading_div.append("div")
      .attr("id", "loading_box")
      .style("border", "1px solid #333")
      .style("margin", "auto")
      .style("width", "300px")
      .style("height", "25px")
      .append("div")
      .attr("id", "loading_bar")
      .style("background-color", "#333")
      .style("width", "0px")
      .style("height", "25px");

    this.loader.on("progress", (function (event) {
      console.log(Math.round(event.progress * 100) + " %");
      d3.select("#loading_bar").style("width", (event.progress * 100) + "%");
    }).bind(this));

    this.loader.loadManifest(this.manifest, true, "");
  }

  load_save() {
    this.api = new API();
    this.api.download_save_state((function (game_state) {
      var loading_div = d3.select("#loading").remove();

      init(game_state);
    }).bind(this));
  }
}