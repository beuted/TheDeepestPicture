
var container, stats, camera, controls, clock, scene, renderer;

var mouseX = 0, mouseY = 0;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var textureLoader = new THREE.TextureLoader();

// Creation of the hero object
var hero = new Hero('beuted');

// Creation of the map object
var map = new Map(textureLoader);

// Creation of night effects
var nightEffects = new NightEffects(textureLoader, new THREE.Vector3(100,100,100));

$(document).ready(function() {
	var blocker = document.getElementById('blocker');
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if (havePointerLock) {
		var element = document.body;

		var pointerlockchange = function ( event ) {

			if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
				controls.enabled = true;
				blocker.style.display = 'none';
			} else {
				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				instructions.style.display = '';
			}
		}

		var pointerlockerror = function (event) {
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {
			instructions.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {
				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				}

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();
			} else {
				element.requestPointerLock();
			}
		}, false );

	} else {
		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

	init();
	animate();
});

function init() {
	clock = new THREE.Clock();

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.0008);
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 10000);

	controls = new THREE.PointerLockControls(hero, camera);
	
	scene.add(controls.getObject());
	
	// Add map trees, floor and weather
	map.setup(scene, controls);
	
	// Add all fixed effects other than weather particles like eyes in the dark
	nightEffects.init(10, 0);
	nightEffects.setup(controls);
	
	// Directional lighting
	var directionalLight = new THREE.DirectionalLight(0x868686);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
	var ambientLight = new THREE.AmbientLight(0x464646);
	scene.add(ambientLight);

	// Handle drawing as WebGL (faster than Canvas but less supported)
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	renderer.autoClear = false;
	
	// Add the canvas to the document
	renderer.domElement.style.backgroundColor = '#D6F1FF'; // easier to see
	document.body.appendChild(renderer.domElement);
	
	// Display stats (fps, tpf...)
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);

	render();
	map.update(scene);
	nightEffects.update(hero);
	stats.update();
}

function render() {
	var delta = clock.getDelta();
	controls.update(delta); // Move camera	

	renderer.clear(); 
	
	// render of the eyes in the night
	nightEffects.render(renderer, camera);

	// render trees and floor and weather
	map.render(renderer, scene, camera)
}

function checkWallCollision(o) {
	return (o.hitbox.position.y < 0);//return ((o.hitbox.position.y < 0) || map.checkTreeCollision(hero));
}