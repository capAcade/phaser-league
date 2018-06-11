var main = new Phaser.Game(1280, 839, Phaser.AUTO, 'main_game', { preload: preload, create: create, update: update });

function preload() {
	main.load.spritesheet('map','assets/map.jpg');
	main.load.spritesheet('cars','assets/cars.png');
	main.load.spritesheet('ball', 'assets/ball.jpg');
	main.load.physics("collision","assets/collision.json");
}

var cursors;
var velocity = 0;
function create() {

	/*Enable Phyics Engine*/
	main.physics.startSystem(Phaser.Physics.P2JS);

	/*Adding Map*/
	var map = main.add.sprite(0,0,'map');

	/*Adding cars*/
	cars = main.add.sprite(320,420,'cars');
	main.physics.p2.enable(cars);
	cars.body.collideWorldBounds = true;
	cars.body.angle = 90;

    /*Adding Ball*/
    var ball = main.add.sprite(640,420,'ball');
    main.physics.p2.enable(ball);
    ball.body.collideWorldBounds = true;

	cursors = main.input.keyboard.createCursorKeys();

    /*Create Collision Groups*/
    var carCollisionGroup = main.physics.p2.createCollisionGroup();
    var ballCollisionGroup = main.physics.p2.createCollisionGroup();
    main.physics.p2.updateBoundsCollisionGroup();

	//Set Collision Groups
	cars.body.setCollisionGroup(carCollisionGroup);
	ball.body.setCollisionGroup(ballCollisionGroup);

	//Set Collision
	cars.body.collides([carCollisionGroup,ballCollisionGroup]);
	ball.body.collides([ballCollisionGroup,carCollisionGroup]);
}

function update()
{
	/*Update Velocity*/
	if (velocity > 0) {
		// Forward Movement
		if (cursors.up.isDown && velocity <= 600) {
			// Accelerate
			velocity+=9;
		} else if (cursors.down.isDown) {
			// Break
			velocity-=24;
		} else {
			// decelerate (friction)
			velocity-=6
		}
	} else if (velocity < 0) {
		// Backwards Movement
		if (cursors.up.isDown) {
			// Break
			velocity+=24;
		} else if (cursors.down.isDown && velocity >= -300) {
			// Accelerate
			velocity-=9;
		} else {
			// decelerate (friction)
			velocity+=6
		}
	} else if (velocity == 0) {
		if (cursors.up.isDown) {
			// Accelerate
			velocity+=9;
		} else if (cursors.down.isDown) {
			// Accelerate
			velocity-=9;
		} else {
			velocity = 0;
		}
	}

	/*Set X and Y Speed of Velocity*/
	cars.body.velocity.x = velocity * Math.cos((cars.angle-90)*0.01745);
	cars.body.velocity.y = velocity * Math.sin((cars.angle-90)*0.01745);

	/* handBreak */
    handbrake = main.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	/*Rotation of Car*/
	if (cursors.left.isDown) {
        if (handbrake.isDown) {
            cars.body.angularVelocity = -5 * (velocity / 300);
        } else {
            cars.body.angularVelocity = -5 * (velocity / 600);
		}
    } else if (cursors.right.isDown) {
        if (handbrake.isDown) {
            cars.body.angularVelocity = 5*(velocity / 300);
        } else {
            cars.body.angularVelocity = 5*(velocity / 600);
        }
	} else {
        cars.body.angularVelocity = 0;
	}
}