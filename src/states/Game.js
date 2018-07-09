var Game = function (game) {};

Game.prototype = {
    preload: function () {
        this.optionCount = 1;
        this.playerCount = 2;
        this.cars = [];
        this.map = {};
        this.layer = {};
        this.score = [0,0];

        this.velocity = [];
        var i;
        for(i = 0; i < this.playerCount; i++) {
            this.velocity.push(0);
        }
    },
    create: function () {
        var self = this;

        /*Enable Phyics Engine*/
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);

        /*Adding Map*/
        self.map = game.add.tilemap('map');
        self.map.addTilesetImage('PhaserLeague-Tileset', 'tiles');
        self.layer = self.map.createLayer('Arena1');
        self.layer.resizeWorld();

        /*Adding cars*/
        var carsOption = [
            {
                "name": "car1",
                "beginX": 320,
                "beginY": 512,
                "beginAngle": 90
            },
            {
                "name": "car2",
                "beginX": 960,
                "beginY": 512,
                "beginAngle": 270
            }
        ];
        for(var i = 0; i < self.playerCount; i++) {
            self.cars[i] = game.add.sprite(carsOption[i].beginX, carsOption[i].beginY, carsOption[i].name);
            game.physics.p2.enable(self.cars[i]);
            self.cars[i].body.collideWorldBounds = true;
            self.cars[i].body.angle = carsOption[i].beginAngle;
        }

        /*Adding Ball*/
        var ball = game.add.sprite(640, 512, 'ball');
        game.physics.p2.enable(ball);
        ball.body.collideWorldBounds = true;

        /*Create Collision Groups*/
        var car1CollisionGroup = game.physics.p2.createCollisionGroup();
        var car2CollisionGroup = game.physics.p2.createCollisionGroup();
        var ballCollisionGroup = game.physics.p2.createCollisionGroup();

        var wallsCG =  game.physics.p2.createCollisionGroup();
        var Goal1CG =  game.physics.p2.createCollisionGroup();
        Goal1CG.name = "Goal1";
        var Goal2CG =  game.physics.p2.createCollisionGroup();
        Goal2CG.name = "Goal2";
        // game.physics.p2.updateBoundsCollisionGroup();

        //Set Collision Groups
        self.cars[0].body.setCollisionGroup(car1CollisionGroup);
        self.cars[1].body.setCollisionGroup(car2CollisionGroup);
        ball.body.setCollisionGroup(ballCollisionGroup);

        var walls = game.physics.p2.convertCollisionObjects(self.map, "Walls", true);
        for(var wall in walls)
        {
            walls[wall].setCollisionGroup(wallsCG);
            walls[wall].collides([car1CollisionGroup, car2CollisionGroup, ballCollisionGroup]);
        }
        var goals = game.physics.p2.convertCollisionObjects(self.map, "Goals", true);
        for(var goal in goals)
        {
            if(goal.name="Goal1"){
            goals[goal].setCollisionGroup(Goal1CG);
            goals[goal].collides(ballCollisionGroup,self.stopCar, this);
            }
            if(goal.name="Goal2"){
            goals[goal].setCollisionGroup(Goal2CG);
            goals[goal].collides(ballCollisionGroup,self.stopCar, this);
            }
        }

        //Set Collision
        self.cars[0].body.collides([car2CollisionGroup, ballCollisionGroup]);
        self.cars[0].body.collides(wallsCG,self.stopCar,this);
        self.cars[1].body.collides([car1CollisionGroup, ballCollisionGroup,wallsCG]);
        ball.body.collides([car1CollisionGroup, car2CollisionGroup,wallsCG]);
        ball.body.collides(Goal1CG,self.stopCar("Goal1"), this);
        ball.body.collides(Goal2CG,self.stopCar, null, this);
    },   
    stopCar: function (ball, goal, type, type1, type3, type4) {
        var self = this;

        self.score++;
            console.log("Scored in: " + type );
    },
    update: function () {
        var self = this;

        /**
         * Function to update player actions
         * @param i index of player
         * @param controls object with control actions
         */
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
            self.cars[i].body.velocity.x = self.velocity[i] * Math.cos((self.cars[i].angle - 90) * 0.01745);
            self.cars[i].body.velocity.y = self.velocity[i] * Math.sin((self.cars[i].angle - 90) * 0.01745);

            /*Rotation of Car*/
            if (controls.left) {
                if (controls.eBrake) {
                    self.cars[i].body.angularVelocity = -5 * (self.velocity[i] / 300);
                } else {
                    self.cars[i].body.angularVelocity = -5 * (self.velocity[i] / 600);
                }
            } else if (controls.right) {
                if (controls.eBrake) {
                    self.cars[i].body.angularVelocity = 5 * (self.velocity[i] / 300);
                } else {
                    self.cars[i].body.angularVelocity = 5 * (self.velocity[i] / 600);
                }
            } else {
                self.cars[i].body.angularVelocity = 0;
            }
        };

        /**
         * Player 1 controls
         * @type {{up: boolean, down: boolean, left: boolean, right: boolean, eBrake: boolean}}
         */
        var player1controls = {
            "up": game.input.keyboard.addKey(Phaser.Keyboard.UP).isDown,
            "down": game.input.keyboard.addKey(Phaser.Keyboard.DOWN).isDown,
            "left": game.input.keyboard.addKey(Phaser.Keyboard.LEFT).isDown,
            "right": game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).isDown,
            "eBrake": game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown
        };

        /**
         * Player 2 controls
         * @type {{up: boolean, down: boolean, left: boolean, right: boolean, eBrake: boolean}}
         */
        var player2controls = {
            "up": game.input.keyboard.addKey(Phaser.Keyboard.R).isDown,
            "down": game.input.keyboard.addKey(Phaser.Keyboard.F).isDown,
            "left": game.input.keyboard.addKey(Phaser.Keyboard.D).isDown,
            "right": game.input.keyboard.addKey(Phaser.Keyboard.G).isDown,
            "eBrake": game.input.keyboard.addKey(Phaser.Keyboard.Q).isDown
        };

        /**
         * Call functions to update for each player
         */
        updatePlayer(0, player1controls);
        updatePlayer(1, player2controls);
    },
};
