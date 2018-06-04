var Game = function (game) {};

Game.prototype = {

    preload: function () {
        this.optionCount = 1;
        this.playerCount = 2;

        this.velocity = [];
        var i;
        for(i = 0; i < this.playerCount; i++) {
            this.velocity.push(0);
        }
    },

    create: function () {
        /*Enable Phyics Engine*/
        game.physics.startSystem(Phaser.Physics.P2JS);

        /*Adding Map*/
        var map = game.add.sprite(0, 0, 'map');

        car = [];

        /*Adding car 1*/
        car[0] = game.add.sprite(320, 420, 'car1');
        game.physics.p2.enable(car[0]);
        car[0].body.collideWorldBounds = true;
        car[0].body.angle = 90;

        /*Adding car 2*/
        car[1] = game.add.sprite(420, 320, 'car2');
        game.physics.p2.enable(car[1]);
        car[1].body.collideWorldBounds = true;
        car[1].body.angle = 270;

        /*Adding Ball*/
        var ball = game.add.sprite(640, 512, 'ball');
        game.physics.p2.enable(ball);
        ball.body.collideWorldBounds = true;

        /*Create Collision Groups*/
        var car1CollisionGroup = game.physics.p2.createCollisionGroup();
        var car2CollisionGroup = game.physics.p2.createCollisionGroup();
        var ballCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        //Set Collision Groups
        car[0].body.setCollisionGroup(car1CollisionGroup);
        car[1].body.setCollisionGroup(car2CollisionGroup);
        ball.body.setCollisionGroup(ballCollisionGroup);

        //Set Collision
        car[0].body.collides([car1CollisionGroup, car2CollisionGroup, ballCollisionGroup]);
        car[1].body.collides([car2CollisionGroup, car1CollisionGroup, ballCollisionGroup]);
        ball.body.collides([ballCollisionGroup, car1CollisionGroup, car2CollisionGroup]);
    },

    update: function () {
        var self = this;

        var updatePlayer = function(i, controls) {
            /*Update Velocity*/
            if (self.velocity[i] > 0) {
                // Forward Movement
                if (controls.up && self.velocity[i] <= 600) {
                    // Accelerate
                    self.velocity[i] += 9;
                } else if (controls.down) {
                    // Break
                    self.velocity[i] -= 24;
                } else {
                    // decelerate (friction)
                    self.velocity[i] -= 6
                }
            } else if (self.velocity[i] < 0) {
                // Backwards Movement
                if (controls.up) {
                    // Break
                    self.velocity[i] += 24;
                } else if (controls.down && self.velocity[i] >= -300) {
                    // Accelerate
                    self.velocity[i] -= 9;
                } else {
                    // decelerate (friction)
                    self.velocity[i] += 6
                }
            } else if (self.velocity[i] === 0) {
                if (controls.up) {
                    // Accelerate
                    self.velocity[i] += 9;
                } else if (controls.down) {
                    // Accelerate
                    self.velocity[i] -= 9;
                } else {
                    self.velocity[i] = 0;
                }
            }

            /*Set X and Y Speed of Velocity 1*/
            car[i].body.velocity.x = self.velocity[i] * Math.cos((car[i].angle - 90) * 0.01745);
            car[i].body.velocity.y = self.velocity[i] * Math.sin((car[i].angle - 90) * 0.01745);

            /*Rotation of Car*/
            if (controls.left) {
                if (controls.eBrake) {
                    car[i].body.angularVelocity = -5 * (self.velocity[i] / 300);
                } else {
                    car[i].body.angularVelocity = -5 * (self.velocity[i] / 600);
                }
            } else if (controls.right) {
                if (controls.eBrake) {
                    car[i].body.angularVelocity = 5 * (self.velocity[i] / 300);
                } else {
                    car[i].body.angularVelocity = 5 * (self.velocity[i] / 600);
                }
            } else {
                car[i].body.angularVelocity = 0;
            }
        };

        var player1controls = {
            "up": game.input.keyboard.addKey(Phaser.Keyboard.UP).isDown,
            "down": game.input.keyboard.addKey(Phaser.Keyboard.DOWN).isDown,
            "left": game.input.keyboard.addKey(Phaser.Keyboard.LEFT).isDown,
            "right": game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).isDown,
            "eBrake": game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown
        };

        var player2controls = {
            "up": game.input.keyboard.addKey(Phaser.Keyboard.R).isDown,
            "down": game.input.keyboard.addKey(Phaser.Keyboard.F).isDown,
            "left": game.input.keyboard.addKey(Phaser.Keyboard.D).isDown,
            "right": game.input.keyboard.addKey(Phaser.Keyboard.G).isDown,
            "eBrake": game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown
        };

        updatePlayer(0, player1controls);
        updatePlayer(1, player2controls);
    },
};
