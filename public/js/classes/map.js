// The map class contain all the information about the map :
// - position of trees

function Map(textureLoader, fileName) {
	// standard attributs
	this.fileName = fileName;
	this.size = [10000, 10000]; //In unit size
	this.treeSize = 100;

	this.textureLoader = textureLoader;

	this.sceneFloor = new THREE.Scene();
	this.sceneFloor.fog = new THREE.FogExp2(0x000000, 0.0008);
	
	// 0 nothing
	// 1 tree
	this.listObjPosition =  new Array();
	this.listObjPosition[0] = [1,400,0];
	this.listObjPosition[1] = [1,0,400];
	this.listObj = [];
	
}

// N = number of tree
// minDist = minimal distance between trees

Map.prototype.init = function(N, minDist) {
	for (var i = 0; i < N; i++) {
		p = new THREE.Vector2(Math.random() * this.size[0], Math.random() * this.size[1]),
		
		this.listObjPosition[i] = [1, p.x, p.y];
	}
}

Map.prototype.setup = function(scene, controls) {
	// Add the floor
	var floorTexture = textureLoader.load("images/sprites/snow.png");
	floorTexture.minFilter = THREE.LinearFilter;
	var matFloor = new THREE.MeshBasicMaterial({ map: floorTexture, transparent: true, side: THREE.DoubleSide });
	var floor = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), matFloor);
	var orientation = new THREE.Matrix4();
	orientation.makeRotationFromEuler(new THREE.Euler(Math.PI/2, 0, 0, "YXZ")); //rotate on X 90 degrees
	orientation.setPosition(new THREE.Vector3(5000,-500,5000)); //move half way on Z, since default pivot is at centre
	floor.applyMatrix(orientation); //apply transformation for geometry
	this.sceneFloor.add(floor);

	// Add trees
	for (var i = 0; i < this.listObjPosition.length; i++) {
		var textTree = this.textureLoader.load('images/sprites/tree.png');
		textTree.minFilter = THREE.LinearFilter;
		textTree.magFilter = THREE.NearestFilter;
		var material = new THREE.MeshLambertMaterial({ map: textTree , transparent: true, side: THREE.DoubleSide});
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(720, 1920), material);

		plane.position.x = this.listObjPosition[i][1];
		plane.position.z = this.listObjPosition[i][2];
		plane.position.y = 500;

		this.listObj.push(plane);
		
		scene.add(plane);
	}
}

Map.prototype.update = function() {
	for (var i = 0; i < this.listObj.length; i++) {
		this.listObj[i].setRotationFromQuaternion( controls.getObject().quaternion );
	}
}

Map.prototype.render = function(renderer, scene, camera) {
	renderer.render(this.sceneFloor, camera);
	renderer.render(scene, camera);	
}

// Go througth the list of object on the map to check collision
Map.prototype.checkTreeCollision = function(o) {
	for (var i = 0; i < this.listObjPosition.length; i++) {
		var a = (hero.hitbox.position.x - this.listObjPosition[i][1]);
		var b = (hero.hitbox.position.z - this.listObjPosition[i][2]);
		if (a*a +  b*b < this.treeSize*this.treeSize)
			return true;
	}
	
	return false;
}