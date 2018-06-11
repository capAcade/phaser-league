var game = new Phaser.Game(1280, 1024, Phaser.AUTO, 'main_game', { preload: preload, create: create, update: update });

function preload() {
	game.load.spritesheet('car','assets/car.png');

	game.load.tilemap('map2', 'assets/phaserleage_tiledmap_arena1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles2', 'assets/set.gif');
}

var map2;
var cursors;
var velocity = 0;
var layer2;
var car;
var text;
var count = 0;

function create() {
	
	/*Enable Phyics Engine*/
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	cursors = game.input.keyboard.createCursorKeys();
	
	/*Adding Map*/
	map2 = game.add.tilemap('map2');
	map2.addTilesetImage('PhaserLeague-Tileset', 'tiles2');
	layer2 = map2.createLayer(0);
	

	
	/*Create Collision Groups*/
	var carCollisionGroup = game.physics.p2.createCollisionGroup();
	var wallsCG =  game.physics.p2.createCollisionGroup();
	game.physics.p2.updateBoundsCollisionGroup();

	//Set Collision Groups
	 var walls = game.physics.p2.convertCollisionObjects(map2, "Collisions", true);   
	  for(var wall in walls)
	  {
	    walls[wall].setCollisionGroup(wallsCG);
	    walls[wall].collides(carCollisionGroup);
	  }
	//building.body.setCollisionGroup(buildingCollisionGroup);
	
	/*Adding car*/
	car = game.add.sprite(570,100,'car');
	game.physics.p2.enable(car);
	car.body.angle = 90;
	game.physics.p2.enable(car,false); 
	car.scale.setTo(.5,.5);
	car.body.setCircle(28);
 	car.anchor.setTo(0.5, 0.5);

  	car.body.setCollisionGroup(carCollisionGroup);
	car.body.collides(wallsCG,stopCar,this);

	layer2.resizeWorld();
	 text = game.add.text(game.camera.x,game.camera.y, "Score: 0", {
        font: "24px Arial",
        fill: "#ff0044",
        align: "center"
    });
}

function update()
{

	/*Update Velocity*/
	if (velocity > 0) {
		// Forward Movement
		if (cursors.up.isDown && velocity <= 400) {
			// Accelerate
			velocity+=7;
		} else if (cursors.down.isDown) {
			// Break
			velocity-=21;
		} else {
			// decelerate (friction)
			velocity-=4
		}
	} else if (velocity < 0) {
		// Backwards Movement
		if (cursors.up.isDown) {
			// Break
			velocity+=21;
		} else if (cursors.down.isDown && velocity >= -200) {
			// Accelerate
			velocity-=7;
		} else {
			// decelerate (friction)
			velocity+=4
		}
	} else if (velocity == 0) {
		if (cursors.up.isDown) {
			// Accelerate
			velocity+=7;
		} else if (cursors.down.isDown) {
			// Accelerate
			velocity-=7;
		} else {
			velocity = 0;
		}
	}
	
	/**
	if (cursors.up.isDown && velocity <= 400) {
			velocity+=7;
	} else if (cursors.down.isDown) {
		if (velocity > 0 ) {
			velocity-=14;
		} else if (velocity >= -200){
			velocity-=7;
		}
	} else {
		if (velocity >= 7)
			velocity -= 7;
	}
		*/	
	/*Set X and Y Speed of Velocity*/
	car.body.velocity.x = velocity * Math.cos((car.angle-90)*0.01745);
	car.body.velocity.y = velocity * Math.sin((car.angle-90)*0.01745);
	
	/*Rotation of Car*/
	if (cursors.left.isDown)
		car.body.angularVelocity = -5*(velocity/1000);
	else if (cursors.right.isDown)
		car.body.angularVelocity = 5*(velocity/1000);
	else
		car.body.angularVelocity = 0;
}

 
function updateText() {

   // This updates every frame
    text.setText("Score:" + count);

}

function stopCar(player, car) {
 // we touched a coin, so kill it, update our score, and then update our score text
	velocity = 0;
	count--;
	updateText();

}