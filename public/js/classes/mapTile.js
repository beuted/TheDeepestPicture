// The map class contain all the information about the map :
// - position of trees

function MapTile(textureLoader, numberOfTrees, position = { x: 0, z: 0 }) {
	// standard attributs
	this.size = [10000, 10000]; //In unit size
	this.treeSize = 100;
	this.position = position;

	this.textureLoader = textureLoader;
	
	// 0 nothing
	// 1 tree
	this.listTreePosition =  new Array();
	this.listTreePosition[0] = [1,400,0];
	this.listTreePosition[1] = [1,0,400];
	this.listObj = [];

	for (var i = 0; i < numberOfTrees; i++) {
		p = new THREE.Vector2(this.position.x * 10000 + Math.random() * this.size[0], position.z * 10000 + Math.random() * this.size[1]),
		
		this.listTreePosition[i] = [1, p.x, p.y];
	}

	this.weatherEffect = new WeatherEffect(this.textureLoader, this.position);
}

MapTile.prototype.setup = function(scene, controls) {
	// Add the floor
	var floorTexture = textureLoader.load("images/sprites/snow.png");
	floorTexture.minFilter = THREE.LinearFilter;
	var matFloor = new THREE.MeshBasicMaterial({ map: floorTexture, transparent: true, side: THREE.DoubleSide });
	var floor = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), matFloor);
	var orientation = new THREE.Matrix4();
	orientation.makeRotationFromEuler(new THREE.Euler(Math.PI/2, 0, 0, "YXZ")); //rotate on X 90 degrees
	orientation.setPosition(new THREE.Vector3(5000,-500,5000)); //move half way on Z, since default pivot is at centre
	floor.applyMatrix(orientation); //apply transformation for geometry
	floor.translateX(this.position.x*10000);
	floor.translateY(this.position.z*10000);
	scene.add(floor);

	// Add trees
	for (var i = 0; i < this.listTreePosition.length; i++) {
		var textTree = this.textureLoader.load('images/sprites/tree.png');
		textTree.minFilter = THREE.LinearFilter;
		textTree.magFilter = THREE.NearestFilter;
		var material = new THREE.MeshLambertMaterial({ map: textTree , transparent: true, side: THREE.DoubleSide});
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(720, 1920), material);

		plane.position.x = this.listTreePosition[i][1];
		plane.position.z = this.listTreePosition[i][2];
		plane.position.y = 500;

		this.listObj.push(plane);
		
		scene.add(plane);
	}

	this.weatherEffect.setup(scene);
}

MapTile.prototype.update = function() {
	for (var i = 0; i < this.listObj.length; i++) {
		this.listObj[i].setRotationFromQuaternion(controls.getObject().quaternion);
	}
 
	this.weatherEffect.update();
}

MapTile.prototype.render = function(renderer, scene, camera) {
	renderer.render(scene, camera);	
}

// Go througth the list of object on the map to check collision
MapTile.prototype.checkTreeCollision = function(o) {
	for (var i = 0; i < this.listTreePosition.length; i++) {
		var a = (hero.hitbox.position.x - this.listTreePosition[i][1]);
		var b = (hero.hitbox.position.z - this.listTreePosition[i][2]);
		if (a*a +  b*b < this.treeSize*this.treeSize)
			return true;
	}

	return false;
}