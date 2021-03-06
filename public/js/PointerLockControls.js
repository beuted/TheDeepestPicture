THREE.PointerLockControls = function ( hero, camera ) {
    var scope = this;

    camera.rotation.set( 0, 0, 0 );

    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );

	yawObject = hero.hitbox;
	
    yawObject.add( pitchObject );

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var isOnObject = false;
    var canJump = false;

    var velocity = new THREE.Vector3(0,0,0); // Velocity in the repert of the view

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

	if ( scope.enabled === false ) return;

	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

	yawObject.rotation.y -= movementX * 0.002;
	pitchObject.rotation.x -= movementY * 0.002;

	pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
	
    };

    var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {

		case 38: // up
		case 90: // z
			moveForward = true;
			break;

		case 37: // left
		case 81: // q
			moveLeft = true; break;

		case 40: // down
		case 83: // s
			moveBackward = true;
			break;

		case 39: // right
		case 68: // d
			moveRight = true;
			break;

		case 32: // space
			if ( canJump === true ) velocity.y += 10;
			canJump = false;
			break;
		}
    };

    var onKeyUp = function ( event ) {
		switch( event.keyCode ) {

		case 38: // up
		case 90: // z
			moveForward = false;
			break;

		case 37: // left
		case 81: // q
			moveLeft = false;
			break;

		case 40: // down
		case 83: // s
			moveBackward = false;
			break;

		case 39: // right
		case 68: // d
			moveRight = false;
			break;

		}
    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {
		return yawObject;
    };

    this.isOnObject = function ( boolean ) {
		isOnObject = boolean;
		canJump = boolean;
    };

    this.getDirection = function() {
		// assumes the camera itself is not rotated
		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
	
		rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
	
		return direction.applyEuler( rotation );
    };

    this.update = function ( delta ) {
		if ( scope.enabled === false ) return;
		
		velocity.x += ( - velocity.x ) * 5 * delta;
		velocity.z += ( - velocity.z ) * 5 * delta;

		velocity.y -= 20 * delta;

		if ( moveForward )
			velocity.z -= 50 * delta;
		if ( moveBackward )
			velocity.z += 50 * delta;

		if ( moveLeft )
			velocity.x -= 50 * delta;
		if ( moveRight )
			velocity.x += 50 * delta;

		// Test de collisions
		yawObject.translateX( velocity.x );

		if (checkWallCollision(hero)) {
			yawObject.translateX( -velocity.x );
		}

		yawObject.translateZ( velocity.z );
		if (checkWallCollision(hero)) {
			yawObject.translateZ( -velocity.z );
			
		}
		
		yawObject.translateY( velocity.y ); 
		if (checkWallCollision(hero)) {
			if(velocity.y < 0)
				canJump = true;	
			yawObject.translateY( -velocity.y );
			velocity.y = 0;
		}
    };

};