/**
 * Created by Ox The Automaton on 7/1/2017.
 */
/*jshint esversion: 6 */

class Game {
  constructor(raw) {
    this.raw = raw;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('game').appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 9000);

    this.controls = new THREE.PointerLockControls(this.camera);


    this.blocker = d3.select("#game")
      .append("div")
      .attr("id", "blocker")
      .style("position", "absolute")
      .style("width", "100%")
      .style("height", "100%")
      .style("background-color", "rgba(0, 0, 0, 0.5)")
      

    this.menu = this.blocker
      .append("div")
      .attr("id", "menu")
      .text("Click to play!")
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
      .style("cursor", "pointer");
    



    menu.addEventListener('click', function () {
      this.controls.lock();
    }.bind(this), false);

    this.controls.addEventListener('lock', function () {
      this.blocker.attr("hidden", true);
    }.bind(this));

    this.controls.addEventListener('unlock', function () {
      this.blocker.attr("hidden", null);
    }.bind(this));

    this.scene = new THREE.Scene();


    this.resize = function () {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    let light = new THREE.HemisphereLight(0xffffdb, 0x684860, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    let directionalLight = new THREE.DirectionalLight(0x808080, 0.5);
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

    this.ship = new Ship(this.raw.ship);
    this.scene.add(this.ship);

    this.camera_euler = new THREE.Euler(0, 0, 0, 'YXZ');

    this.phisics_state = {
      timeStep: 5,
      timeLeft: 6,
      camera_height: 1.6,
      kneeDeep: 0.3,
      raycaster: new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, - 1, 0)),
      angles: new THREE.Vector2(),
      displacement: new THREE.Vector3(),
    };

    this.motion = {
      airborne: false,
      position: new THREE.Vector3(0, -1500, 0),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      spinning: new THREE.Vector2()
    }



    this.keys = { SP: 32, W: 87, A: 65, S: 83, D: 68, UP: 38, LT: 37, DN: 40, RT: 39 };

    window.keysPressed = {};

    var watchedKeyCodes = [this.keys.SP, this.keys.W, this.keys.A, this.keys.S, this.keys.D, this.keys.UP, this.keys.LT, this.keys.DN, this.keys.RT];

    var keypress_handler = function (down) {
      return function (e) {
        var index = watchedKeyCodes.indexOf(e.keyCode);
        if (index >= 0) {
          window.keysPressed[watchedKeyCodes[index]] = down;
          e.preventDefault();
        }
      };
    };

    window.addEventListener("keydown", keypress_handler(true), false);
    window.addEventListener("keyup", keypress_handler(false), false);

    this.forward = new THREE.Vector3();
    this.sideways = new THREE.Vector3();

    


    this.lastTimeStamp;
    requestAnimationFrame(this.loop.bind(this));
  }


  loop(timeStamp) {
    var timeElapsed = this.lastTimeStamp ? timeStamp - this.lastTimeStamp : 0;
    this.lastTimeStamp = timeStamp;

    this.resetPlayer();
    this.keyboardControls();
    this.applyPhysics(timeElapsed);
    this.updateCamera();
    this.stats(timeElapsed)

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
  }

  resetPlayer() {
    if (this.motion.position.y < - 123) {
      this.motion.position.set(0, 0, 0);
      this.motion.velocity.multiplyScalar(0);
    }
  }

  keyboardControls() {

    // look around
    var sx = window.keysPressed[this.keys.UP] ? 0.03 : (window.keysPressed[this.keys.DN] ? - 0.03 : 0);
    var sy = window.keysPressed[this.keys.LT] ? 0.03 : (window.keysPressed[this.keys.RT] ? - 0.03 : 0);

    if (Math.abs(sx) >= Math.abs(this.motion.spinning.x)) this.motion.spinning.x = sx;
    if (Math.abs(sy) >= Math.abs(this.motion.spinning.y)) this.motion.spinning.y = sy;

    this.motion.rotation.set(0, 0, 1);
    this.motion.rotation.applyEuler(this.camera.rotation);

    this.motion.rotation.y = 0;
    this.motion.rotation.normalize();

    // move around
    this.forward.set(this.motion.rotation.x, 0, this.motion.rotation.z);
    this.sideways.set(this.forward.z, 0, - this.forward.x);

    this.forward.multiplyScalar(window.keysPressed[this.keys.W] ? - 0.044 : (window.keysPressed[this.keys.S] ? 0.044 : 0));
    this.sideways.multiplyScalar(window.keysPressed[this.keys.A] ? - 0.044 : (window.keysPressed[this.keys.D] ? 0.044 : 0));

    var combined = this.forward.add(this.sideways);
    if (Math.abs(combined.x) >= Math.abs(this.motion.velocity.x)) this.motion.velocity.x = combined.x;
    if (Math.abs(combined.y) >= Math.abs(this.motion.velocity.y)) this.motion.velocity.y = combined.y;
    if (Math.abs(combined.z) >= Math.abs(this.motion.velocity.z)) this.motion.velocity.z = combined.z;

    if (!this.motion.airborne) {
      //jump
      var vy = window.keysPressed[this.keys.SP] ? 0.1 : 0;
      this.motion.velocity.y += vy;

    }
  }

  applyPhysics(dt) {

    if (true) {

      this.phisics_state.timeLeft += dt;

      // run several fixed-step iterations to approximate varying-step

      dt = 5;
      while (this.phisics_state.timeLeft >= dt) {

        var time = 0.3, damping = 0.93, gravity = 0.0004, tau = 2 * Math.PI;

        this.phisics_state.raycaster.ray.origin.copy(this.motion.position);
        this.phisics_state.raycaster.ray.origin.y += this.phisics_state.camera_height;

        var hits = this.phisics_state.raycaster.intersectObject(this.ship, true);

        this.motion.airborne = true;


        // are we above, or at most knee deep in, the platform?

        if ((hits.length > 0)) {
          var actualHeight = hits[0].distance - this.phisics_state.camera_height;

          // collision: stick to the surface if landing on it

          if ((this.motion.velocity.y <= 0) && (Math.abs(actualHeight) < this.phisics_state.kneeDeep)) {
            this.motion.position.y -= actualHeight;
            this.motion.velocity.y = 0;
            this.motion.airborne = false;

          }
        }

        if (this.motion.airborne) this.motion.velocity.y -= gravity;

        this.phisics_state.angles.copy(this.motion.spinning).multiplyScalar(time);
        this.motion.spinning.multiplyScalar(damping);

        this.phisics_state.displacement.copy(this.motion.velocity).multiplyScalar(time);
        if (!this.motion.airborne) this.motion.velocity.multiplyScalar(damping);

        this.motion.rotation.add(this.phisics_state.angles);
        this.motion.position.add(this.phisics_state.displacement);

        this.phisics_state.timeLeft -= dt;
      }
    }
  }

  updateCamera() {
    this.camera_euler.x = this.motion.rotation.x;
    this.camera_euler.y = this.motion.rotation.y;
    this.camera.position.copy(this.motion.position);
    this.camera.position.y += 1.6;
  }

  stats(dt) {
    if (dt == 0) {
      this.framerate_sum = 0;
      this.framerates = [];

      this.status_div = d3.select("body")
        .append("div")
        .attr("id", "status")
        .style("position", "absolute")
        .style("color", "#ffffff")
        .style("background-color", "rgba(0, 0, 0, 0.5)")
        .style("padding", "3px");

      this.status_div
        .append("p")
        .attr("id", "fps");

      this.status_div
        .append("p")
        .attr("id", "triangles");
        
      this.status_div
        .append("p")
        .attr("id", "calls");

      this.status_div
        .append("p")
        .attr("id", "debug");

      this.status_div
        .selectAll("p")
        .style("padding", "0px")
        .style("margin", "0px")
        .style("line-height", "13px");

      return;
    }

    let new_framerate = 1000 / dt;
    this.framerates.push(new_framerate);
    this.framerate_sum += new_framerate;

    if (this.framerates.length > 60) {
      this.framerate_sum -= this.framerates.shift();
    }

    document.getElementById("fps").innerHTML = "FPS " + Math.round(this.framerate_sum / this.framerates.length);
    document.getElementById("triangles").innerHTML = this.renderer.info.render.triangles + " triangles rendered";
    document.getElementById("calls").innerHTML = this.renderer.info.render.calls + " draw calls";
    document.getElementById("debug").innerHTML = Math.round(this.camera.position.x*10)/10 + " " + Math.round(this.camera.position.y*10)/10 + " " + Math.round(this.camera.position.z*10)/10;
    }



  pause(mode) {
    this.paused = mode;
  }

  save(try_login = true) {
    this.game_state = serialize(this.ship);
    console.log(this.game_state);
    this.api.upload_save_state(this.game_state, try_login);
  }

  logout() {
    this.api.logout();
  }

  login(initial_dialogue = false, message="") {
    if (!this.login_prompt) {
      this.login_prompt = new LoginPrompt(message);
    }

    if (initial_dialogue) {
      this.login_prompt.initial_dialogue(message);
    } else {
      this.login_prompt.login_dialogue(message);
    }
    this.login_prompt.active = true;
  }
}
