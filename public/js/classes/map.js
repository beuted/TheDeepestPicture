function Map(textureLoader) {
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

Map.prototype.update = function() {
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