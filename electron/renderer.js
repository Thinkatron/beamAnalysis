THREE = require("./three.min.js");

			var container, stats;

			var camera, scene, renderer;

			var points;

			init();
			animate();

            function createMatrix() {

            }






			function init() {


				//

				camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
				camera.position.z = 2750;

				scene = new THREE.Scene();

				//

				var particles = 500000;

				var geometry = new THREE.BufferGeometry();

				var positions = new Float32Array( particles * 3 );
				var colors = new Float32Array( particles * 3 );

				var color = new THREE.Color();

				var n = 1000, n2 = n / 2; // particles spread in the cube

				for ( var i = 0; i < positions.length; i += 3 ) {

					// positions

					var x = Math.random() * n - n2;
					var y = Math.random() * n - n2;
					var z = Math.random() * n - n2;

					positions[ i ]     = x;
					positions[ i + 1 ] = y;
					positions[ i + 2 ] = z;

					// colors

					var vx = ( x / n ) + 0.5;
					var vy = ( y / n ) + 0.5;
					var vz = ( z / n ) + 0.5;

					color.setRGB( vx, vy, vz );

					colors[ i ]     = color.r;
					colors[ i + 1 ] = color.g;
					colors[ i + 2 ] = color.b;

				}

				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

				geometry.computeBoundingSphere();

				//

				var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );

				points = new THREE.Points( geometry, material );
				scene.add( points );

				//

				renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				document.body.appendChild( renderer.domElement );

				//

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var time = Date.now() * 0.001;

				points.rotation.x = time * 0.25;
				points.rotation.y = time * 0.5;

				renderer.render( scene, camera );

			}