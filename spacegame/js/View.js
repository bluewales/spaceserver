class View {
  constructor(raw, ship) {

    this.raw = raw;
    this.ship = ship;

    let width = window.innerWidth;
    let height = window.innerHeight;

    //   Set up 3D render stuff
    //
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    // this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.canvas = this.renderer.domElement;
    document.getElementById('game').appendChild(this.canvas);
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 9000);

    this.scene = new THREE.Scene();

    let light = new THREE.HemisphereLight(0xffffff, 0x684860, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

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

    //   Set up UI elements
    //
    this.menu = new Menu();
    this.pointer_controls = new THREE.PointerLockControls(this.camera);

    this.pointer_controls.addEventListener('lock', function () {
      this.reticle.attr("hidden", null);
      this.hide_overlay();
    }.bind(this));

    this.pointer_controls.addEventListener('unlock', function () {
      this.reticle.attr("hidden", true);
      if (!this.active_overlay) {
        this.show_overlay(this.menu);
      }
    }.bind(this));

    //   A steralized data container for handing to Vue.  
    //
    this.overlay_data = {
      active_overlay: null,
    };

    this.vue = new Vue({
      el: "#ui",
      data: this.overlay_data,
      methods: {
        hide_overlay: this.hide_overlay.bind(this)
      }
    });

    //   The little dot in the middle of the screen
    //
    this.reticle = d3.select("#game").append("div")
      .attr("id", "reticle")
      .attr("hidden", true);

    //   The status window in the corner
    //
    this.statses = {
      "fps_out": "",
      "render_time_out": "",
      "triangle_count": "",
      "render_calls": "",
    };

    let statuses = [
      '{{ fps_out }}',
      '{{ render_time_out }}',
      '{{ triangle_count }}',
      '{{ render_calls }}',
    ];

    this.status_div = d3.select("body").append("div")
      .attr("id", "status")
      .classed('unselectable', true)
      .selectAll("p")
        .data(statuses)
        .enter()
        .append("p")
        .text(function (d, i) {
          return d;
        });

    new Vue({
      el: "#status",
      data: this.statses
    });

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }


  resize() {

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

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
    if(dt == 0) {
      this.framerates = [];
      this.framerate_sum = 0;
      this.execution_times = [];
      this.execution_sum = 0;
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

    this.statses.fps_out = "FPS " + Math.round(this.framerate_sum / this.framerates.length);
    this.statses.render_time_out = Math.round(this.execution_sum / this.execution_times.length) + "ms";
    this.statses.triangle_count = this.renderer.info.render.triangles + " triangles";
    this.statses.render_calls = this.renderer.info.render.calls + " draws";
  }



  show_overlay(overlay) {
    this.pointer_controls.unlock();
    this.hide_overlay();

    this.active_overlay = overlay;
    this.overlay_data.active_overlay = overlay.vue;
    this.active_overlay.update_size(this.width, this.height);

    this.active_overlay.focus = true;
  }

  hide_overlay() {
    if (this.active_overlay) {
      this.pointer_controls.lock();

      this.active_overlay.focus = false;
      this.active_overlay = undefined;
      this.overlay_data.active_overlay = null;
    }
  }

}