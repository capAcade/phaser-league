var Game = function(game) {};

Game.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.velocity = 0;
  },

  create: function () {
    /*Enable Phyics Engine*/
    game.physics.startSystem(Phaser.Physics.P2JS);

    /*Adding Map*/
    var map = game.add.sprite(0, 0, 'map');

    /*Adding car*/
    car = game.add.sprite(320, 420, 'car');
    game.physics.p2.enable(car);
    car.body.collideWorldBounds = true;
    car.body.angle = 90;

    /*Adding Ball*/
    var ball = game.add.sprite(640, 420, 'ball');
    game.physics.p2.enable(ball);
    ball.body.collideWorldBounds = true;

    this.cursors = game.input.keyboard.createCursorKeys();

    /*Create Collision Groups*/
    var carCollisionGroup = game.physics.p2.createCollisionGroup();
    var ballCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();

    //Set Collision Groups
    car.body.setCollisionGroup(carCollisionGroup);
    ball.body.setCollisionGroup(ballCollisionGroup);

    //Set Collision
    car.body.collides([carCollisionGroup, ballCollisionGroup]);
    ball.body.collides([ballCollisionGroup, carCollisionGroup]);

    /* Pause Menu */
    menuKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    menuKey.onDown.add(togglePause, self);

    function togglePause(event) {
      if (game.paused) {
        // Check if the click was inside the menu
        if (event) {
          console.log(event);

        } else {
          menuGroup.destroy();
          game.paused = false;
        }
      } else {
        game.paused = true;

        menuGroup = game.add.group();

        pauseText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Paused", { font: "65px Arial", fill: "#f0f", align: "center" }, menuGroup);
        pauseText.anchor.setTo(0.5, 0.5);
        
        resumeText = game.add.text(game.world.centerX, game.world.centerY, "Resume", { font: "45px Arial", fill: "#f0f", align: "center" }, menuGroup);
        resumeText.anchor.setTo(0.5, 0.5);

        exitText = game.add.text(game.world.centerX, game.world.centerY + 75, "Main Menu", { font: "45px Arial", fill: "#f0f", align: "center" }, menuGroup);
        exitText.anchor.setTo(0.5, 0.5);
      } 
    }
  },

  update: function () {
    /*Update Velocity*/
    if (this.velocity > 0) {
      // Forward Movement
      if (this.cursors.up.isDown && this.velocity <= 600) {
        // Accelerate
          this.velocity+=9;
      } else if (this.cursors.down.isDown) {
        // Break
          this.velocity-=24;
      } else {
        // decelerate (friction)
          this.velocity-=6
      }
    } else if (this.velocity < 0) {
        // Backwards Movement
        if (this.cursors.up.isDown) {
          // Break
            this.velocity+=24;
        } else if (this.cursors.down.isDown && this.velocity >= -300) {
          // Accelerate
            this.velocity-=9;
        } else {
          // decelerate (friction)
          this.velocity+=6
        }
    } else if (this.velocity == 0) {
      if (this.cursors.up.isDown) {
        // Accelerate
          this.velocity+=9;
      } else if (this.cursors.down.isDown) {
        // Accelerate
          this.velocity-=9;
      } else {
          this.velocity = 0;
      }
    }

    /*Set X and Y Speed of Velocity*/
    car.body.velocity.x = this.velocity * Math.cos((car.angle-90)*0.01745);
    car.body.velocity.y = this.velocity * Math.sin((car.angle-90)*0.01745);

    /* handBreak */
    handbrake = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    /*Rotation of Car*/
    if (this.cursors.left.isDown) {
      if (handbrake.isDown) {
        car.body.angularVelocity = -5 * (this.velocity / 300);
      } else {
        car.body.angularVelocity = -5 * (this.velocity / 600);
      }
    } else if (this.cursors.right.isDown) {
      if (handbrake.isDown) {
        car.body.angularVelocity = 5*(this.velocity / 300);
      } else {
        car.body.angularVelocity = 5*(this.velocity / 600);
      }
    } else {
      car.body.angularVelocity = 0;
    }
  },
};
