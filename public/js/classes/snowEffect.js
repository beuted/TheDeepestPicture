function SnowEffect(textureLoader) {
    this.textureLoader = textureLoader;

    this.particleCount = 2000;
    this.weather = 0;
    this.snowFlakeMaterials = [];
}

SnowEffect.prototype.setup = function() {
	this.sceneSnow = new THREE.Scene();
    this.sceneSnow.fog = new THREE.FogExp2(0x000000, 0.0020);
    this.fixedCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 10000);

	var geometry = new THREE.Geometry();

    var snowSprites = [];
	snowSprites.push(this.textureLoader.load('images/sprites/snowflake1.png'));
	snowSprites.push(this.textureLoader.load('images/sprites/snowflake2.png'));
	snowSprites.push(this.textureLoader.load('images/sprites/snowflake3.png'));
	snowSprites.push(this.textureLoader.load('images/sprites/snowflake4.png'));
	snowSprites.push(this.textureLoader.load('images/sprites/snowflake5.png'));

    snowSprites.forEach(function(sprite) { sprite.minFilter = THREE.LinearFilter; })

	for (var i = 0; i < this.particleCount; i++) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 1000 - 500;
		vertex.y = Math.random() * 1000 - 500;
		vertex.z = Math.random() * 1000 - 500;

		geometry.vertices.push(vertex);
	}

	parameters =
        [
            [ [1.0, 0.2, 0.5], snowSprites[1], 20 ],
            [ [0.98, 0.1, 0.5], snowSprites[2], 15 ],
            [ [0.93, 0.05, 0.5], snowSprites[0], 10 ],
            [ [0.90, 0, 0.5], snowSprites[4], 8 ],
            [ [0.88, 0, 0.5], snowSprites[3], 5 ],
        ];


	for (var k = 1; k <= 3; k++) {
		for (var i = 0; i < parameters.length; i++) {
			var color  = parameters[i][0];
			var sprite = parameters[i][1];
			var size   = parameters[i][2];

			this.snowFlakeMaterials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
			this.snowFlakeMaterials[i].color.setHSL( color[0], color[1], color[2] );

			var particles = new THREE.Points( geometry, this.snowFlakeMaterials[i] );

			particles.rotation.x = Math.random() * 6;
			particles.rotation.y = Math.random() * 6;
			particles.rotation.z = Math.random() * 6;
			
			particles.position.y = k * 1000 + 500;

			this.sceneSnow.add(particles);
		}
	}
}

SnowEffect.prototype.update = function() {
    var time = Date.now() * 0.00005;

	for (var i = 0; i < this.sceneSnow.children.length; i++) {
		var object = this.sceneSnow.children[i];

		if (object instanceof THREE.Points) {
			object.rotation.y = time * this.weather * ( i < 4 ? i + 1 : ( i + 1 ) );
			object.position.y --;
			
			if (object.position.y < -500)
				object.position.y = 1500;	
		}
	}

	for (var i = 0; i < this.snowFlakeMaterials.length; i ++) {
		var color = parameters[i][0];

		var h = ( 360 * (( color[0] + time ) % 360) ) / 360;
		this.snowFlakeMaterials[i].color.setHSL( h, color[1], color[2] );
	}
}

SnowEffect.prototype.render = function(renderer, controls, camera) {
	//this.fixedCamera.lookAt(controls.getDirection());
	renderer.render(this.sceneSnow, camera);
}