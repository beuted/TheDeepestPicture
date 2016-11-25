function WeatherEffect(textureLoader) {
    this.textureLoader = textureLoader;

    this.particleCount = 20000;
    this.weather = 0;
	this.particles = null;
	this.windSpeed = { x: 0, z: 0, y: 0 }
}

WeatherEffect.prototype.setup = function(scene) {
	var geometry = new THREE.Geometry();

	for (var i = 0; i < this.particleCount; i++) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 10000;
		vertex.y = Math.random() * 4000;
		vertex.z = Math.random() * 10000;

		geometry.vertices.push(vertex);

		var pointMaterial = new THREE.PointsMaterial({ size: Math.random() * 15 + 5, color: 0xFFFFFF, depthTest: true});
	}

	this.particles = new THREE.Points(geometry, pointMaterial);
	this.particles.sortParticles = true;

	this.particles.position.y = 0;

	scene.add(this.particles);
}

WeatherEffect.prototype.update = function() {
    var time = Date.now() * 0.00005;

	var pCount = this.particleCount;
	while (pCount--)
	{
		var speed = pCount % 3 + 3;
		var particle = this.particles.geometry.vertices[pCount];
		particle.setX(particle.x + this.windSpeed.x);
		particle.setY(particle.y - speed - this.windSpeed.y);
		particle.setZ(particle.z + this.windSpeed.z);
		this.particles.geometry.verticesNeedUpdate = true;

		if (particle.y < -500) {
			particle.setY(1000 + Math.random() * 4000);
		}

		if (particle.z < 0) {
			particle.setZ(10000);
		}

		if (particle.z > 10000) {
			particle.setZ(0);
		}

		if (particle.x < 0) {
			particle.setX(10000);
		}

		if (particle.x > 10000) {
			particle.setX(0);
		}
	}
}

WeatherEffect.prototype.render = function(renderer, scene, camera) {
	//renderer.render(scene, camera);
}