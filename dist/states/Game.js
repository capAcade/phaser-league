var Game = function(game) {};

Game.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.cursors;
    this.velocity = 0;
  },

  addMenuOption: function (text, callback) {
    var optionStyle = {
      font: '30pt TheMinion',
      fill: 'white',
      align: 'left',
      stroke: 'rgba(0,0,0,0)',
      srokeThickness: 4
    };
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount++;
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

    /*
    this.addMenuOption('resume', function (e) {
    // close menu
    });
    this.addMenuOption('Exit', function (e) {
    // change state to game menu
    this.game.state.start("GameMenu");
    });
    */
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
          velocity+=6
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
  }
};
