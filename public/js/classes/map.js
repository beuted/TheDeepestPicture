function Map(textureLoader) {
    this.mapArrayPosition = new THREE.Vector3(0,0,0)
    this.mapArray = [];
    for (var x = -1; x < 2; x++) {
        this.mapArray[x] = {};
        for (var z = -1; z < 2; z++) {
            this.mapArray[x][z] = new MapTile(textureLoader, 10, { x: x, z: z });
        }
    }
}

Map.prototype.setup = function(scene, controls) {
    for (var x = -1; x < 2; x++) {
        for (var z = -1; z < 2; z++) {
            this.mapArray[x][z].setup(scene, controls);
        }
    }
}

Map.prototype.update = function(scene) {
    if (controls.getObject().position.x > (this.mapArrayPosition.x + 1 + 0.5) * 10000) {
        this.setupWithPosition(scene, controls, new THREE.Vector3(1, 0, 0));
    } else if (controls.getObject().position.x < (this.mapArrayPosition.x - 0.5) * 10000) {
        this.setupWithPosition(scene, controls, new THREE.Vector3(-1, 0, 0));
    } else if (controls.getObject().position.z > (this.mapArrayPosition.z + 1 + 0.5) * 10000) {
        this.setupWithPosition(scene, controls, new THREE.Vector3(0, 0, 1));
    } else if (controls.getObject().position.z < (this.mapArrayPosition.z - 0.5) * 10000) {
        this.setupWithPosition(scene, controls, new THREE.Vector3(0, 0, -1));
    }

    for (var x = -1; x < 2; x++) {
        for (var z = -1; z < 2; z++) {
            this.mapArray[x][z].update();
        }
    }
}

Map.prototype.render = function(renderer, scene, camera) {

    for (var x = -1; x < 2; x++) {
        for (var z = -1; z < 2; z++) {
            this.mapArray[x][z].render(renderer, scene, camera);
        }
    }
}

Map.prototype.setupWithPosition = function(scene, controls, direction) {
    this.mapArrayPosition.add(direction);

    if (direction.x == 1) {
        for (var z = -1; z < 2; z++) {
            this.mapArray[-1][z].destroy();
        }

        for (var x = -1; x <= 0; x++) {
            for (var z = -1; z < 2; z++) {
                this.mapArray[x][z] = this.mapArray[x + 1][z]
            }
        }
        for (var z = -1; z < 2; z++) {
            this.mapArray[1][z] = new MapTile(textureLoader, 10, { x: 1 + this.mapArrayPosition.x, z: z + this.mapArrayPosition.z });
            this.mapArray[1][z].setup(scene, controls);
        }
    }

    if (direction.x == -1) {
        for (var z = -1; z < 2; z++) {
            this.mapArray[1][z].destroy();
        }

        for (var x = 1; x >= 0; x--) {
            for (var z = -1; z < 2; z++) {
                this.mapArray[x][z] = this.mapArray[x - 1][z]
            }
        }
        for (var z = -1; z < 2; z++) {
            this.mapArray[-1][z] = new MapTile(textureLoader, 10, { x: -1 + this.mapArrayPosition.x, z: z + this.mapArrayPosition.z });
            this.mapArray[-1][z].setup(scene, controls);
        }
    }

    if (direction.z == 1) {
        for (var x = -1; x < 2; x++) {
            this.mapArray[x][-1].destroy();
        }

        for (var z = -1; z <= 0; z++) {
            for (var x = -1; x < 2; x++) {
                this.mapArray[x][z] = this.mapArray[x][z + 1]
            }
        }
        for (var x = -1; x < 2; x++) {
            this.mapArray[x][1] = new MapTile(textureLoader, 10, { x: x + this.mapArrayPosition.x, z: 1 + this.mapArrayPosition.z });
            this.mapArray[x][1].setup(scene, controls);
        }
    }

    if (direction.z == -1) {
        for (var x = -1; x < 2; x++) {
            this.mapArray[x][1].destroy();
        }

        for (var z = 1; z >= 0; z--) {
            for (var x = -1; x < 2; x++) {
                this.mapArray[x][z] = this.mapArray[x][z - 1]
            }
        }
        for (var x = -1; x < 2; x++) {
            this.mapArray[x][-1] = new MapTile(textureLoader, 10, { x: x + this.mapArrayPosition.x, z: -1 + this.mapArrayPosition.z });
            this.mapArray[x][-1].setup(scene, controls);
        }
    }
}

Map.prototype.checkTreeCollision = function(hero) {
	for (var x = -1; x < 2; x++) {
        for (var z = -1; z < 2; z++) {
            if (this.mapArray[x][z].checkTreeCollision(hero))
            return true;
        }
    }
    return false
}