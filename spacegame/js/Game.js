/**
 * Created by Ox The Automaton on 7/1/2017.
 */
/*jshint esversion: 6 */

class Game {
  constructor(raw) {
    this.raw = raw;

    this.ship = new Ship(raw.ship);
    this.view = new View(raw, this.ship);

    d3.select(document)
      .on("click", this.onclick.bind(this));

    this.keys = { SP: 32, W: 87, A: 65, S: 83, D: 68, R: 82, F: 70, UP: 38, LT: 37, DN: 40, RT: 39 };
    window.keysPressed = {};
    var watchedKeyCodes = [this.keys.SP, this.keys.W, this.keys.A, this.keys.S, this.keys.D, this.keys.UP, this.keys.LT, this.keys.DN, this.keys.RT];

    var keypress_handler = function (down) {
      return function (e) {
        var index = watchedKeyCodes.indexOf(e.keyCode);
        if (index >= 0) {
          window.keysPressed[watchedKeyCodes[index]] = down;
          e.preventDefault();
        }
        if(down) {
          game.onkey(e.keyCode);
        }
      };
    };

    window.addEventListener("keydown", keypress_handler(true), false);
    window.addEventListener("keyup", keypress_handler(false), false);

    

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


    this.click_distance = 3;
    

    this.forward = new THREE.Vector3();
    this.sideways = new THREE.Vector3();

    this.mouse = new THREE.Vector2(0, 0);
    this.forward_raycaster = new THREE.Raycaster();

    this.view.show_overlay(this.view.menu);

    this.lastTimeStamp;
    requestAnimationFrame(this.loop.bind(this));

  }

  onclick() {
    if (!this.view.pointer_controls.isLocked ) {
      return;
    }

    this.forward_raycaster.setFromCamera(this.mouse, this.view.camera);
    let intersects = this.forward_raycaster.intersectObjects([this.ship], true);

    if (intersects.length > 0 && intersects[0].distance < this.click_distance && intersects[0].object.select) {
      let object = intersects[0].object;
      object.select();
      
    }
  }

  onkey(keyCode) {
    if (keyCode == 81) { // q
      if(this.view.active_overlay) {
        this.view.hide_overlay();
      } else {
        if (this.view.pointer_controls.isLocked) {
          this.view.pointer_controls.unlock();
        } else {
          this.view.pointer_controls.lock();
        }
      }
    } else {
      if (this.view.active_overlay && this.view.active_overlay.keypress) {
        this.view.active_overlay.keypress(keyCode);
      }
    }
  }

  

  loop(timeStamp) {
    let timeElapsed = this.lastTimeStamp ? timeStamp - this.lastTimeStamp : 0;
    this.lastTimeStamp = timeStamp;
    let start_time = performance.now();

    this.resetPlayer();
    this.keyboardControls();
    this.applyPhysics(timeElapsed);
    this.view.updateCamera(this.motion);


    this.forward_raycaster.setFromCamera(this.mouse, this.view.camera);

    var intersects = this.forward_raycaster.intersectObjects([this.ship], true);

    if(this.view.active_overlay && this.view.active_overlay.tick) {
      this.view.active_overlay.tick();
    }

    this.view.render();

    this.view.stats(timeElapsed, performance.now() - start_time);

    

    for(let key in tickable) {
      let callback = tickable[key];
      callback(timeElapsed);
    }

    requestAnimationFrame(this.loop.bind(this));
  }

  keyboardControls() {
    // look around
    var sx = window.keysPressed[this.keys.UP] ? 0.03 : (window.keysPressed[this.keys.DN] ? - 0.03 : 0);
    var sy = window.keysPressed[this.keys.LT] ? 0.03 : (window.keysPressed[this.keys.RT] ? - 0.03 : 0);

    if (Math.abs(sx) >= Math.abs(this.motion.spinning.x)) this.motion.spinning.x = sx;
    if (Math.abs(sy) >= Math.abs(this.motion.spinning.y)) this.motion.spinning.y = sy;

    this.motion.rotation.set(0, 0, 1);
    this.motion.rotation.applyEuler(this.view.camera.rotation);

    this.motion.rotation.y = 0;
    this.motion.rotation.normalize();

    if(this.view.active_overlay) {
      return;
    }

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
      //this.motion.velocity.y += vy;

    }
  }


  resetPlayer() {
    if (this.motion.position.y < - 123) {
      this.motion.position.set(0, 0, 0);
      this.motion.velocity.multiplyScalar(0);

      this.view.camera.rotation.y = Math.PI;
      this.view.camera.rotation.x = 0;
      this.view.camera.rotation.z = 0;
    }
  }


  applyPhysics(dt) {
    this.phisics_state.timeLeft += dt;

    // run several fixed-step iterations to approximate varying-step
    dt = 5;
    this.physics_loops = 0;
    while (this.phisics_state.timeLeft >= dt) {
      this.physics_loops += 1;

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
