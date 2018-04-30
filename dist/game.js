var game = new Phaser.Game(1280, 839, Phaser.AUTO, 'main_game', { preload: preload, create: create, update: update });

function preload() {
	game.load.spritesheet('map','assets/map.jpg');
	game.load.spritesheet('car','assets/car.png');
	game.load.spritesheet('ball', 'assets/ball.jpg');
	game.load.physics("collision","assets/collision.json");
}

var cursors;
var velocity = 0;
function create() {

	/*Enable Phyics Engine*/
	game.physics.startSystem(Phaser.Physics.P2JS);

	/*Adding Map*/
	var map = game.add.sprite(0,0,'map');

	/*Adding car*/
	car = game.add.sprite(320,420,'car');
	game.physics.p2.enable(car);
	car.body.collideWorldBounds = true;
	car.body.angle = 90;

    /*Adding Ball*/
    var ball = game.add.sprite(640,420,'ball');
    game.physics.p2.enable(ball);
    ball.body.collideWorldBounds = true;

	cursors = game.input.keyboard.createCursorKeys();

    /*Create Collision Groups*/
    var carCollisionGroup = game.physics.p2.createCollisionGroup();
    var ballCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();

	//Set Collision Groups
	car.body.setCollisionGroup(carCollisionGroup);
	ball.body.setCollisionGroup(ballCollisionGroup);

	//Set Collision
	car.body.collides([carCollisionGroup,ballCollisionGroup]);
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
	car.body.velocity.x = velocity * Math.cos((car.angle-90)*0.01745);
	car.body.velocity.y = velocity * Math.sin((car.angle-90)*0.01745);

	/* handBreak */
    handbrake = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	/*Rotation of Car*/
	if (cursors.left.isDown) {
        if (handbrake.isDown) {
            car.body.angularVelocity = -5 * (velocity / 300);
        } else {
            car.body.angularVelocity = -5 * (velocity / 600);
		}
    } else if (cursors.right.isDown) {
        if (handbrake.isDown) {
            car.body.angularVelocity = 5*(velocity / 300);
        } else {
            car.body.angularVelocity = 5*(velocity / 600);
        }
	} else {
        car.body.angularVelocity = 0;
	}
}