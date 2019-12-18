class View {
  constructor(raw, ship) {

    this.raw = raw;
    this.ship = ship;

    let width = window.innerWidth;
    let height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    // this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.canvas = this.renderer.domElement;
    document.getElementById('game').appendChild(this.canvas);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 9000);

    this.pointer_controls = new THREE.PointerLockControls(this.camera);

    this.blocker = d3.select("#game")
      .style("width", "100%")
      .style("height", "100%")
      .append("div")
      .attr("id", "blocker")
      .style("position", "absolute")
      .style("width", "100%")
      .style("height", "100%")
      .style("background-color", "rgba(0, 0, 0, 0.5)")
      .on("click", function () {
        this.pointer_controls.lock();
      }.bind(this));

    this.menu = new Menu();

    this.pointer_controls.addEventListener('lock', function () {
      this.blocker.attr("hidden", true);
      this.reticle.attr("hidden", null);
      this.hide_overlay();
    }.bind(this));

    this.pointer_controls.addEventListener('unlock', function () {
      this.blocker.attr("hidden", null);
      this.reticle.attr("hidden", true);
      if (!this.active_overlay) {
        this.show_overlay(this.menu);
      }
    }.bind(this));

    this.reticle = d3.select("#game")
      .append("div")
      .attr("id", "reticle")
      .style("position", "absolute")
      .style("width", "4px")
      .style("height", "4px")
      .style("top", "50%")
      .style("left", "50%")
      .style("margin-left", "-2px")
      .style("margin-top", "-2px")
      .style("border", "1px solid black")
      .style("background-color", "white")
      .style("border-radius", "4px")
      .attr("hidden", true);

    this.scene = new THREE.Scene();

    let light = new THREE.HemisphereLight(0xffffff, 0x684860, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);


    // postprocessing
    this.composer = new THREE.EffectComposer(this.renderer);

    let renderPass = new THREE.RenderPass(this.scene, this.camera);
    renderPass.renderToScreen = true;
    this.composer.addPass(renderPass);

    let ssaaRenderPass = new THREE.SSAARenderPass(this.scene, this.camera);
    ssaaRenderPass.unbiased = true;
    ssaaRenderPass.sampleLevel = 2;
    this.composer.addPass(ssaaRenderPass);

    this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    this.outlinePass.visibleEdgeColor = new THREE.Color('#ffff00');
    this.outlinePass.edgeGlow = 0.5;
    this.composer.addPass(this.outlinePass);

    let copyPass = new THREE.ShaderPass(THREE.CopyShader);
    //this.composer.addPass(copyPass);


    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();


    let envMap = new THREE.CubeTextureLoader().load([
      'img/cube/dark-s_px.jpg', // right
      'img/cube/dark-s_nx.jpg', // left
      'img/cube/dark-s_py.jpg', // top
      'img/cube/dark-s_ny.jpg', // bottom
      'img/cube/dark-s_pz.jpg', // back
      'img/cube/dark-s_nz.jpg' // front
    ]);
    envMap.format = THREE.RGBFormat;
    this.scene.background = envMap;

    this.scene.add(this.ship);

    this.camera_euler = new THREE.Euler(0, 0, 0, 'YXZ');

  }

  render() {
    //this.composer.render();
    this.renderer.render(this.scene, this.camera);
  }


  resize() {

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.composer.setSize(this.width, this.height);

    if (this.active_overlay) {
      this.active_overlay.update_size(this.width, this.height);
    }
  }

  updateCamera(motion) {
    this.camera_euler.x = motion.rotation.x;
    this.camera_euler.y = motion.rotation.y;
    this.camera.position.copy(motion.position);
    this.camera.position.y += 1.6;
  }

  stats(dt, execution_time) {
    if (dt == 0) {
      this.framerate_sum = 0;
      this.framerates = [];

      this.execution_sum = 0;
      this.execution_times = [];

      this.status_div = d3.select("body")
        .append("div")
        .attr("id", "status")
        .style("position", "absolute")
        .style("color", "#ffffff")
        .style("background-color", "rgba(0, 0, 0, 0.5)")
        .style("padding", "3px")
        .classed('unselectable', true);

      return;
    }

    let new_framerate = 1000 / dt;
    this.framerates.push(new_framerate);
    this.framerate_sum += new_framerate;
    if (this.framerates.length > 60) {
      this.framerate_sum -= this.framerates.shift();
    }

    let new_execution_time = execution_time;
    this.execution_times.push(new_execution_time);
    this.execution_sum += new_execution_time;
    if (this.execution_times.length > 60) {
      this.execution_sum -= this.execution_times.shift();
    }

    let status = [
      "FPS " + Math.round(this.framerate_sum / this.framerates.length),
      Math.round(this.execution_sum / this.execution_times.length) + "ms",
      this.renderer.info.render.triangles + " triangles",
      this.renderer.info.render.calls + " draws",
    ];

    this.status_div.selectAll("p").remove();
    this.status_div.selectAll("p")
      .data(status)
      .enter()
      .append("p")
      .text(function (d, i) {
        return d;
      });

    //this.status_div.selectAll("p").exit().remove();
  }



  show_overlay(overlay) {
    this.pointer_controls.unlock();
    this.hide_overlay();

    this.active_overlay = overlay;
    d3.select("#game").node().appendChild(overlay.dom);
    this.active_overlay.update_size(this.width, this.height);

    this.active_overlay.focus = true;
  }

  hide_overlay() {
    if (this.active_overlay) {
      d3.select("#game").node().removeChild(this.active_overlay.dom);
      this.pointer_controls.lock();

      this.active_overlay.focus = false;
      this.active_overlay = undefined;
    }
  }

}