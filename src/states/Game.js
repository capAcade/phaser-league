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

        this.carsOption = [
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
        for(var i = 0; i < self.playerCount; i++) {
            self.cars[i] = game.add.sprite(self.carsOption[i].beginX, self.carsOption[i].beginY, self.carsOption[i].name);
            game.physics.p2.enable(self.cars[i]);
            //self.cars[i].body.loadPolygon("sprite_physics", self.carsOption[i].name);
            self.cars[i].body.collideWorldBounds = true;
            self.cars[i].body.angle = self.carsOption[i].beginAngle;
        }

        /*Adding Ball*/
        self.ball = game.add.sprite(640, 512, 'ball');
        game.physics.p2.enable(self.ball);
        //elf.ball.body.loadPolygon("sprite_physics", 'ball');
        self.ball.body.collideWorldBounds = true;

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
        self.ball.body.setCollisionGroup(ballCollisionGroup);

        var walls = game.physics.p2.convertCollisionObjects(self.map, "Walls", true);
        for(var wall in walls)
        {
            walls[wall].setCollisionGroup(wallsCG);
            walls[wall].collides([car1CollisionGroup, car2CollisionGroup, ballCollisionGroup]);
        }

        /* TODO: We can probably remove the for-loops, as we now have a seperate layer per goal. */
        var goal1 = game.physics.p2.convertCollisionObjects(self.map, "Goal1", true);
        for(var goal in goal1)
        {
            goal1[goal].setCollisionGroup(Goal1CG);
            goal1[goal].collides(ballCollisionGroup);
        }
        var goal2 = game.physics.p2.convertCollisionObjects(self.map, "Goal2", true);
        for(var goal in goal2)
        {
            goal2[goal].setCollisionGroup(Goal2CG);
            goal2[goal].collides(ballCollisionGroup);
        }

        //Set Collision
        self.cars[0].body.collides([car2CollisionGroup, ballCollisionGroup,wallsCG]);
        self.cars[1].body.collides([car1CollisionGroup, ballCollisionGroup,wallsCG]);
        self.ball.body.collides([car1CollisionGroup, car2CollisionGroup, wallsCG]);
        self.ball.body.collides([Goal1CG],self.handleGoal1, this);
        self.ball.body.collides([Goal2CG],self.handleGoal2, this);
    },   
    handleGoal1: function (){
        this.scoreGoal("Goal1");
    },
    handleGoal2: function (){
        this.scoreGoal("Goal2");
    },
    scoreGoal: function(goal) {
        var self = this;

        self.score++;
        console.log("Scored in: " + goal );

        self.resetPosition();
    },
    resetPosition: function() {
        var self = this;
        console.log(self.cars);

        for(var i = 0; i < self.playerCount; i++) {
            self.cars[i].body.x = self.carsOption[i].beginX;
            self.cars[i].body.y = self.carsOption[i].beginY;
            self.cars[i].body.angle = self.carsOption[i].beginAngle;
            self.cars[i].body.velocity.x = 0;
            self.cars[i].body.velocity.y = 0;
            self.cars[i].body.angularVelocity = 0;
        }

        self.ball.body.x = 640;
        self.ball.body.y = 512;
        self.ball.body.angle = 0;
        self.ball.body.velocity.x = 0;
        self.ball.body.velocity.y = 0;
        self.ball.body.angularVelocity = 0;
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
