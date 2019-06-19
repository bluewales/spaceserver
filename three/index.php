<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js - platformer demo</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <link type="text/css" rel="stylesheet" href="examples/main.css">
    
		<style>
			#blocker {
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.5);
			}

			#instructions {
				width: 100%;
				height: 100%;

				display: -webkit-box;
				display: -moz-box;
				display: box;

				-webkit-box-orient: horizontal;
				-moz-box-orient: horizontal;
				box-orient: horizontal;

				-webkit-box-pack: center;
				-moz-box-pack: center;
				box-pack: center;

				-webkit-box-align: center;
				-moz-box-align: center;
				box-align: center;

				color: #ffffff;
				text-align: center;
				font-family: Arial;
				font-size: 14px;
				line-height: 24px;

				cursor: pointer;
			}
		</style>
	</head>
	<body>

		<div id="blocker">

			<div id="instructions">
				<span style="font-size:36px">Click to play</span>
				<br /><br />
				Move: WASD<br/>
				Jump: SPACE<br/>
				Look: MOUSE
			</div>

		</div>

    <script src="build/three.js"></script>
    <script src="examples/js/controls/PointerLockControls.js"></script>

		<script>

			// player motion parameters

			var motion = {
				airborne: false,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Vector3(),
        spinning: new THREE.Vector2()
			};

			motion.position.y = - 1500;


			// game systems code

			var resetPlayer = function () {

				if ( motion.position.y < - 123 ) {

					motion.position.set( - 2, 7.7, 25 );
					motion.velocity.multiplyScalar( 0 );

				}

			};

			var keyboardControls = ( function () {

				var keys = { SP: 32, W: 87, A: 65, S: 83, D: 68, UP: 38, LT: 37, DN: 40, RT: 39 };

				var keysPressed = {};

				( function ( watchedKeyCodes ) {

					var handler = function ( down ) {

						return function ( e ) {

							var index = watchedKeyCodes.indexOf( e.keyCode );
							if ( index >= 0 ) {

								keysPressed[ watchedKeyCodes[ index ] ] = down;
								e.preventDefault();

							}

						};

					};
					window.addEventListener( "keydown", handler( true ), false );
          window.addEventListener( "keyup", handler( false ), false );

				} )( [
					keys.SP, keys.W, keys.A, keys.S, keys.D, keys.UP, keys.LT, keys.DN, keys.RT
				] );

				var forward = new THREE.Vector3();
				var sideways = new THREE.Vector3();

				return function () {

          // look around
					var sx = keysPressed[ keys.UP ] ? 0.03 : ( keysPressed[ keys.DN ] ? - 0.03 : 0 );
					var sy = keysPressed[ keys.LT ] ? 0.03 : ( keysPressed[ keys.RT ] ? - 0.03 : 0 );

					if ( Math.abs( sx ) >= Math.abs( motion.spinning.x ) ) motion.spinning.x = sx;
					if ( Math.abs( sy ) >= Math.abs( motion.spinning.y ) ) motion.spinning.y = sy;

					


            //camera.rotation.toVector3(motion.rotation);


            motion.rotation.set(0,0,1);
            motion.rotation.applyEuler(camera.rotation);

            



            
            motion.rotation.y = 0;
            motion.rotation.normalize();
            

            //motion.rotation.multiplyScalar( -10 );

            



            //motion.rotation.multiplyScalar( -1 );
            

						

            //console.log(motion.rotation);
            
            

						// move around
						forward.set(motion.rotation.x, 0, motion.rotation.z);
						sideways.set( forward.z, 0, - forward.x );

						forward.multiplyScalar( keysPressed[ keys.W ] ? - 0.1 : ( keysPressed[ keys.S ] ? 0.1 : 0 ) );
						sideways.multiplyScalar( keysPressed[ keys.A ] ? - 0.1 : ( keysPressed[ keys.D ] ? 0.1 : 0 ) );

						var combined = forward.add( sideways );
						if ( Math.abs( combined.x ) >= Math.abs( motion.velocity.x ) ) motion.velocity.x = combined.x;
						if ( Math.abs( combined.y ) >= Math.abs( motion.velocity.y ) ) motion.velocity.y = combined.y;
						if ( Math.abs( combined.z ) >= Math.abs( motion.velocity.z ) ) motion.velocity.z = combined.z;
          if ( ! motion.airborne ) {
						//jump
 						var vy = keysPressed[ keys.SP ] ? 0.7 : 0;
 						motion.velocity.y += vy;

					}

				};

			} )();


			var applyPhysics = ( function () {

				var timeStep = 5;
				var timeLeft = timeStep + 1;

				var birdsEye = 100;
				var kneeDeep = 0.4;

				var raycaster = new THREE.Raycaster();
				raycaster.ray.direction.set( 0, - 1, 0 );

				var angles = new THREE.Vector2();
				var displacement = new THREE.Vector3();

				return function ( dt ) {

					var platform = scene.getObjectByName( "platform", true );
					if ( platform ) {

						timeLeft += dt;

						// run several fixed-step iterations to approximate varying-step

						dt = 5;
						while ( timeLeft >= dt ) {

							var time = 0.3, damping = 0.93, gravity = 0.01, tau = 2 * Math.PI;

							raycaster.ray.origin.copy( motion.position );
							raycaster.ray.origin.y += birdsEye;

							var hits = raycaster.intersectObject( platform );

							motion.airborne = true;

							// are we above, or at most knee deep in, the platform?

							if ( ( hits.length > 0 ) && ( hits[ 0 ].face.normal.y > 0 ) ) {

								var actualHeight = hits[ 0 ].distance - birdsEye;

								// collision: stick to the surface if landing on it

								if ( ( motion.velocity.y <= 0 ) && ( Math.abs( actualHeight ) < kneeDeep ) ) {

									motion.position.y -= actualHeight;
									motion.velocity.y = 0;
									motion.airborne = false;

								}

							}

							if ( motion.airborne ) motion.velocity.y -= gravity;

							angles.copy( motion.spinning ).multiplyScalar( time );
							motion.spinning.multiplyScalar( damping );

							displacement.copy( motion.velocity ).multiplyScalar( time );
							if ( ! motion.airborne ) motion.velocity.multiplyScalar( damping );

							motion.rotation.add( angles );
							motion.position.add( displacement );

							// limit the tilt at ±0.4 radians

							// wrap horizontal rotation to 0...2π


							timeLeft -= dt;

						}

					}

				};

			} )();

			var updateCamera = ( function () {

				var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

				return function () {

					euler.x = motion.rotation.x;
					euler.y = motion.rotation.y;
					//camera.quaternion.setFromEuler( euler );

					camera.position.copy( motion.position );

					camera.position.y += 3.0;

				};

			} )();


			// init 3D stuff

			function makePlatform( url ) {

				var placeholder = new THREE.Object3D();

				var loader = new THREE.ObjectLoader();
				loader.load( url, function ( platform ) {

					placeholder.add( platform );

				} );

				return placeholder;

			}

			var renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			document.body.appendChild( renderer.domElement );

      var camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 9000 );
      
      controls = new THREE.PointerLockControls( camera );

      var blocker = document.getElementById( 'blocker' );
      var instructions = document.getElementById( 'instructions' );
      
			instructions.addEventListener( 'click', function () {

				controls.lock();

			}, false );

			controls.addEventListener( 'lock', function () {

				instructions.style.display = 'none';
				blocker.style.display = 'none';

			} );

			controls.addEventListener( 'unlock', function () {

				blocker.style.display = 'block';
				instructions.style.display = '';

			} );

      var scene = new THREE.Scene();

      var light = new THREE.HemisphereLight( 0xffffdb, 0x684860, 0.75 );
      light.position.set( 0.5, 1, 0.75 );
      scene.add( light );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      directionalLight.position.set( 1, 1, 1 );
      scene.add( directionalLight );
      
			var geometry = new THREE.SphereGeometry( 0.34, 32, 32 );
			//geometry.wireframe = true;
      var material = new THREE.MeshToonMaterial  ( { color: 0xffffff } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );

      var material = new THREE.MeshToonMaterial  ( { color: 0xabcdef } );
      var cube = new THREE.Mesh( geometry, material );
			scene.add( cube );
			
			var geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
			var material = new THREE.MeshToonMaterial  ( { color: 0xfedcba } );
			var moon_cube = new THREE.Mesh( geometry, material );
			cube.add( moon_cube );

			var geometry = new THREE.PlaneGeometry(2, 2);
			var material = new THREE.MeshToonMaterial( {color: 0xbbbbbb, side: THREE.DoubleSide} );
			var floor = new THREE.Mesh( geometry, material );
			floor.rotation.x = Math.PI/2;
			scene.add( floor );


      //create a blue LineBasicMaterial
      var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
      geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );

      var line = new THREE.Line( geometry, material );

      //scene.add( line );

      


			var envMap = new THREE.CubeTextureLoader().load( [
				'examples/textures/cube/MilkyWay/dark-s_px.jpg', // right
				'examples/textures/cube/MilkyWay/dark-s_nx.jpg', // left
				'examples/textures/cube/MilkyWay/dark-s_py.jpg', // top
				'examples/textures/cube/MilkyWay/dark-s_ny.jpg', // bottom
				'examples/textures/cube/MilkyWay/dark-s_pz.jpg', // back
				'examples/textures/cube/MilkyWay/dark-s_nz.jpg' // front
			] );
			envMap.format = THREE.RGBFormat;

			scene.background = envMap;

			scene.add( makePlatform(
				'examples/models/json/platform/platform.json'
			) );

			// start the game

			var start = function ( gameLoop, gameViewportSize ) {

				var resize = function () {

					var viewport = gameViewportSize();
					renderer.setSize( viewport.width, viewport.height );
					camera.aspect = viewport.width / viewport.height;
					camera.updateProjectionMatrix();

				};

				window.addEventListener( 'resize', resize, false );
				resize();

				var lastTimeStamp;
				var render = function ( timeStamp ) {

					var timeElapsed = lastTimeStamp ? timeStamp - lastTimeStamp : 0;
					lastTimeStamp = timeStamp;

					// call our game loop with the time elapsed since last rendering, in ms
					gameLoop( timeElapsed );

					renderer.render( scene, camera );
					requestAnimationFrame( render );

				};

				requestAnimationFrame( render );

      };
      
      var t = 0;


			var gameLoop = function ( dt ) {

        t += 0.005;

        cube.rotation.x = Math.sin(t/3)/7;
        cube.rotation.y -= 0.02;

        cube.position.x = 6.5*Math.sin(t);
        cube.position.z = 6.5*Math.cos(t);
				cube.position.y = 2;

				moon_cube.rotation.x += 0.01;
        moon_cube.rotation.y += 0.01;

        moon_cube.position.x = 1*Math.sin(t*10);
        moon_cube.position.z = 1*Math.cos(t*10);
				moon_cube.position.y = 0;
				
				
        
				resetPlayer();
				keyboardControls();
				applyPhysics( dt );
				updateCamera();

			};

			var gameViewportSize = function () {

				return {

					width: window.innerWidth, height: window.innerHeight

				};

			};

			start( gameLoop, gameViewportSize );
		</script>
	</body>
</html>
